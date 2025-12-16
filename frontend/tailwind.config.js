/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
      keyframes: {
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
        "slide-up": { from: { transform: "translateY(8px)", opacity: 0 }, to: { transform: "translateY(0)", opacity: 1 } },
      },
      animation: {
        "fade-in": "fade-in .2s ease-out",
        "slide-up": "slide-up .2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
