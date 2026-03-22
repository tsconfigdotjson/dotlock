/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/mainview/**/*.{html,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "SF Pro Display",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
