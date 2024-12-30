const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        display: ["Clash Display", ...defaultTheme.fontFamily.sans],
        body: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        light: {
          primary: "#3B82F6",
          secondary: "#10B981",
          background: "#F9FAFB",
          surface: "#FFFFFF",
          text: {
            primary: "#111827",
            secondary: "#4B5563",
          },
          border: "#E5E7EB",
        },
        dark: {
          primary: "#60A5FA",
          secondary: "#34D399",
          background: "#111827",
          surface: "#1F2937",
          text: {
            primary: "#F9FAFB",
            secondary: "#D1D5DB",
          },
          border: "#374151",
        },
      },
    },
  },
  plugins: [],
};
