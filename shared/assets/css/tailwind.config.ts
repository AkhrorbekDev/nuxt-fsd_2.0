import forms from "@tailwindcss/forms"
import typography from "@tailwindcss/typography"
import { blue, emerald, amber, red, sky, zinc } from "tailwindcss/colors"

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
  content: [
    "./app/**/*.{vue,ts,tsx,html}",
    "./shared/**/*.{vue,ts,tsx,html}",
    "./layouts/**/*.{vue,ts,tsx,html}",
    "./pages/**/*.{vue,ts,tsx,html}",
    "./components/**/*.{vue,ts,tsx,html}",
    "./plugins/**/*.{vue,ts,tsx,html}",
    "./*.{vue,ts,tsx,html}"
  ],
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
