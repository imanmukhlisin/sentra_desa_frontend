import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        terra: {
          surface: '#f4fbf2',
          'surface-dim': '#d5dcd3',
          'surface-bright': '#f4fbf2',
          'surface-container-lowest': '#ffffff',
          'surface-container-low': '#eff6ec',
          'surface-container': '#e9f0e7',
          'surface-container-high': '#e3eae1',
          'surface-container-highest': '#dde4db',
          'on-surface': '#171d18',
          'on-surface-variant': '#3b4b39',
          'inverse-surface': '#2b322c',
          'inverse-on-surface': '#ecf3ea',
          outline: '#6b7c68',
          'outline-variant': '#b9ccb5',
          'surface-tint': '#006e23',
          primary: '#006e23',
          'on-primary': '#ffffff',
          'primary-container': '#0fff5f',
          'on-primary-container': '#007125',
          'inverse-primary': '#00e553',
          secondary: '#a04110',
          'on-secondary': '#ffffff',
          'secondary-container': '#ff8853',
          'on-secondary-container': '#6e2600',
          tertiary: '#825500',
          'on-tertiary': '#ffffff',
          'tertiary-container': '#ffd7a4',
          'on-tertiary-container': '#865700',
          error: '#ba1a1a',
          'on-error': '#ffffff',
          'error-container': '#ffdad6',
          'on-error-container': '#93000a',
          background: '#f4fbf2',
          'on-background': '#171d18',
          'surface-variant': '#dde4db',
        },
        sentra: {
          bg: "#FBFBFC",
          emerald: "#1B5E20",
          green: "#2E7D32",
          light: "#388E3C",
          slate: "#1F2937",
          muted: "#64748B",
          soft: "#F5F7F5"
        }
      },
      fontFamily: {
        sans: ["Nunito Sans", "Roboto", "Arial", "sans-serif"],
        mono: ["monospace"],
        inter: ["Inter", "sans-serif"]
      },
      boxShadow: {
        flutter: "0 4px 10px rgba(0,0,0,0.05)",
        "flutter-hover": "0 10px 20px rgba(0,0,0,0.10)",
        cta: "0 8px 20px rgba(27,94,32,0.25)"
      },
      borderRadius: {
        flutter: "20px",
        promo: "28px"
      }
    }
  },
  plugins: []
};

export default config;
