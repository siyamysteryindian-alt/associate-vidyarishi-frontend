/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideRight: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-20px)" },
        },
      },
      animation: {
        slideDown: "slideDown 0.5s ease-out forwards",
        slideUp: "slideUp 0.5s ease-in forwards",
        slideRight: "slideRight 60s linear infinite",
      },
      colors: {
        brand: {
          DEFAULT: "var(--color-brand)", // #222222 (dark)
          purple: "var(--color-purple)", // #a28ef9
          mint: "var(--color-mint)", // #a4f5a6
          bg: "var(--color-bg)", // very light gray / off-white
          surface: "var(--color-surface)", // white card surface
        },
      },
      borderRadius: {
        xl: "18px",
        "2xl": "22px",
      },
      boxShadow: {
        soft: "0 6px 18px rgba(0,0,0,0.06)",
      },
      fontFamily: { sans: ["Sora", "sans-serif"] },
    },
  },
  plugins: [],
};
