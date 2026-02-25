import forms from "@tailwindcss/forms"
import typography from "@tailwindcss/typography"
import Colors from "tailwindcss/colors"

import type { Config } from "tailwindcss"

export const colors = {
  primary: Colors.blue,
  secondary: Colors.zinc,
  success: Colors.emerald,
  warning: Colors.amber,
  danger: Colors.red,
  info: Colors.sky,
  gray: Colors.zinc
}

const config: Config = {
  darkMode: "class",
  content: ["../../**/*.{vue,ts,tsx,html}"],
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
