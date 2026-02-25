---
name: widget-composition
description: Enforces the use of Widgets composition rules. Use this skill to cross-reference entities inside forms (e.g., using role selection inside a user form) without breaking FSD isolation.
---

# `Widgets` bilan ishlash qoidalari

Loyihadagi entity lar bir-biri bilan o'zaro (masalan: foydalanuvchini qo'shayotganda rollarni tanlash) bo'lganda quyidagi tamoyillarga asoslanadi:

### 1-qadam: Mustaqil komponent tayyorlash
- Tarmoqdagi eng yaxshi prinsiplardan biri, bir entity ni boshqasi bilmasligi kerak (`FSD`ning izolyatsiya prinsipi). 
- Shu bois, biron bir ro'yxatni tanlash amaliyotini faqatgina `widget/` (yoki maxsus `features/`) qatlamidan tayyor komponent sifatida chaqiriladi.
- Misol tariqasida `widgets/role/ui/role-select.vue` degan fayl (komponent) ishlab chiqilgan bo'lsa. Ichida faqat ro'yxat shakllantirish, `options` ni tortish hisoblanadi.

### 2-qadam: Uni yangi Forma (`features/` yoki `widgets/`) ichiga o'rnatish
- Modal (Forma) qayerga yozilishini uning "tarkibi" aniqlaydi. 
  - **A:** Agar Modal faqatgina bitta qatlamga (o'zini ichki maydonlariga) daxldor bo'lsa (Masalan oddiy "Role name" ga ega Role Modal), u holda u `features/{entity}/ui` papkasining o'zida yozilishi kerak.
  - **B:** Agar Forma ichki `entity` dan tashqari boshqa tashqi ro'yxatlarga muhtoj bo'lsa (Masalan "User Role" ni tanlatuvchi select komponent ulangan bo'lsa), unda bu modal to'laqonli **Widget** ga aylanadi va `widgets/{entity}/ui` papkasiga ko'chib yozilishi shart.
- Izolyatsiya nuqtai nazaridan importlar eng quyi yoki o'zidan pastki qavatlarga bo'lishiga ishonch qilish kerak (`features/` aslo `widgets/` dan import olmaydi!). Batafsil izolyatsiya tekshiruvi muhim. 

### 3-qadam: `shared/` qatlamidan UI vizualizatsiyaga qat'iy rioya
- Bu yerda asoliy rolni `shared/ui/` qatlamlari (Misol: `ui-select`, `ui-input`, `ui-button`) lardan foydalanish shart qilib belgilangan.
- Boshqa hech qanday standart HTML teg `button` yoki boshqa raw form instancelar ishlatilmaydi. Componentni to'liq encapsulation xolatiga o'tkaziladi.
- Vueform multiselect ishlatilishi lozim bo'lsa aynan oldindan tayyorlangan wrapper orqali amalga oshiriladi.
- **Shared komponentlarni import qilish qat'iyan man qilinadi**: `shared/ui` ichidagi komponentlar fayllar ichida `import` kodlari orqali chaqirilmasligi kerak, Nuxt tomonidan avtomatik ravishda import qilinishiga tayaniladi.
- **Composable lardan to'g'ri foydalanish (useModal va boshqalar)**: Composaban funksiyalarni to'g'ridan to'g'ri chaining usulida (`useModal().show()`) emas, balki doimo oldin `const` o'zgaruvchiga olib, keyin ishlatish shart (Misol: `const modal = useModal(); modal.show()`).
