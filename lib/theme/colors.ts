/**
 * Centralized Theme Colors
 * Change colors here to update the entire application
 */

export const themeColors = {
  // Primary brand colors
  primary: {
    DEFAULT: "#3b82f6", // Blue-500
    light: "#60a5fa", // Blue-400
    dark: "#2563eb", // Blue-600
    lighter: "#dbeafe", // Blue-100
    darker: "#1e40af", // Blue-800
  },

  // Background colors
  background: {
    light: "#ffffff",
    DEFAULT: "#f8fafc", // Slate-50
    dark: "#0f172a", // Slate-900
    card: "#ffffff",
    muted: "#f1f5f9", // Slate-100
  },

  // Skeleton/Loading colors - Using green gradient like dashboard
  skeleton: {
    DEFAULT: "bg-gradient-to-r from-[#70f69ae1] to-[#5dd885]", // Green gradient - matches dashboard
    light: "bg-gradient-to-r from-[#70f69ae1]/80 to-[#5dd885]/80", // Lighter gradient
    dark: "bg-gradient-to-r from-[#10b981] to-[#059669]", // Darker gradient
    shimmer: "bg-gradient-to-r from-[#70f69ae1]/60 to-[#5dd885]/60", // Shimmer effect
  },

  // Text colors
  text: {
    primary: "#0f172a", // Slate-900
    secondary: "#475569", // Slate-600
    muted: "#64748b", // Slate-500
    light: "#ffffff",
  },

  // Border colors
  border: {
    DEFAULT: "#e2e8f0", // Slate-200
    light: "#f1f5f9", // Slate-100
    dark: "#cbd5e1", // Slate-300
  },

  // Accent colors (for highlights, badges, etc.)
  accent: {
    blue: "#3b82f6",
    green: "#10b981",
    orange: "#f59e0b",
    purple: "#8b5cf6",
  },
} as const;

/**
 * Get skeleton color classes - Green gradient matching dashboard
 */
export function getSkeletonColors() {
  return {
    base: "bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] animate-pulse",
    light: "bg-gradient-to-r from-[#70f69ae1]/80 to-[#5dd885]/80 animate-pulse",
    dark: "bg-gradient-to-r from-[#10b981] to-[#059669] animate-pulse",
  };
}

/**
 * Get background color classes
 */
export function getBackgroundColors() {
  return {
    page: "bg-white dark:bg-slate-900",
    card: "bg-white dark:bg-slate-800",
    muted: "bg-slate-50 dark:bg-slate-800/50",
  };
}

/**
 * Theme configuration object
 * Use this to change the entire app theme
 */
export const appTheme = {
  colors: themeColors,
  skeleton: getSkeletonColors(),
  background: getBackgroundColors(),
} as const;

