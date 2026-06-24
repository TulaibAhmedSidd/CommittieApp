import type { Config } from "tailwindcss";

const fromVar = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const scale = (
  prefix: string,
  shades: number[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
) =>
  Object.fromEntries(shades.map((s) => [s, fromVar(`--${prefix}-${s}`)]));

const config: Config = {
  // Dark mode activates only when an ancestor has the `.dark` class
  // (not from OS prefers-color-scheme). Default = light cream.
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: fromVar("--background"),
        foreground: fromVar("--foreground"),

        primary: scale("primary"),
        accent: scale("accent"),
        surface: scale("surface"),
        ink: scale("ink"),

        border: {
          DEFAULT: fromVar("--border-100"),
          ...scale("border", [50, 100, 200, 300, 400, 500]),
        },

        success: scale("success", [50, 100, 500, 600, 700]),
        warning: scale("warning", [50, 100, 500, 600, 700]),
        danger: scale("danger", [50, 100, 500, 600, 700]),
        info: scale("info", [50, 100, 500, 600, 700]),
        muted: scale("muted", [500, 600]),

        // Legacy slate-flavoured neutrals — kept so the ~86 unswept consumer
        // files don't break. New code should reach for `surface-*` / `ink-*`
        // instead, and the secondary palette will be retired in a follow-up.
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      boxShadow: {
        premium:
          "0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -2px rgb(0 0 0 / 0.025)",
        "premium-hover":
          "0 20px 25px -5px rgb(0 0 0 / 0.10), 0 10px 10px -5px rgb(0 0 0 / 0.04)",
        card: "0 14px 40px -22px rgb(15 27 23 / 0.25)",
        floating: "0 24px 60px -28px rgb(15 27 23 / 0.30)",
        gold: "0 16px 40px -18px rgb(201 162 39 / 0.55)",
        glow: "0 18px 40px -18px rgb(var(--primary-500) / 0.55)",
      },
      fontFamily: {
        urdu: ['"Noto Nastaliq Urdu"', '"Jameel Noori Nastaleeq"', "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
