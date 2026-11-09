import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        asphalt: "#08090d",
        panel: "#111218",
        graphite: "#191a21",
        line: "rgba(255,255,255,0.11)",
        apex: "#e10600",
        ember: "#ff8700",
        mint: "#00d2be",
        signal: "#ffd12e"
      },
      boxShadow: {
        glow: "0 18px 70px rgba(0, 0, 0, 0.45)"
      },
      fontFamily: {
        sans: ["Arial", "Helvetica Neue", "Helvetica", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
