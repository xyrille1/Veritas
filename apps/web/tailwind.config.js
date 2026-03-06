/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        veritas: {
          "bg-primary": "#0A1628",
          "bg-surface": "#1E3A5F",
          "bg-darker": "#112040",
          accent: "#2563EB",
          "accent-gold": "#D4A017",
          "text-primary": "#FFFFFF",
          "text-muted": "#94A3B8",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        elevated: "0 8px 32px rgba(0,0,0,0.4)",
        "glow-blue": "0 0 20px rgba(37,99,235,0.4)",
        "glow-green": "0 0 15px rgba(34,197,94,0.4)",
      },
      animation: {
        "pulse-dot": "pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-in-right": "slide-in-right 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scale-in 200ms cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
