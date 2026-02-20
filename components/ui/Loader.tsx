"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface LoaderProps {
  /**
   * Size of the loader
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  
  /**
   * Color variant of the loader
   * @default "white"
   */
  color?: "white" | "green" | "gray" | "cyan" | "blue";
  
  /**
   * Custom className for additional styling
   */
  className?: string;
  
  /**
   * Show text below the spinner
   */
  text?: string;
  
  /**
   * Full screen overlay loader
   */
  fullScreen?: boolean;
  
  /**
   * Inline loader (for buttons, etc.)
   */
  inline?: boolean;
}

const sizeClasses = {
  xs: "h-3 w-3 border-[1.5px]",
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-6 w-6 border-[3px]",
  xl: "h-8 w-8 border-[3px]",
};

const colorClasses = {
  white: "border-white",
  green: "border-green-500",
  gray: "border-gray-400",
  cyan: "border-cyan-500",
  blue: "border-blue-500",
};

/**
 * Universal Loader Component
 * 
 * A modular, reusable loader spinner that can be used throughout the app.
 * Supports multiple sizes, colors, and display modes (inline, fullscreen, etc.)
 * 
 * @example
 * // Inline loader in a button
 * <Loader size="sm" color="white" inline />
 * 
 * @example
 * // Full screen loader
 * <Loader size="lg" color="green" fullScreen text="Loading..." />
 * 
 * @example
 * // Simple spinner
 * <Loader />
 */
export default function Loader({
  size = "md",
  color = "white",
  className,
  text,
  fullScreen = false,
  inline = false,
}: LoaderProps) {
  const spinner = (
    <div
      className={cn(
        "animate-spin rounded-full border-b-2 border-t-transparent",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  // Full screen overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          {text && (
            <p className="text-white font-medium text-sm sm:text-base">
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Inline loader (for buttons, etc.)
  if (inline) {
    return (
      <div className="flex items-center gap-2">
        {spinner}
        {text && <span className="text-sm">{text}</span>}
      </div>
    );
  }

  // Centered loader with optional text
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {spinner}
      {text && (
        <p className="text-gray-300 font-medium text-sm sm:text-base">
          {text}
        </p>
      )}
    </div>
  );
}

/**
 * Button Loader - Optimized for use inside buttons
 */
export function ButtonLoader({
  size = "sm",
  color = "white",
  text,
}: Pick<LoaderProps, "size" | "color" | "text">) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "animate-spin rounded-full border-b-2 border-t-transparent",
          sizeClasses[size],
          colorClasses[color]
        )}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && <span className="text-sm font-medium">{text}</span>}
    </div>
  );
}

/**
 * Page Loader - For full page loading states
 */
export function PageLoader({
  text = "Loading...",
  size = "lg",
  color = "green",
}: {
  text?: string;
  size?: LoaderProps["size"];
  color?: LoaderProps["color"];
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black">
      <div className="flex flex-col items-center gap-4">
        <Loader size={size} color={color} />
        {text && (
          <p className="text-white font-medium text-lg">{text}</p>
        )}
      </div>
    </div>
  );
}


