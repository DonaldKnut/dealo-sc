/**
 * Sentry Configuration
 * Error tracking and performance monitoring
 */

// Client-side Sentry initialization
export function initSentryClient() {
  if (typeof window === "undefined") return;

  // Only initialize in production
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    console.warn("Sentry DSN not configured. Error tracking disabled.");
    return;
  }

  // Dynamic import to avoid bundling Sentry in development
  import("@sentry/nextjs").then((Sentry) => {
    const integrations: any[] = [];
    
    // Try to add BrowserTracing if available (may not be in all Sentry versions)
    const SentryAny = Sentry as any;
    if (SentryAny.BrowserTracing) {
      integrations.push(
        new SentryAny.BrowserTracing({
          tracePropagationTargets: [
            "localhost",
            /^https:\/\/dealonetwork\.com/,
            /^https:\/\/.*\.dealonetwork\.com/,
          ],
        })
      );
    }
    
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1, // 10% of transactions
      environment: process.env.NODE_ENV,
      enabled: true,
      beforeSend(event, hint) {
        // Filter out non-critical errors
        if (event.exception) {
          const error = hint.originalException;
          if (error instanceof Error) {
            // Ignore network errors
            if (error.message.includes("NetworkError") || 
                error.message.includes("Failed to fetch")) {
              return null;
            }
          }
        }
        return event;
      },
      integrations,
    });
  });
}

// Server-side Sentry initialization
export function initSentryServer() {
  if (typeof window !== "undefined") return;

  // Only initialize in production
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    return;
  }

  // Dynamic import
  import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
      environment: process.env.NODE_ENV,
      enabled: true,
    });
  });
}

/**
 * Capture exception
 */
export async function captureException(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV !== "production") {
    console.error("Error (not sent to Sentry in development):", error, context);
    return;
  }

  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureException(error, {
      contexts: { custom: context },
    });
  } catch (err) {
    console.error("Failed to send error to Sentry:", err);
  }
}

/**
 * Capture message
 */
export async function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[${level}] ${message}`);
    return;
  }

  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureMessage(message, level);
  } catch (err) {
    console.error("Failed to send message to Sentry:", err);
  }
}



