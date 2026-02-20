import type { Config } from "tailwindcss";

const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Modern dark backgrounds that make white logo pop
        background: "#0A0E27",
        foreground: "#ffffff",

        // Brand Colors - Modular System
        brand: {
          // Primary Green (Your existing gradient colors)
          green: {
            DEFAULT: "#70f69ae1",
            light: "#5dd885",
            dark: "#10b981",
            darker: "#059669",
            gradient: "linear-gradient(135deg, #70f69ae1 0%, #5dd885 100%)",
          },
          // Premium Orange
          orange: {
            DEFAULT: "#FF6B35",
            light: "#FF8C42",
            dark: "#E85A2B",
            darker: "#D4491F",
            gradient: "linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)",
          },
          // Luxury Gold
          gold: {
            DEFAULT: "#FFD700",
            light: "#FFE55C",
            dark: "#FFC107",
            darker: "#F59E0B",
            gradient: "linear-gradient(135deg, #FFD700 0%, #FFC107 100%)",
          },
        },

        // Combined Gradients for premium feel
        gradient: {
          primary: "linear-gradient(135deg, #70f69ae1 0%, #5dd885 100%)",
          secondary: "linear-gradient(135deg, #FF6B35 0%, #FFD700 100%)",
          premium:
            "linear-gradient(135deg, #70f69ae1 0%, #FF6B35 50%, #FFD700 100%)",
          dark: "linear-gradient(135deg, #0A0E27 0%, #1a1f3a 100%)",
        },

        // Semantic Colors
        primary: {
          DEFAULT: "#70f69ae1",
          foreground: "#ffffff",
          light: "#5dd885",
          dark: "#10b981",
        },
        secondary: {
          DEFAULT: "#FF6B35",
          foreground: "#ffffff",
          light: "#FF8C42",
          dark: "#E85A2B",
        },
        accent: {
          DEFAULT: "#FFD700",
          foreground: "#0A0E27",
          light: "#FFE55C",
          dark: "#FFC107",
        },

        // UI Colors
        muted: {
          DEFAULT: "#334155",
          foreground: "#9ca3af",
        },
        border: "#334155",
        input: "#1e293b",
        ring: "#70f69ae1",

        // Extended Color Palette
        green: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        orange: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#FF6B35",
          600: "#E85A2B",
          700: "#D4491F",
          800: "#9a3412",
          900: "#7c2d12",
        },
        gold: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#FFD700",
          500: "#FFC107",
          600: "#F59E0B",
          700: "#d97706",
          800: "#b45309",
          900: "#92400e",
        },
        blue: {
          500: "#79B5EC",
          600: "#152432",
        },
        red: {
          500: "#F37877",
          600: "#3E1716",
          700: "#F24E43",
        },
        light: {
          200: "#E8E9E9",
        },

        // Premium Dark Backgrounds (white logo will pop on these)
        dark: {
          DEFAULT: "#0A0E27",
          100: "#0F172A",
          200: "#1E293B",
          300: "#334155",
          400: "#475569",
          500: "#64748B",
          600: "#94A3B8",
          700: "#CBD5E1",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-dm-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          ...fontFamily.sans,
        ],
        outfit: [
          "var(--font-dm-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          ...fontFamily.sans,
        ],
        display: [
          "var(--font-dm-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          ...fontFamily.sans,
        ],
      },
      backgroundImage: {
        appointments: "url('/assets/images/appointments-bg.png')",
        pending: "url('/assets/images/pending-bg.png')",
        cancelled: "url('/assets/images/cancelled-bg.png')",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        fadeIn: "fadeIn 0.4s ease-in-out forwards",
        slideIn: "slideIn 0.5s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
