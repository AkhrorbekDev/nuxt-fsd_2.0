import svgLoader from "vite-svg-loader"
import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  debug: false,
  telemetry: false,
  dev: !!parseInt(import.meta.env.APP_DEV!),

  spaLoadingTemplate: "./ui/app-loading.html",
  devtools: { enabled: true },

  alias: {
    "#shared": "./app/shared",
    "#entities": "./app/entities",
    "#features": "./app/features",
    "#widgets": "./app/widgets",
    "#pages": "./app/pages"
  },

  components: [
    { path: "./ui", pathPrefix: false },
    { path: "./shared/ui", pathPrefix: false }
  ],

  imports: {
    dirs: [
      "./shared/composables",
      "./shared/composables/**",
      "./shared/constants",
      "./shared/constants/**",
      "./shared/directives",
      "./shared/directives/**",
      "./shared/lib",
      "./shared/lib/**",
      "./shared/stores",
      "./shared/stores/**"
    ]
  },

  devServer: {
    port: parseInt(import.meta.env.APP_PORT || "8000", 10),
    host: import.meta.env.APP_HOST || "0.0.0.0"
  },

  runtimeConfig: {
    public: {
      isDev: !!parseInt(import.meta.env.APP_DEV!),
      apiUrl: import.meta.env.APP_API_URL,
      recaptchaKey: import.meta.env.APP_RECAPTCHA_KEY
    }
  },
  typescript: {
    typeCheck: true
  },
  routeRules: {
    "/gateway/**": { proxy: import.meta.env.APP_API_URL }
  },

  app: {
    pageTransition: { name: "fade", mode: "out-in" },
    layoutTransition: { name: "fade", mode: "out-in" }
  },

  modules: ["@nuxtjs/i18n", "@nuxt/icon", "@pinia/nuxt", "@vueuse/nuxt", "vue-sonner/nuxt"],

  css: ["floating-vue/dist/style.css", "@vuepic/vue-datepicker/dist/main.css", "./assets/css/main.css"],

  i18n: {
    lazy: true,
    defaultLocale: "uz",
    restructureDir: false,
    langDir: "./locales/",
    bundle: {
      optimizeTranslationDirective: false
    },
    locales: [
      {
        code: "uz",
        language: "uz",
        file: "uz.json",
        name: "O'zbekcha"
      },
      {
        code: "ru",
        language: "ru",
        file: "ru.json",
        name: "Русский"
      },
      {
        code: "en",
        language: "en",
        file: "en.json",
        name: "English"
      }
    ]
  },

  vite: {
    plugins: [svgLoader({ defaultImport: "component" }), tailwindcss()]
  }
})
