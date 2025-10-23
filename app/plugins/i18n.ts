import dayjs from "dayjs"

import "dayjs/locale/en"
import "dayjs/locale/ru"
import "dayjs/locale/uz-latn.js"

export default defineNuxtPlugin((nuxtApp) => {
  const { $i18n } = useNuxtApp()

  const locales = {
    uz: "uz-latn",
    ru: "ru",
    en: "en"
  }

  dayjs.locale(locales[$i18n.locale.value])

  nuxtApp.hook("i18n:localeSwitched", () => {
    dayjs.locale(locales[$i18n.locale.value])
  })
})
