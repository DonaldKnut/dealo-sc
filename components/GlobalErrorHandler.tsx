"use client";

import { useEffect } from "react";

const GlobalErrorHandler = () => {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);

      // Prevent the default browser behavior
      event.preventDefault();

      // Log to external service in production
      if (process.env.NODE_ENV === "production") {
        console.error("Production unhandled rejection:", {
          reason: event.reason,
          stack: event.reason?.stack,
        });
      }
    };

    // Handle unhandled errors
    const handleError = (event: ErrorEvent) => {
      console.error("Unhandled error:", event.error);

      // Prevent the default browser behavior
      event.preventDefault();

      // Log to external service in production
      if (process.env.NODE_ENV === "production") {
        console.error("Production unhandled error:", {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error,
        });
      }
    };

    // Handle React errors that escape error boundaries
    const handleReactError = (event: any) => {
      console.error("React error:", event);

      // Log to external service in production
      if (process.env.NODE_ENV === "production") {
        console.error("Production React error:", event);
      }
    };

    // Add event listeners
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    // Listen for React errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Check if it's a React error
      const errorString = args.join(" ");
      if (
        errorString.includes("Minified React error") ||
        errorString.includes("React error") ||
        errorString.includes("insertBefore") ||
        errorString.includes("removeChild")
      ) {
        handleReactError(args);
      }

      // Call original console.error
      originalConsoleError.apply(console, args);
    };

    // Cleanup function
    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
      window.removeEventListener("error", handleError);
      console.error = originalConsoleError;
    };
  }, []);

  return null;
};

export default GlobalErrorHandler;
