import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
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
        sans: ["Roboto", "Arial", "sans-serif"],
        mono: ["monospace"]
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
