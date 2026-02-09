import forms from "@tailwindcss/forms"
import typography from "@tailwindcss/typography"
import { amber, blue, emerald, red, sky, zinc } from "tailwindcss/colors"

import type { Config } from "tailwindcss"

export const colors = {
  primary: blue,
  secondary: zinc,
  success: emerald,
  warning: amber,
  danger: red,
  info: sky,
  gray: zinc
}

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{vue,ts,tsx,html}"],
  plugins: [forms({ strategy: "class" }), typography()],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      },
      screens: {
        "3xl": "1920px"
      }
    }
  }
}

export default config
