---
name: fsd-master-orchestrator
description: A master skill that coordinates and executes all FSD-related skills (CRUD generation, i18n, widget composition, unit testing) in the correct chronological order. Use this when the user asks to build or update a full feature.
---

# FSD Master Orchestrator

This is the supreme orchestrator skill. Whenever the user requests to create, generate, or modify a full module/entity based on API, data, or cURL, you must follow this Orchestrator to ensure all specialized skills are executed sequentially without skipping any rules.

## The Execution Pipeline

Follow these exact phases in order. For each phase, you must reference and strictly enforce the rules from the corresponding specialized skill in the `.agent/skills` directory.

### Phase 1: Scaffold & Architecture (via `fsd-crud-generator`)
**Goal:** Generate the core FSD folders and files (`entities`, `features`, `widgets`, `pages`).
**Associated Skill:** `fsd-crud-generator`
1. Fetch the data from the provided URL/cURL.
2. Draft the `.model.ts`, `.store.ts`, `.api.ts`, and `.service.ts`.
3. Draft the basic `.vue` list and modal components.
*Rule Check:* Ensure all Composable functions (`useModal`, `useNuxtApp`) are assigned to variables (`const modal = useModal()`) and not chained!

### Phase 2: Translation Coverage (via `i18n-translations`)
**Goal:** Ensure 100% localization.
**Associated Skill:** `i18n-translations`
1. Review the fields generated in Phase 1.
2. Open `locales/uz.json` and `locales/ru.json` and add every missing label, placeholder, and action key.
3. Replace any hardcoded text in the newly generated `.vue` templates with `$t('...')` or `t('...')` references.

### Phase 3: UI Isolation & Composition (via `widget-composition`)
**Goal:** Enforce FSD strict isolation, shared auto-imports, and accurate component types.
**Associated Skill:** `widget-composition`
1. Audit the generated `.vue` files. Remove any manual imports from `shared/ui`—rely purely on Nuxt auto-imports.
2. Verify IModal Types & Events: Check that `declare global { interface IModal { {entity}: { id?: number } } }` exists in `.model.ts`. Ensure Modals use `@before-show` and `@before-hide` events appropriately. 
3. Verify Modal Placement: If the entity has foreign relations (e.g., assigning a standard `role_id` to a user), import an isolated widget (e.g., `RoleSelect`) inside the modal, making the modal itself a **Widget** (`widgets/{entity}`). If the modal does NOT contain external entities, it MUST be placed inside **Features** (`features/{entity}/ui`).

### Phase 4: Unit Testing (via `vitest-testing`)
**Goal:** Prove the backend connections work.
**Associated Skill:** `vitest-testing`
1. Create `__tests__/{entity}.service.spec.ts` under the feature directory.
2. Use `vi.mock()` to isolate the Piña store, Axios (`$http`), and other plugins.
3. Write test cases that verify API calls are made and that the store updates accordingly.
5. Validate all forms correctly implement `vuelidate`. Provide a walkthrough report.

### Phase 5: Continuous Skill Meta-Evolution (Self-Improvement)
**Goal:** Adapt the skills as project rules change.
If the user mentions a new global rule (for example, "all list actions should become separate menus" or "modals without foreign entities are standalone features"), first implement the request. Then, proactively navigate to the related skill `.md` instructions (`fsd-crud-generator`, `widget-composition`, etc.) and the generative `scripts/generate.js` files to bake the new rule into the templates. The framework must evolve alongside user demands automatically.

---
**Agent Instruction:** 
When executing this Master Skill, you act as the project manager. You must complete Phase 1 before moving to Phase 2, and so on. At the end of Phase 4, you can optionally present the completed task to the user using the `walkthrough` artifact.
