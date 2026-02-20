/**
 * Sentry Client Configuration
 * This file configures Sentry for the client-side
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
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
        // Ignore network errors
        if (
          error.message.includes("NetworkError") ||
          error.message.includes("Failed to fetch") ||
          error.message.includes("Network request failed")
        ) {
          return null;
        }
      }
    }
    return event;
  },
  
  integrations: [
    ...((Sentry as any).BrowserTracing ? [
      new (Sentry as any).BrowserTracing({
        // Set sampling rate for performance monitoring
        tracePropagationTargets: [
          "localhost",
          /^https:\/\/dealonetwork\.com/,
          /^https:\/\/.*\.dealonetwork\.com/,
        ],
      }),
    ] : []),
    ...((Sentry as any).Replay ? [
      new (Sentry as any).Replay({
        // Mask all text content and user input
        maskAllText: true,
        blockAllMedia: true,
      }),
    ] : []),
  ],
  
  // Capture 100% of the transactions for performance monitoring in development
  // Reduce in production
  replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,
});



