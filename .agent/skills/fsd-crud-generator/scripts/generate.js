import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '../../../../src');

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Simplistic type inference from JSON value
function inferType(value) {
  if (Array.isArray(value)) return 'any[]';
  if (value === null) return 'any';
  const type = typeof value;
  if (type === 'object') return 'Record<string, any>';
  return type; // string, number, boolean
}

async function fetchData(urlSpec) {
  try {
    // If it's a cURL string (very basic extraction of URL)
    let url = urlSpec;
    if (urlSpec.startsWith('curl ')) {
      const match = urlSpec.match(/'([^']+)'|"([^"]+)"|([^\s]+)/g);
      url = match.find(m => m.startsWith('http') || m.startsWith("'http") || m.startsWith('"http')).replace(/['"]/g, '');
    }

    console.log(`Fetching data from: ${url}`);
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch or parse API data:", err.message);
    process.exit(1);
  }
}

async function generate(entityName, urlSpec) {
  const Entity = capitalize(entityName);
  const IEntity = `I${Entity}`;

  // Fetch API to understand schema
  const fetchedData = await fetchData(urlSpec);
  // Assume either array of objects or an object with a data/content array
  let sampleItem = {};
  if (Array.isArray(fetchedData) && fetchedData.length > 0) {
    sampleItem = fetchedData[0];
  } else if (fetchedData.data && Array.isArray(fetchedData.data) && fetchedData.data.length > 0) {
    sampleItem = fetchedData.data[0];
  } else if (fetchedData.content && Array.isArray(fetchedData.content) && fetchedData.content.length > 0) {
    sampleItem = fetchedData.content[0];
  } else if (typeof fetchedData === 'object') {
    sampleItem = fetchedData;
  }

  const keys = Object.keys(sampleItem);
  console.log(`\nDetected fields for ${Entity}:`, keys.join(', '));

  // Generate interface string
  let interfaceBody = keys.map(k => `  ${k}: ${inferType(sampleItem[k])};`).join('\n');
  if (!keys.includes('id')) {
    interfaceBody = `  id?: number;\n` + interfaceBody;
  }

  const dirs = [
    `entities/${entityName}`,
    `features/${entityName}/ui`,
    `pages`
  ];

  dirs.forEach(dir => {
    const fullPath = path.join(srcDir, dir);
    if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
  });

  // --- ENTITIES LAYER ---
  const globalModalContent = `declare global {\n  interface IModal {\n    ${entityName}: { id?: number };\n  }\n}\n\n`;
  const modelContent = `${globalModalContent}export interface ${IEntity} {\n${interfaceBody}\n}\n`;
  fs.writeFileSync(path.join(srcDir, `entities/${entityName}/${entityName}.model.ts`), modelContent);

  const storeContent = `import { createListStore } from "~/shared/store/list.store";\nimport { ${IEntity} } from "./${entityName}.model";\n\nexport const use${Entity}Store = createListStore<${IEntity}>("${entityName}");\n`;
  fs.writeFileSync(path.join(srcDir, `entities/${entityName}/${entityName}.store.ts`), storeContent);

  fs.writeFileSync(path.join(srcDir, `entities/${entityName}/index.ts`), `export * from "./${entityName}.model";\nexport * from "./${entityName}.store";\n`);

  // --- FEATURES LAYER ---
  const apiContent = `import { ${IEntity} } from "~/entities/${entityName}";\n\nexport const use${Entity}Api = () => {\n  const BASE_URL = "/${entityName}";\n  const { $http } = useNuxtApp();\n\n  const get${Entity}List = (params: Record<string, any>): AsyncResponseContainer<${IEntity}[]> => {\n    return $http.$get(BASE_URL, { params });\n  };\n\n  const get${Entity}ById = (id: number): AsyncResponseContainer<${IEntity}> => {\n    return $http.$get(\`\${BASE_URL}/\${id}\`);\n  };\n\n  const create${Entity} = (payload: ${IEntity}): AsyncResponseContainer<${IEntity}> => {\n    return $http.$post(BASE_URL, payload);\n  };\n\n  const update${Entity} = (payload: ${IEntity}): AsyncResponseContainer<${IEntity}> => {\n    return $http.$put(\`\${BASE_URL}/\${payload.id}\`, payload);\n  };\n\n  const delete${Entity} = (id: number): AsyncResponseContainer<void> => {\n    return $http.$delete(\`\${BASE_URL}/\${id}\`);\n  };\n\n  return { get${Entity}List, get${Entity}ById, create${Entity}, update${Entity}, delete${Entity} };\n};\n`;
  fs.writeFileSync(path.join(srcDir, `features/${entityName}/${entityName}.api.ts`), apiContent);

  const serviceContent = `import { debounce } from "lodash-es";\nimport { use${Entity}Api } from "./${entityName}.api";\nimport { use${Entity}Store } from "~/entities/${entityName}";\nimport { ${IEntity} } from "~/entities/${entityName}";\n\nexport const use${Entity}Service = () => {\n  const api = use${Entity}Api();\n  const store = use${Entity}Store();\n  const alert = useAlert();\n  const modal = useModal();\n  const { t } = useI18n();\n  const { $toast } = useNuxtApp();\n\n  const get${Entity}List = () => {\n    store.loading = true;\n    // assuming cleanParams exists or handled\n    api.get${Entity}List(store.params).then(({ content, pageable }) => {\n      store.items = content;\n      if(pageable) store.params.total = pageable.total ?? 0;\n    }).finally(() => (store.loading = false));\n  };\n\n  const filter${Entity}List = () => { store.params.page = 0; get${Entity}List(); };\n  const debouncedFilter${Entity}List = debounce(filter${Entity}List, 600);\n\n  const get${Entity} = (id: number, dto: Ref<${IEntity}>, loading: Ref<boolean>) => {\n    loading.value = true;\n    api.get${Entity}ById(id).then(({ content }) => (dto.value = content)).finally(() => (loading.value = false));\n  };\n\n  const save${Entity} = (dto: Ref<${IEntity}>, loading: Ref<boolean>) => {\n    loading.value = true;\n    const action = dto.value.id ? api.update${Entity} : api.create${Entity};\n    action(dto.value).then(() => { modal.hide("${entityName}"); $toast.success(t("messages.success.saved")); get${Entity}List(); }).finally(() => (loading.value = false));\n  };\n\n  const delete${Entity} = (id: number, name: string) => {\n    alert.confirmDelete().then((isConfirmed) => {\n      if (isConfirmed) {\n        store.loading = true;\n        api.delete${Entity}(id).then(() => { $toast.success(t("messages.info.entity_deleted", { name })); get${Entity}List(); }).finally(() => (store.loading = false));\n      }\n    });\n  };\n\n  return { get${Entity}List, filter${Entity}List, debouncedFilter${Entity}List, get${Entity}, save${Entity}, delete${Entity} };\n};\n`;
  fs.writeFileSync(path.join(srcDir, `features/${entityName}/${entityName}.service.ts`), serviceContent);

  // Vue List Template
  const menuVue = `<script setup lang="ts">\nimport { use${Entity}Service } from "~/features/${entityName}";\n\ninterface IProps {\n  id: number;\n  name: string;\n}\n\nconst props = defineProps<IProps>();\n\nconst modal = useModal();\nconst { delete${Entity} } = use${Entity}Service();\n\nconst show${Entity}Modal = () => modal.show("${entityName}", { id: props.id });\n</script>\n\n<template>\n  <ui-action-button @edit="show${Entity}Modal" @delete="delete${Entity}(id, name)" />\n</template>\n`;
  fs.writeFileSync(path.join(srcDir, `features/${entityName}/ui/${entityName}-list-menu.vue`), menuVue);

  const cols = keys.map(k => `  { name: "${k}", label: t("labels.${k}") }`).join(',\n');
  const listVue = `<script setup lang="ts">\nimport { use${Entity}Store } from "~/entities/${entityName}";\nimport { use${Entity}Service, ${Entity}ListMenu } from "~/features/${entityName}";\n\nconst { t } = useI18n();\nconst modal = useModal();\nconst store = use${Entity}Store();\nconst { get${Entity}List, filter${Entity}List, debouncedFilter${Entity}List } = use${Entity}Service();\nconst { items, loading, params } = storeToRefs(store);\n\nconst cols = computed(() => [\n${cols},\n  { name: "actions", label: t("thead.actions"), labelClass: "justify-end", dataClass: "right-0", fixed: true }\n]);\n\nconst showModal = () => modal.show("${entityName}");\nonMounted(() => get${Entity}List());\n</script>\n\n<template>\n  <div class="grow">\n    <div class="app-container mb-4 flex gap-4">\n      <ui-search-input v-model="params.keyword" @input="debouncedFilter${Entity}List" @enter="filter${Entity}List" />\n      <ui-button class="ml-auto" :label="$t('actions.add')" @click="showModal()" />\n    </div>\n    <div class="app-container">\n      <ui-table no-wrap rounded striped :loading="loading" :cols="cols" :rows="items" :empty-text="$t('placeholders.data_not_found')">\n        <template #actions="{ row }: any">\n          <${entityName}-list-menu :id="row.id" :name="row.name" />\n        </template>\n      </ui-table>\n    </div>\n  </div>\n  <ui-table-footer v-model:page="params.page" v-model:per-page="params.size" class="stuck" :total="params.total" />\n</template>\n`;
  fs.writeFileSync(path.join(srcDir, `features/${entityName}/ui/${entityName}-list.vue`), listVue);

  // Note: modal should be in features unless it contains external dependencies, so we template it directly into features.
  fs.writeFileSync(path.join(srcDir, `features/${entityName}/index.ts`), `export * from "./${entityName}.api";\nexport * from "./${entityName}.service";\nexport { default as ${Entity}List } from "./ui/${entityName}-list.vue";\nexport { default as ${Entity}ListMenu } from "./ui/${entityName}-list-menu.vue";\nexport { default as ${Entity}Modal } from "./ui/${entityName}-modal.vue";\n`);


  const pageContent = `<script setup lang="ts">\nimport { ${Entity}List } from "~/features/${entityName}";\n\nconst { t } = useI18n();\nuseHead({ title: t("labels.${entityName}") });\n</script>\n\n<template>\n  <section class="flex w-full flex-col gap-4">\n    <page-header :label="$t('labels.${entityName}s')" :description="$t('descriptions.${entityName}s')" />\n    <${entityName}-list />\n  </section>\n</template>\n`;
  fs.writeFileSync(path.join(srcDir, `pages/${entityName}s.vue`), pageContent);

  console.log(`\n✅ Successfully generated FSD structure for [${entityName}] from API spec!`);
  console.log(`⚠️  Next steps:`);
  console.log(` - Add translations to locales/uz.json and locales/ru.json for keys: ${keys.join(', ')}`);
  console.log(` - Build the ${entityName}-modal.vue file inside features/${entityName}/ui/ using proper IModal typing and correct Modal events (@before-show, @before-hide).`);
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node generate.js <entityName> <url_or_curl>");
  console.error("Example: node generate.js post https://jsonplaceholder.typicode.com/posts");
  process.exit(1);
}

generate(args[0], args.slice(1).join(' '));
