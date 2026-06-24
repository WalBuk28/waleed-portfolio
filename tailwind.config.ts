import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep charcoal canvas
        ink: {
          950: "#08090c",
          900: "#0b0d11",
          850: "#0f1116",
          800: "#14171d",
          750: "#1a1e26",
          700: "#222732",
          600: "#2c3340",
        },
        // Neon emerald (primary accent)
        emerald: {
          glow: "#34d399",
          DEFAULT: "#10b981",
        },
        // Electric blue (secondary accent)
        electric: {
          glow: "#38bdf8",
          DEFAULT: "#0ea5e9",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "72rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "grid-pan": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "0% 100%" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.7" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "grid-pan": "grid-pan 20s linear infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        blink: "blink 1.1s step-end infinite",
        float: "float 6s ease-in-out infinite",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(52,211,153,0.15), 0 0 32px -8px rgba(52,211,153,0.35)",
        "glow-blue": "0 0 0 1px rgba(56,189,248,0.15), 0 0 32px -8px rgba(56,189,248,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
