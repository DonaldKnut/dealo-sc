import { ReactNode } from "react";

// Simple className utility
function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  background?: "default" | "dark" | "gradient" | "transparent";
  container?: boolean;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

const backgroundClasses = {
  default: "bg-white",
  dark: "bg-gray-800/30 backdrop-blur-sm",
  gradient: "bg-gradient-to-br from-green-600 to-green-700",
  transparent: "bg-transparent",
};

const paddingClasses = {
  none: "",
  sm: "py-8",
  md: "py-16",
  lg: "py-24",
  xl: "py-32",
};

/**
 * SectionWrapper - Standardized section container component
 * Handles consistent spacing, max-width, and responsive design
 */
export default function SectionWrapper({
  children,
  className,
  background = "default",
  container = true,
  padding = "md",
}: SectionWrapperProps) {
  return (
    <section
      className={cn(
        backgroundClasses[background],
        paddingClasses[padding],
        className
      )}
    >
      {container ? (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}

