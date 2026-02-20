/**
 * Sentry Server Configuration
 * This file configures Sentry for the server-side
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === "development",
  
  environment: process.env.NODE_ENV,
  
  // Filter out non-critical errors
  beforeSend(event, hint) {
    if (event.exception) {
      const error = hint.originalException;
      if (error instanceof Error) {
        // Ignore known non-critical errors
        if (
          error.message.includes("ECONNREFUSED") ||
          error.message.includes("ENOTFOUND")
        ) {
          return null;
        }
      }
    }
    return event;
  },
});



