import svgLoader from "vite-svg-loader"
import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  debug: false,
  telemetry: false,
  dev: !!parseInt(process.env.APP_DEV!),
  spaLoadingTemplate: "./ui/app-loading.html",
  // experimental: {
  //   granularCachedData: false,
  //   purgeCachedData: false,
  // },
  dir: {
    layouts: "./layouts",
    plugins: "./plugins",
    modules: "./modules",
    middleware: "./middleware",
    public: "./public",
    pages: "./src/pages"
  },

  devtools: { enabled: true },

  components: [
    { path: "../app/ui", pathPrefix: false },
    { path: "../shared/ui", pathPrefix: false }
  ],

  imports: {
    dirs: [
      "../shared/composables", 
      "../shared/lib", 
      "../shared/constants", 
      "../shared/stores", 
      "../shared/utils",
      "../src/entities",
      "../src/features",
      "../src/widgets"
    ]
  },

  devServer: {
    port: parseInt(process.env.APP_PORT || "8000", 10),
    host: process.env.APP_HOST || "0.0.0.0"
  },

  runtimeConfig: {
    public: {
      isDev: !!parseInt(process.env.APP_DEV!),
      apiUrl: process.env.APP_API_URL,
      recaptchaKey: process.env.APP_RECAPTCHA_KEY
    }
  },

  routeRules: {
    "/gateway/**": { proxy: process.env.APP_API_URL }
  },

  app: {
    pageTransition: { name: "fade", mode: "out-in" },
    layoutTransition: { name: "fade", mode: "out-in" }
  },

  modules: ["@nuxtjs/i18n", "@nuxt/icon", "@pinia/nuxt", "@vueuse/nuxt", "vue-sonner/nuxt"],

  css: ["floating-vue/dist/style.css", "@vuepic/vue-datepicker/dist/main.css", "~~/shared/assets/css/index.css"],
  // Path aliases for FSD architecture
  alias: {
    "@/shared": "./shared",
    "@/entities": "./src/entities",
    "@/features": "./src/features",
    "@/widgets": "./src/widgets",
    "@/pages": "./src/pages",
    "@/app": "./app"
  },
  i18n: {
    defaultLocale: "uz",
    restructureDir: "app",
    langDir: "locales/",
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
  compatibilityDate: "2025-07-15",

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true
  },
  vite: {
    plugins: [svgLoader({ defaultImport: "component" }), tailwindcss()]
  }
})
