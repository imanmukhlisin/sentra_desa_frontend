import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sentra: {
          bg: "#f4fbf2",
          surface: "#f4fbf2",
          "surface-dim": "#d5dcd3",
          "surface-container": "#e9f0e7",
          "surface-container-low": "#eff6ec",
          "surface-container-high": "#e3eae1",
          emerald: "#006e24",
          green: "#006e24",
          light: "#10db52",
          slate: "#171d18",
          muted: "#3c4b3a",
          soft: "#eff6ec",
          outline: "#6c7b69",
          "outline-variant": "#bbcbb6",
          primary: "#006e24",
          "primary-container": "#10db52",
          secondary: "#a43d01",
          tertiary: "#825500"
        },
        terra: {
          surface: "#f4fbf2",
          "surface-dim": "#d5dcd3",
          "surface-bright": "#f4fbf2",
          "surface-lowest": "#ffffff",
          "surface-container-lowest": "#ffffff",
          "surface-low": "#eff6ec",
          "surface-container-low": "#eff6ec",
          "surface-container": "#e9f0e7",
          "surface-high": "#e3eae1",
          "surface-container-high": "#e3eae1",
          "surface-highest": "#dde4db",
          "surface-container-highest": "#dde4db",
          "on-surface": "#171d18",
          "on-surface-variant": "#3c4b3a",
          "inverse-surface": "#2b322c",
          "inverse-on-surface": "#ecf3ea",
          outline: "#6c7b69",
          "outline-variant": "#bbcbb6",
          "surface-tint": "#006e24",
          primary: "#006e24",
          "on-primary": "#ffffff",
          "primary-container": "#10db52",
          "on-primary-container": "#005a1c",
          "inverse-primary": "#27e45a",
          secondary: "#a43d01",
          "on-secondary": "#ffffff",
          "secondary-container": "#ff7e44",
          "on-secondary-container": "#682300",
          tertiary: "#825500",
          "on-tertiary": "#ffffff",
          "tertiary-container": "#ffad1f",
          "on-tertiary-container": "#6b4500",
          error: "#ba1a1a",
          "on-error": "#ffffff",
          "error-container": "#ffdad6",
          "on-error-container": "#93000a",
          "primary-fixed": "#6dff80",
          "primary-fixed-dim": "#27e45a",
          "on-primary-fixed": "#002106",
          "on-primary-fixed-variant": "#005319",
          "secondary-fixed": "#ffdbcd",
          "secondary-fixed-dim": "#ffb597",
          "on-secondary-fixed": "#360f00",
          "on-secondary-fixed-variant": "#7e2c00",
          "tertiary-fixed": "#ffddb4",
          "tertiary-fixed-dim": "#ffb952",
          "on-tertiary-fixed": "#291800",
          "on-tertiary-fixed-variant": "#633f00",
          background: "#f4fbf2",
          "on-background": "#171d18",
          "surface-variant": "#dde4db",
          "primary-deep": "#006e24",
          "secondary-deep": "#a43d01",
          "tertiary-deep": "#825500"
        }
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "'Plus Jakarta Sans'", "var(--font-roboto)", "Roboto", "Arial", "sans-serif"],
        headline: ["var(--font-jakarta)", "'Plus Jakarta Sans'", "var(--font-roboto)", "Roboto", "Arial", "sans-serif"],
        serif: ["var(--font-jakarta)", "'Plus Jakarta Sans'", "var(--font-roboto)", "Roboto", "Arial", "sans-serif"],
        inter: ["var(--font-jakarta)", "'Plus Jakarta Sans'", "var(--font-roboto)", "Roboto", "Arial", "sans-serif"],
        mono: ["monospace"]
      },
      spacing: {
        gutter: "1rem",
        margin: "1.5rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem"
      },
      boxShadow: {
        flutter: "0 4px 10px rgba(0,0,0,0.04)",
        "flutter-hover": "0 10px 20px rgba(0,0,0,0.08)",
        cta: "0 8px 20px rgba(0,110,36,0.20)"
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        card: "10px",
        flutter: "16px",
        promo: "24px"
      }
    }
  },
  plugins: []
};

export default config;
