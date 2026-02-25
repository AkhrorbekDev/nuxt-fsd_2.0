---
name: i18n-translations
description: Manages i18n localization in the project. Use this when the user asks to add texts to components, or when generating interfaces to ensure no hardcoded strings remain.
---

# `i18n` Locales (Tarjimalar) bilan ishlash qoidalari

Har qanday yangi interfeys ({entity}) kiritilayotganda barcha qattiq (hardcoded) matnlar `uz.json`, `ru.json` yoki kerakli til fayllarida aks ettirilishi shart. Buning qoidalari quyidagicha:

### 1-qadam: Locales qatlamida o'zgaruvchilarni qidirish
- Entity (masalan `product`) uchun API `interface IProduct` dagi barcha *key* lar til faylida (odatda `labels` yoki `placeholders` guruhi ichiga) olinganini tekshirish kerak.

### 2-qadam: Nomenklatura (Kalit so'z qoidalari)
Til fayllarida obyekt joylashuvi odatda qat'iy standartlar asosida bo'linishi kerak:
- `labels.{entity}`: Obyekt nomlari ("Foydalanuvchilar", "Mahsulotlar")
- `labels.{field}`: Ustun yoki input nomlari ("first_name", "email", "price")
- `actions.{action}`: Harakatlar ("save", "delete", "edit", "add")
- `placeholders.{field}`: Inputlar uchut joy xati ("Ismni kiriting")
- `messages.success.{action}`: Muovafaqqiyatli amallar ("Muvaffaqiyatli saqlandi")
- `messages.error.{action}`: Xatolar haqida ("Xatolik yuz berdi")

### 3-qadam: Vue komponentlarida chaqirish
`$t()` funksiyasidan foydalaniladi (Template ichida):
`{{ $t('labels.name') }}`

Script qismida kompozitsion tarzda chaqirish:
`const { t } = useI18n()`
`const title = computed(() => t('labels.users'))`

**MUHIM:** 
- Hech qanday Vue fayli ichida to'g'ridan to'g'ri o'zbek yoki rus tilidagi so'z kiritilmasligi kerak.
- Interfeysning obyektlari nomlari aniq va ishonchli `t()` funksiyasi yoxud til o'zgaruvchisi bilan chiqishi ta'minlanadi.
