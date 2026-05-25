import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  // Add an "xs" breakpoint for very small phones (≥420px)
  // and screens helper for "coarse" pointer (touch)
  // (we register `coarse:` as a custom variant in plugins below)

  theme: {
    screens: {
      xs: "420px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // brand
        brand: {
          50:  "var(--brand-50)",
          100: "var(--brand-100)",
          200: "var(--brand-200)",
          300: "var(--brand-300)",
          400: "var(--brand-400)",
          500: "var(--brand-500)",
          600: "var(--brand-600)",
          700: "var(--brand-700)",
          800: "var(--brand-800)",
          900: "var(--brand-900)",
          DEFAULT: "var(--brand-500)",
        },
        // accents
        secondary:    { DEFAULT: "var(--secondary)", 600: "var(--secondary-600)" },
        accent:       "var(--accent)",
        "accent-2":   "var(--accent-2)",
        // status
        success: "var(--success)",
        error:   "var(--error)",
        warning: "var(--warning)",
        info:    "var(--info)",
        // neutrals
        bg:           "var(--bg)",
        surface:      "var(--surface)",
        "surface-2":  "var(--surface-2)",
        border:       "var(--border)",
        "border-strong": "var(--border-strong)",
        text:         "var(--text)",
        "text-muted": "var(--text-muted)",
        "text-soft":  "var(--text-soft)",
        "on-brand":   "var(--on-brand)",
      },
      backgroundImage: {
        "brand-grad":  "linear-gradient(var(--grad-angle), var(--grad-from), var(--grad-to))",
        "pop-grad":    "linear-gradient(135deg, var(--secondary), var(--accent))",
        "night-grad":  "linear-gradient(135deg, var(--accent-2), #00BFFF)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body:    ["var(--font-body)", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // [size, line-height]
        "display": ["72px", { lineHeight: "0.95", letterSpacing: "-0.04em", fontWeight: "700" }],
        "h1":      ["48px", { lineHeight: "1.05", letterSpacing: "-0.035em", fontWeight: "700" }],
        "h2":      ["36px", { lineHeight: "1.1",  letterSpacing: "-0.03em",  fontWeight: "700" }],
        "h3":      ["28px", { lineHeight: "1.2",  letterSpacing: "-0.025em", fontWeight: "600" }],
        "h4":      ["22px", { lineHeight: "1.25", letterSpacing: "-0.02em",  fontWeight: "600" }],
        "lead":    ["20px", { lineHeight: "1.5" }],
        "body":    ["16px", { lineHeight: "1.55" }],
        "body-sm": ["14px", { lineHeight: "1.5" }],
        "caption": ["12px", { lineHeight: "1.4",  fontWeight: "500" }],
        "overline":["11px", { lineHeight: "1.3",  letterSpacing: "0.08em", fontWeight: "500" }],
      },
      spacing: {
        // 4-base scale (Tailwind already covers 1-96, we just add semantic aliases)
        "page-x": "1.5rem",
        "section": "6rem",
      },
      borderRadius: {
        xs:   "var(--r-xs)",
        sm:   "var(--r-sm)",
        md:   "var(--r-md)",
        lg:   "var(--r-lg)",
        xl:   "var(--r-xl)",
        "2xl":"var(--r-2xl)",
        pill: "var(--r-pill)",
      },
      boxShadow: {
        xs:        "var(--sh-xs)",
        sm:        "var(--sh-sm)",
        md:        "var(--sh-md)",
        lg:        "var(--sh-lg)",
        brand:     "var(--sh-brand)",
        secondary: "var(--sh-secondary)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(.22, 1, .36, 1)",
      },
      transitionDuration: {
        fast: "120ms",
        base: "220ms",
        slow: "380ms",
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "-400px 0" }, "100%": { backgroundPosition: "400px 0" } },
        wiggle:  { "0%,100%": { transform: "rotate(-6deg)" }, "50%": { transform: "rotate(6deg)" } },
        spin:    { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
        wiggle:  "wiggle 4s ease-in-out infinite",
        spin:    "spin 0.8s linear infinite",
      },
    },
  },
  plugins: [
    // `coarse:` variant targets touch devices (no hover capability).
    // Usage: <button className="h-9 coarse:h-11" />
    function ({ addVariant }: any) {
      addVariant("coarse", "@media (hover: none), (pointer: coarse)");
    },
  ],
};

export default config;
