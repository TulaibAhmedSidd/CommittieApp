import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "rgba(var(--primary-rgb), 0.05)",
          100: "rgba(var(--primary-rgb), 0.1)",
          200: "rgba(var(--primary-rgb), 0.2)",
          300: "rgba(var(--primary-rgb), 0.3)",
          400: "rgba(var(--primary-rgb), 0.4)",
          500: "var(--primary)",
          600: "var(--primary-hover)",
          700: "rgba(var(--primary-rgb), 0.7)",
          800: "rgba(var(--primary-rgb), 0.8)",
          900: "rgba(var(--primary-rgb), 0.9)",
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b", // Slate-500
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      boxShadow: {
        premium: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
        "premium-hover": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
