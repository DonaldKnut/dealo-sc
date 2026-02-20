/**
 * Form Theme Configuration
 * 
 * Easily customize the form appearance by modifying these values.
 * To change the form background, modify the `formBackground` property.
 */

export const formTheme = {
  // Form Container Styles - Matching Dashboard Aesthetic
  formContainer: {
    background: "bg-white/[0.02]",
    backdropBlur: "backdrop-blur-[40px]",
    borderRadius: "rounded-[3rem]",
    shadow: "shadow-2xl shadow-black/50",
    border: "border border-white/[0.05]",
    padding: "p-10 md:p-16",
    spacing: "space-y-12",
  },

  // Glow Effect Styles
  glowEffect: {
    enabled: true,
    gradient: "bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent",
    borderRadius: "rounded-[3rem]",
    blur: "blur-[80px]",
    opacity: "opacity-0 group-hover:opacity-100",
  },

  // Section Card Styles
  sectionCard: {
    background: "bg-white/[0.03]",
    borderRadius: "rounded-[1.5rem]",
    border: "border border-white/[0.08]",
    padding: "p-8",
  },

  // Section Card Variants
  sectionVariants: {
    green: "to-emerald-500/10",
    blue: "to-emerald-400/10",
    purple: "to-green-500/10",
    blueLight: "to-emerald-500/15",
    greenLight: "to-green-500/15",
  },

  // Header Styles
  header: {
    iconBackground: "bg-emerald-500/10",
    iconBorder: "border border-emerald-500/20",
    iconSize: "w-16 h-16",
    titleGradient: "bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20",
  },

  // Text Colors
  text: {
    primary: "text-white",
    secondary: "text-white/30",
    muted: "text-white/20",
    label: "text-white/30",
    heading: "text-white font-black uppercase tracking-tighter",
  },

  // Button Styles
  buttons: {
    primary: "bg-gradient-to-r from-emerald-600 to-green-600 text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-[1.25rem] hover:from-emerald-500 hover:to-green-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]",
    secondary: "px-8 py-5 font-black uppercase tracking-[0.3em] text-[10px] text-white/20 hover:text-white transition-all",
    textColor: "text-black",
    borderRadius: "rounded-[1.25rem]",
  },

  // Input Styles
  input: {
    background: "bg-white/[0.03]",
    border: "border border-white/[0.08]",
    borderRadius: "rounded-[1.25rem]",
    borderFocus: "focus:border-emerald-500/40",
    ringFocus: "focus:ring-2 focus:ring-emerald-500/20",
    text: "text-white font-bold",
    placeholder: "placeholder:text-white/10",
    backdropBlur: "backdrop-blur-sm",
    hover: "hover:border-white/20",
  },
};

/**
 * Content Configuration
 * Easily customize all text content here
 */
export const formContent = {
  header: {
    title: "Draft a New Opportunity",
    description: {
      authenticated: "Complete the details below to share your new role with the network.",
      unauthenticated: "Share this role with the world. We'll send a quick link to your email to verify.",
    },
  },
  sections: {
    skills: {
      title: "Core Competencies Required",
      placeholder: "Add specific skills...",
    },
    budget: {
      title: "Proposed Compensation (USD) *",
      placeholder: "e.g., 85000",
    },
    deadline: {
      title: "Hiring Phase Deadline *",
    },
    location: {
      title: "Operational Base",
    },
    media: {
      title: "Visual Context",
      subtitle: "(Optional)",
    },
    contact: {
      title: "Direct Communications",
    },
  },
  buttons: {
    cancel: "Discard Draft",
    submit: "Deploy Listing",
    submitting: "Deploying Listing...",
  },
  success: {
    title: "Check Your Inbox",
    message: "We've sent a verification link to your email. Click it to finalize and publish your job listing.",
    backButton: "Back to Careers",
  },
};

/**
 * Quick preset themes
 */
export const formThemes = {
  default: formTheme,

  // Light theme
  light: {
    ...formTheme,
    formContainer: {
      ...formTheme.formContainer,
      background: "bg-white",
    },
  },

  // Dark theme
  dark: {
    ...formTheme,
    formContainer: {
      ...formTheme.formContainer,
      background: "bg-gray-900/95",
    },
    glowEffect: {
      ...formTheme.glowEffect,
      gradient: "bg-gradient-to-r from-green-500/30 via-blue-500/30 to-green-500/30",
    },
  },

  // Glass morphism
  glass: {
    ...formTheme,
    formContainer: {
      ...formTheme.formContainer,
      background: "bg-white/10",
      border: "border border-white/30",
    },
  },
};

