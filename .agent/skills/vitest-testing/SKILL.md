---
name: vitest-testing
description: Guidelines for generating Unit Tests using Vitest. Use this skill whenever requested to create tests for an existing or newly created module, store, or service.
---

# `Vitest` orqali Test (Unit) Yozish Yo'riqnomasi

Loyihada ishlab chiqilgan har bir biznes mantiq (`features/*.service.ts` kabi xizmatlar, `entities/*.store.ts` storelar, va utils funksiyalar) Vitest orqali qoplonishi kerak:

### 1-qadam: Test faylini yaratish
- Test fayllarini asosan `__tests__` degan alohida papkada saqlash yoki fayl oldidan `.spec.ts` nomi bilan qo'shish kutiladi (Masalan: `features/product/product.service.spec.ts`).

### 2-qadam: Obyektlarni MOCK (Qalbaki namuna) qilish
- `vi.mock()` yordamida ilovaga (Vue/Nuxt plugins yoki store) qaram bo'lgan barcha qismlarni izolatsiya qilish.
- Masalan, `useNuxtApp()`, `useI18n()`, Axios kabi instance larni mocking qilish zaruran.

### 3-qadam: Test guruhlari (`describe`) va qadamlari (`it` yoki `test`)
Test blokini maqsadga yo'naltirilgan holda yozing:
- `describe("Product Service", () => { ... })`: Mantiqning asosiy guruhi.
- `it("should fetch product list and update store", async () => { ... })`: Test nima kutilayotgani va qanday xotimani tekshirayotgani.
  
### 4-qadam: Assertions (Natijani Tekshirish)
Kutilgan qiymatlarni API'dan so'ng xolatga ta'sir qilishini tekshirish:
- `expect(store.items).toEqual(mockData)`
- `expect(store.loading).toBe(false)`
- Funksiya yoki emitlar aniq necha martta ishga tushganini nazorat qilish `expect(apiCall).toHaveBeenCalledTimes(1)`.

### Eslab Qoling!
- Har bir yangi CRUD qism kiritilganda, eng kamida muvaffaqiyatli saqlash va olib kelish ketma-ketliklari to'liq Vitest unit testingdan o'tishi yozilmagunicha, qadam yopiq deb hisoblanmaydi.
