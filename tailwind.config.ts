import type { Config } from "tailwindcss";

/**
 * Referencia de paleta B2B — en Tailwind v4 los tokens activos
 * viven en src/app/globals.css (@theme inline).
 * Este archivo documenta la configuración de diseño del proyecto.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#FAFAFA",
        foreground: "#1F2937",
        surface: "#FFFFFF",
        "surface-elevated": "#F3F4F6",
        muted: "#6B7280",
        border: "#E5E7EB",
        accent: {
          DEFAULT: "#1E293B",
          hover: "#0F172A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
