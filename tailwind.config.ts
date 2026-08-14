import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-sunk": "var(--bg-sunk)",
        surface: "var(--surface)",
        raised: "var(--raised)",

        line: "var(--border)",
        "line-strong": "var(--border-strong)",

        ink: "var(--text)",
        muted: "var(--muted)",
        faint: "var(--faint)",

        accent: "var(--accent)",
        "accent-strong": "var(--accent-strong)",
        "accent-soft": "var(--accent-soft)",
        "on-accent": "var(--on-accent)",

        "read-bg": "var(--read-bg)",
        "read-text": "var(--read-text)",

        concept: "var(--concept)",
        "concept-soft": "var(--concept-soft)",
        article: "var(--article)",
        "article-soft": "var(--article-soft)",
        quiz: "var(--quiz)",
        "quiz-soft": "var(--quiz-soft)",

        success: "var(--success)",
        "success-soft": "var(--success-soft)",
        danger: "var(--danger)",
        "danger-soft": "var(--danger-soft)",
        reward: "var(--reward)",
        "reward-soft": "var(--reward-soft)",

        ground: "var(--ground)",
        road: "var(--road)",
        "sky-1": "var(--sky-1)",
        "sky-2": "var(--sky-2)",

        // Product data, identical in both modes
        "hl-yellow": "var(--hl-yellow)",
        "hl-blue": "var(--hl-blue)",
        "hl-pink": "var(--hl-pink)",
        "hl-green": "var(--hl-green)",

        // Kept so any not-yet-migrated markup still resolves to the new accent
        "brand-primary": "var(--accent)",

        background: "var(--bg)",
        foreground: "var(--text)",
      },
      fontFamily: {
        sans: ["var(--font-literata)", "Georgia", "serif"],
        serif: ["var(--font-literata)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // One scale. No arbitrary values.
        label: ["11px", { lineHeight: "1", letterSpacing: ".10em" }],
        meta: ["12.5px", { lineHeight: "1.45" }],
        ui: ["14.5px", { lineHeight: "1.5" }],
        h3: ["19px", { lineHeight: "1.25", letterSpacing: "-.01em" }],
        h2: ["26px", { lineHeight: "1.15", letterSpacing: "-.02em" }],
        h1: ["36px", { lineHeight: "1.08", letterSpacing: "-.025em" }],
        display: ["56px", { lineHeight: "1.02", letterSpacing: "-.03em" }],
        // Mobile steps
        "h1-sm": ["27px", { lineHeight: "1.1", letterSpacing: "-.022em" }],
        "display-sm": ["34px", { lineHeight: "1.05", letterSpacing: "-.028em" }],
      },
      spacing: {
        // 4px base
        s1: "4px",
        s2: "8px",
        s3: "12px",
        s4: "16px",
        s5: "24px",
        s6: "32px",
        s7: "48px",
        s8: "72px",
      },
      borderRadius: {
        sm: "4px",   // chips, bars
        md: "8px",   // inputs, buttons
        lg: "14px",  // cards
        xl: "24px",  // hero, sheets
      },
      boxShadow: {
        sh1: "var(--sh1)",
        sh2: "var(--sh2)",
        sh3: "var(--sh3)",
      },
      backgroundImage: {
        sky: "linear-gradient(180deg, var(--sky-1) 0%, var(--bg) 260px)",
      },
    },
  },
  plugins: [typography],
};
export default config;
