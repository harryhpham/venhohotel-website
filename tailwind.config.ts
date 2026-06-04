import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal:     "#1A1A1A",
        "warm-white": "#F7F4EF",
        cream:        "#EDE8E0",
        gold:         "#C9A84C",
        "deep-navy":  "#1B2D4F",
        "mid-gray":   "#6B6B6B",
        "light-gray": "#D9D9D9",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        sans:    ["'DM Sans'", "sans-serif"],
        mono:    ["'DM Mono'", "monospace"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          md:      "1.5rem",
          xl:      "5rem",
        },
      },
      maxWidth: { site: "1440px" },
    },
  },
  plugins: [],
};
export default config;
