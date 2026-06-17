import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          bg: "var(--heritage-bg)",
          panel: "var(--heritage-panel)",
          muted: "var(--heritage-muted)",
          gold: "var(--heritage-gold)",
          red: "var(--heritage-red)",
          ivory: "var(--heritage-ivory)",
          border: "var(--heritage-border)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        museum: "0 24px 80px rgba(0, 0, 0, 0.45)",
        glow: "0 0 44px rgba(207, 174, 95, 0.18)",
      },
      backgroundImage: {
        carbon:
          "linear-gradient(135deg, rgba(255,255,255,0.035) 25%, transparent 25%), linear-gradient(225deg, rgba(255,255,255,0.025) 25%, transparent 25%), linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%), linear-gradient(315deg, rgba(255,255,255,0.025) 25%, rgba(10,10,10,0.94) 25%)",
        racing:
          "linear-gradient(90deg, rgba(217,39,39,0.12) 0 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.055) 0 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
