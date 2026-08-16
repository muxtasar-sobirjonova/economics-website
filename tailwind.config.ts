import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        tropic: "var(--tropic)",
        "tide-mint": "var(--tide-mint)",
        'sky-blue': "var(--sky-blue)",
        'pale-blue': "var(--pale-blue)",
        "shell-cream": "var(--shell-cream)",
        white: "var(--white)",
        "brand-yellow": "#FFF9C4",
        "brand-purple": "#E8D6FF",
        "brand-blue": "#D6E8FF",
        "brand-primary": "#7B6FE7",
        brand: {
          50: '#F5F3FF',
          100: '#EBE5FF',
          200: '#D4C6FF',
          300: '#BCA6FF',
          400: '#9D85FF',
          500: '#7B6FE7',
          600: '#6453D4',
          700: '#51487F',
          800: '#362A5C',
          900: '#2A1F4C',
          950: '#1A1A3E',
        },
        "roadmap-card-bg": "#d1aefc",
        "roadmap-card-border": "#EBE5FF",
        "gray-border": "#EBEBEB",

        /* ── Design-system v2. Added alongside the names above so pages can
           migrate one at a time; nothing here overrides an existing name. ── */
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
        "sky-1": "var(--sky-1)",
        "sky-2": "var(--sky-2)",
      },
      fontFamily: {
        // Inter stays the default; Literata is opt-in per migrated page.
        reading: ["var(--font-literata)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        label: ["11px", { lineHeight: "1", letterSpacing: ".10em" }],
        meta: ["12.5px", { lineHeight: "1.45" }],
        ui: ["14.5px", { lineHeight: "1.5" }],
        h3: ["19px", { lineHeight: "1.25", letterSpacing: "-.01em" }],
        h2: ["26px", { lineHeight: "1.15", letterSpacing: "-.02em" }],
        h1: ["36px", { lineHeight: "1.08", letterSpacing: "-.025em" }],
        display: ["56px", { lineHeight: "1.02", letterSpacing: "-.03em" }],
        "h1-sm": ["27px", { lineHeight: "1.1", letterSpacing: "-.022em" }],
        "display-sm": ["34px", { lineHeight: "1.05", letterSpacing: "-.028em" }],
      },
      spacing: {
        s1: "4px", s2: "8px", s3: "12px", s4: "16px",
        s5: "24px", s6: "32px", s7: "48px", s8: "72px",
      },
      borderRadius: {
        sm: "4px", md: "8px", lg: "14px", xl: "24px",
      },
      boxShadow: {
        sh1: "var(--sh1)", sh2: "var(--sh2)", sh3: "var(--sh3)",
      },
      backgroundImage: {
        sky: "linear-gradient(180deg, var(--sky-1) 0%, var(--bg) 320px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [typography],
};
export default config;
