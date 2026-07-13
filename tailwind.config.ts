import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#F5F7F8",
        surface: "#EDF4F8",
        foreground: "#050A0E",
        muted: "#2C373F",
        brand: {
          DEFAULT: "#5C60CC",
          soft: "#D0D2F0",
        },
        accent: "#8672CA",
        footer: "#0D141A",
        border: "#CFE2EC",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 8px 24px rgba(5, 10, 14, 0.08)",
      },
      maxWidth: {
        container: "1240px",
      },
      // Marketing type scale. Use clamp() so each token fluidly resizes
      // between mobile and desktop without per-breakpoint overrides.
      // Use these instead of arbitrary `text-[44px] md:text-[64px]` pairs.
      fontSize: {
        display: [
          "clamp(2.25rem, 4.5vw + 1rem, 4rem)",
          { lineHeight: "1.05", fontWeight: "500" },
        ],
        h1: ["clamp(1.875rem, 3vw + 1rem, 3rem)", { lineHeight: "1.1" }],
        h2: ["clamp(1.5rem, 1.5vw + 1rem, 2.125rem)", { lineHeight: "1.2" }],
        h3: ["clamp(1.25rem, 0.75vw + 1rem, 1.5rem)", { lineHeight: "1.25" }],
        eyebrow: [
          "clamp(0.75rem, 0.25vw + 0.7rem, 1.125rem)",
          { lineHeight: "1.4", letterSpacing: "0.02em" },
        ],
        "body-lg": [
          "clamp(1rem, 0.5vw + 0.85rem, 1.25rem)",
          { lineHeight: "1.4" },
        ],
      },
      spacing: {
        // Minimum tap target (iOS HIG / Material). Use `min-h-tap` on
        // anything interactive that doesn't already meet 44px.
        tap: "44px",
        // Page top offset that clears the absolute Header. Mobile/desktop
        // values are switched via the `--header-offset` CSS variable in
        // globals.css. Use `pt-header` on hero sections.
        header: "var(--header-offset)",
      },
    },
  },
};

export default config;
