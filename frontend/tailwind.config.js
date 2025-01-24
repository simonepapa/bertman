import daisyui from "daisyui"
import themes from "daisyui/src/theming/themes"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {}
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...themes["light"],
          primary: "#FF5733",
          secondary: "#FF8F00",
          accent: "#4A90E2",
          neutral: "#B0BEC5",
          info: "#0000ff",
          success: "#28A745",
          warning: "#FFC107",
          error: "#DC3545"
        }
      },
      {
        dark: {
          ...themes["dark"],
          primary: "#FF5733",
          secondary: "#FF8F00",
          accent: "#4A90E2",
          neutral: "#B0BEC5",
          info: "#0000ff",
          success: "#28A745",
          warning: "#FFC107",
          error: "#DC3545"
        }
      }
    ]
  },
  darkMode: ["class", '[data-theme="dark"]']
}
