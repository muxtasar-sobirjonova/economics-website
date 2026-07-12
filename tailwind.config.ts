import type { Config } from "tailwindcss";

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
        "roadmap-card-bg": "#d1aefc",
        "roadmap-card-border": "#EBE5FF",
        "gray-border": "#EBEBEB",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
