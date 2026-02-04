import { VueReCaptcha } from "vue-recaptcha-v3"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueReCaptcha, {
    siteKey: nuxtApp.$config?.public?.recaptchaKey,
    loaderOptions: {
      autoHideBadge: true
    }
  })
})
