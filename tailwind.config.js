/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        purple: { DEFAULT: "#7c3aed", light: "#8b5cf6", dark: "#5b21b6" },
        pink:   { DEFAULT: "#ec4899" },
        amber:  { DEFAULT: "#f59e0b" },
        cyan:   { DEFAULT: "#06b6d4" },
        emerald:{ DEFAULT: "#10b981" },
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body:    ["DM Sans", "sans-serif"],
      },
      backgroundImage: {
        "grad-main":  "linear-gradient(135deg,#7c3aed,#ec4899,#f59e0b)",
        "grad-btn":   "linear-gradient(135deg,#7c3aed,#ec4899)",
        "grad-teal":  "linear-gradient(135deg,#06b6d4,#10b981)",
        "grad-amber": "linear-gradient(135deg,#f59e0b,#ec4899)",
      },
      borderRadius: { "2xl":"1rem","3xl":"1.25rem","4xl":"1.5rem" },
      animation: {
        "spin-slow": "spin 1s linear infinite",
      },
    },
  },
  plugins: [],
};