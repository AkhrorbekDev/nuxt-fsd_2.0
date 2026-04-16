# Feature-Sliced Design (FSD) for Nuxt 4

---

**Node version:** v22.x.x

**Yarn version:** v1.22.x

---

```bash

# Install dependencies
yarn install --frozen-lockfile

# Run dev server
yarn dev

# Build for development
yarn build:dev

# Build for staging
yarn build:staging

# Build for production
yarn build
```

## Project conventions

- Root-level FSD slices are intentional: `app/`, `pages/`, `entities/`, `features/`, `widgets/`, `shared/`
- `pages/` stays at the project root and is wired through `dir.pages`, so Nuxt routing works without moving route files into `app/`
- `~` and `@` resolve to `app/`
- `~~` and `@@` resolve to the project root
- Preferred aliases for new code are `#shared`, `#entities`, `#features`, `#widgets`, `#pages`
- Auto-import is limited to shared cross-cutting code from `shared/composables`, `shared/lib`, `shared/constants`, and `shared/stores`
- Components are auto-imported only from `app/ui` and `shared/ui`; slice UI in `entities`, `features`, and `widgets` should stay explicitly imported via public APIs
