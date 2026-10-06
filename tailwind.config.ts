import type { Config } from "tailwindcss";

// Tokens live in app/globals.css. See docs/DESIGN_SYSTEM.md.
const v = (name: string) => `rgb(var(${name}) / <alpha-value>)`;
const scale = (prefix: string, shades: number[]) => Object.fromEntries(shades.map((s) => [s, v(`--${prefix}-${s}`)]));

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: scale("primary", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        surface: { DEFAULT: v("--surface-100"), ...scale("surface", [50, 100, 200, 300]) },
        ink: scale("ink", [300, 400, 500, 600, 700, 800, 900]),
        line: v("--line"),
        success: scale("success", [50, 100, 600, 700]),
        warning: scale("warning", [50, 100, 500, 600, 700]),
        danger: scale("danger", [50, 100, 500, 600, 700]),
        info: scale("info", [50, 100, 600, 700]),
      },
      boxShadow: {
        card: "0 1px 2px rgb(20 24 22 / 0.04), 0 2px 8px rgb(20 24 22 / 0.04)",
        sheet: "0 -8px 32px rgb(20 24 22 / 0.12)",
      },
      borderRadius: {
        xl: "12px",
        lg: "10px",
      },
      fontFamily: {
        urdu: ['"Noto Nastaliq Urdu"', '"Jameel Noori Nastaleeq"', "serif"],
      },
      maxWidth: {
        page: "960px",
      },
    },
  },
  plugins: [],
};

export default config;
