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
          emerald: "#006e23",
          green: "#006e23",
          light: "#0fff5f",
          slate: "#171d18",
          muted: "#3b4b39",
          soft: "#eff6ec",
          outline: "#6b7c68",
          "outline-variant": "#b9ccb5",
          primary: "#006e23",
          "primary-container": "#0fff5f",
          secondary: "#a04110",
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
          "on-surface-variant": "#3b4b39",
          "inverse-surface": "#2b322c",
          "inverse-on-surface": "#ecf3ea",
          outline: "#6b7c68",
          "outline-variant": "#b9ccb5",
          "surface-tint": "#006e23",
          primary: "#006e23",
          "on-primary": "#ffffff",
          "primary-container": "#0fff5f",
          "on-primary-container": "#007125",
          "inverse-primary": "#00e553",
          secondary: "#a04110",
          "on-secondary": "#ffffff",
          "secondary-container": "#ff8853",
          "on-secondary-container": "#6e2600",
          tertiary: "#825500",
          "on-tertiary": "#ffffff",
          "tertiary-container": "#ffd7a4",
          "on-tertiary-container": "#865700",
          error: "#ba1a1a",
          "on-error": "#ffffff",
          "error-container": "#ffdad6",
          "on-error-container": "#93000a",
          background: "#f4fbf2",
          "on-background": "#171d18",
          "surface-variant": "#dde4db"
        }
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "Nunito Sans", "Roboto", "sans-serif"],
        headline: ["var(--font-inter)", "Inter", "sans-serif"],
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
        cta: "0 8px 20px rgba(0,110,35,0.20)"
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        flutter: "16px",
        promo: "24px"
      }
    }
  },
  plugins: []
};

export default config;
