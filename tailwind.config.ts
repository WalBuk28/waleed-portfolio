import type { Config } from "tailwindcss";

/**
 * Tokens for the pages not yet rebuilt (case pages until stage 4), in the coloured-glass palette
 * (DESIGN.md §4): midnight navy, jade for light and signal, violet for the one action.
 * `emerald` is now jade and `electric` is now violet; the names stay until stage 4 retires them.
 * Two tiers: accent (text, lines, glows) and mark (fills under navy text, 5:1 or better).
 * `threat` is severity data and keeps its own colours.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./experience/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#070b1c", // page deep end (footer / hero vignette)
        base: "#0a0f24", // page background: midnight navy
        surface: "#111934", // cards / panels
        raised: "#18213f", // hover / elevated panels
        edge: "rgba(160,170,203,0.14)", // hairline borders
        ink: {
          DEFAULT: "#ebeef8",
          secondary: "#b9c0d8",
          muted: "#a0aacb", // DESIGN.md muted: 8.2:1 on the ground
        },
        action: "#7d49f5", // the one action fill: white text 5.1:1
        emerald: {
          // jade
          glow: "#a8f7e0",
          accent: "#2ee6b8", // 11.9:1 on the ground
          mark: "#1fb38f", // navy text on it 7.4:1
          deep: "#0b5e4a",
        },
        electric: {
          // violet
          glow: "#d4c6ff",
          accent: "#b49aff", // 8.1:1 on the ground
          mark: "#9b7bff", // navy text on it 6.2:1
          deep: "#4c2fa8",
        },
        threat: {
          warn: "#fbbf24", // text/icon tier
          warnMark: "#d97706", // fill tier (validated)
          crit: "#f87171",
          critMark: "#ef4444", // fill tier (validated)
        },
      },
      fontFamily: {
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
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
        "glow-emerald": "0 0 24px -6px rgba(46,230,184,0.35)",
        "glow-electric": "0 0 24px -6px rgba(139,92,246,0.4)",
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
