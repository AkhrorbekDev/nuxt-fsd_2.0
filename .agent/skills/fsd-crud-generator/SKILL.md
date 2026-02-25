---
name: fsd-crud-generator
description: Generates a full FSD CRUD module from API URLs or cURL commands. Use this when the user asks to create or modify a module, entity, or feature based on API data.
---

# API-Driven FSD CRUD Skill (cURL / URL asosida)

Bu tizim AI (Agent) tomonidan qachonki yangi CRUD (Create, Read, Update, Delete) modullarini faqatgina API manzili yoki cURL kodi berilgan holatda to'g'ri tashkil etish uchun xizmat qiladi. Agent ishni ma'lum qadam/vazifa (task) bo'laklariga bo'lgan holda bosqichma-bosqich bajaradi.

## Ishni Bo'laklarga Bo'lish (Task Workflow)

Har safar ushbu skill chaqirilganda asosan quyidagi 8 qadam asosida bajarilishi qat'iyan buyuriladi.

### Qadam 1: API Strukturasi Tahlili (Data Fetching)
1. Foydalanuvchi taqdim etgan URL yoki cURL ni terminal orqali tekshiring (bunda `curl` va kerak bo'lsa `jq` yoki oddiy formatda console'ga chiqarib ko'ring).
2. Qaytgan JSON obyektidan (schema) qanday maydonlar borligini, ularning turlari (`string`, `number` yoki `boolean`) nima ekanligini ajratib oling.
3. Boshqa jadvallar (foreign keys, masalan: `role_id`, `client_id`) bormi yo'qmi nazorat qiling, bular alohida ishlash uchun kerak bo'ladi.

### Qadam 2: Tarjimalar va Mahalliylashtirish (i18n Locales)
1. Tahlil qilingan maydonlar va matnlar asosida loyihaning `locales` qatlamidagi `uz.json` va `ru.json` fayllariga barcha kalit so'zlarni (`labels.something`, `placeholders.something`) kiriting.
2. Harakatlar va xabarnomalar oldin kiritilmagan bo'lsa yangilang. (Biron bir joyda o'zbek/rus so'zi kod ichida qattiq (hardcoded) yozilib qolmasligi shart).

### Qadam 3: Entity Qatlami (`entities/{entity}`)
1. cURL asosida aniqlangan tiplardan foydalanib `entities/{entity}/{entity}.model.ts` da TypeScript Interface yaratiladi.
2. Muvaffaqiyatli ma'lumotlarni o'z ichiga ulab ketish uchun `use{Entity}Store` (Pinia loyihasining `createListStore` yordamida) yaratiladi.

### Qadam 4: Features API va Service Qatlami (`features/{entity}`)
1. **API File:** `{entity}.api.ts` ichida ko'rib chiqilgan URL manziliga so'rov (GET, POST, PUT, DELETE) yuboruvchi metodlarini yozing.
2. **Service File:** `{entity}.service.ts` faylini yozing. **Oltin Qoida**: Barcha Composable plaginlar (`useModal()`, `useNuxtApp()`, va h.k) avval o'zgaruvchiga olinishi va shundan so'ng ishlatilishi shart. (`const modal = useModal(); modal.show('...')` kabi).  Chaining (`useModal().show()`) mumkin emas!

### Qadam 5: UI Ro'yxati (`features/{entity}/ui`)
1. Ma'lumotlarni o'qish (Read) uchun jadval `{entity}-list.vue` ni yarating.
2. Jadvalga `shared/ui/` qatlamidan kerakli `ui-table` yoki infputs ishlatiladi. **Oltin Qoida:** Hech qachon ushbu sahifada `shared/ui` ni `import` orqali chaqirmang. Nuxt avto-import qiladi deb hisoblang.
3. Jadval qatori (row) ichidagi amallar (edit, delete) uchun har bir entity da yagona `{entity}-list-menu.vue` fayli alohida yaratiladi. Ana shu list-menu `{entity}-list.vue` ni ichki `<template #actions>` da ishlatiladi. (Bu aralashishni oldini oladi).

### Qadam 6: Oyna / Modal (`features/{entity}` yoki `widgets/{entity}`)
1. Create va Update qismlari uchun `{entity}-modal.vue` offcanvas popup yig'iladi. Agar modal o'zida boshqa *tashqi* modelni o'z ichiga olmasa, u holatda u oddiy feature bo'lib xizmat qiladi (`features/{entity}/ui/{entity}-modal.vue`).
2. Barcha maydonlar uchun forma tizimi o'rnatiladi. *Agar URL ma'lumotidagi biron bir ustun o'zga bir model ID siga bog'liq bo'lsa (Masalan rolni tanlash zarur bo'lsa)* unda oldindan tayyorlangan o'sha modelning Widget (`role-select.vue` kabi) yordamida izolyatsiya saqlagan holda shu formaga joylanadi va u `widgets/{entity}/ui/` ga ko'chadi.
3. Loyihada ishlatiladigan global `IModal` type iga e'tibor bering. `{entity}.model.ts` dagi typelar orasida uning qaysi ID argumentini kutishini ham `declare global { interface IModal { {entity}: { id?: number } } }` formatida yozing. Va modal eventlari uzatilayotganda standart HTML emas, `@before-show` va `@before-hide` eventlarini ishlating.

### Qadam 7: Birlashtirish va Sahifa (Pages)
1. `pages/{entity}s.vue` da yaratilgan qismlarni yig'ib bitta manzil rutiga joylang.

### Qadam 8: Unit Testing (Vitest)
1. `{entity}.service.ts` mantiqlari to'g'ri ishlashiga ishonch qilish uchun Vitest doirasida `__tests__` blokida `vi.mock()` imkoniyatlaridan foydalanib barcha test qamrovini yoping.
2. Loyihaning mantiqi buzilmaganini to'liq tekshirib keyin vazifani yopishga tayyor holga keltiring.

### Qadam 9: Skillni Rivojlantirish (Agentning O'z-o'zini Takomillashtirishi)
Loyihada yangi, qulay yondashuvlar chiqqanda yoki foydalanuvchi jiddiy va umumiy o'zgarish (masalan barcha sahifalardagi jadval actionlarini alohida komponentga bo'lish) ni so'raganda, siz avval o'sha xatolikni bir marta to'g'irlaysiz. Undan so'ng **albatta** ushbu skill (`.agent/skills/fsd-crud-generator/SKILL.md`) hujjatini va agar kerak bo'lsa uni ta'minlovchi `scripts/generate.js` faylini shu yondashuvga moslashtirib doimiy yangilab borishingiz shart. Bu loyihani generatori va skillar tizimi eski holatda qotib qolmasligini kafolatlaydi.

**Muhim Qo'shimcha**: Bu skill ni ishlatish uchun zarur bo'lsa `scripts/generate.js` faylini chaqirib yordam sifatida foydalaning.
