import type { Config } from "tailwindcss";

/**
 * Design tokens — dark, cyber-minimalist.
 *
 * Two colour tiers (validated against the dark surface #0f151b):
 *  - accent tier (UI text accents, glows, key lines): emerald.400 / electric.400
 *  - mark tier (data fills: meters, diagram nodes, severity): *.600-ish deep steps
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#05080c", // page deep end (footer / hero vignette)
        base: "#090d12", // page background
        surface: "#0f151b", // cards / panels
        raised: "#141c24", // hover / elevated panels
        edge: "rgba(148,163,184,0.14)", // hairline borders
        ink: {
          DEFAULT: "#e6edf3",
          secondary: "#9fb1c1",
          muted: "#5f7080",
        },
        emerald: {
          glow: "#5eead4",
          accent: "#34d399", // UI accent tier
          mark: "#059669", // data-mark tier (validated)
          deep: "#065f46",
        },
        electric: {
          glow: "#7dd3fc",
          accent: "#38bdf8", // UI accent tier
          mark: "#0284c7", // data-mark tier (validated)
          deep: "#075985",
        },
        threat: {
          warn: "#fbbf24", // text/icon tier
          warnMark: "#d97706", // fill tier (validated)
          crit: "#f87171",
          critMark: "#ef4444", // fill tier (validated)
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      letterSpacing: {
        wider2: "0.18em",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(148,163,184,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.05) 1px, transparent 1px)",
      },
      boxShadow: {
        "glow-emerald": "0 0 24px -6px rgba(52,211,153,0.35)",
        "glow-electric": "0 0 24px -6px rgba(56,189,248,0.35)",
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 32px -12px rgba(0,0,0,0.6)",
      },
      animation: {
        marquee: "marquee 46s linear infinite",
        blink: "blink 1.1s step-end infinite",
        "pulse-dot": "pulseDot 2.4s ease-in-out infinite",
        "spin-slow": "spin 14s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(0.82)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
