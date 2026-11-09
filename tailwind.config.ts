import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import containerQueries from "@tailwindcss/container-queries";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  plugins: [forms, containerQueries],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#6366f1", // Indigo-500
        "primary-dark": "#4f46e5",
        "background-light": "#f3f4f6", // Gray-100
        "background-dark": "#0f172a", // Slate-900
        "surface-light": "#ffffff",
        "surface-dark": "#1e293b", // Slate-800
        "sidebar-dark": "#111827", // Gray-900
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        phone: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
} satisfies Config;
