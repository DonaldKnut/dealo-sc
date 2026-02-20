/**
 * Structured Logging Utility
 * Provides consistent logging across the application
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";
  private isProduction = process.env.NODE_ENV === "production";

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): string {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(context && { context }),
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }),
    };

    return JSON.stringify(logEntry);
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error) {
    const formatted = this.formatMessage(level, message, context, error);

    switch (level) {
      case "debug":
        if (this.isDevelopment) {
          console.debug(formatted);
        }
        break;
      case "info":
        console.info(formatted);
        break;
      case "warn":
        console.warn(formatted);
        break;
      case "error":
        console.error(formatted);
        // In production, send to error tracking service
        if (this.isProduction && error) {
          this.sendToErrorTracking(error, context);
        }
        break;
    }
  }

  private sendToErrorTracking(error: Error, context?: LogContext) {
    // This will be integrated with Sentry
    if (typeof window !== "undefined" && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: { custom: context },
      });
    }
  }

  debug(message: string, context?: LogContext) {
    this.log("debug", message, context);
  }

  info(message: string, context?: LogContext) {
    this.log("info", message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log("warn", message, context);
  }

  error(message: string, error?: Error, context?: LogContext) {
    this.log("error", message, context, error);
  }

  /**
   * Log API request
   */
  logRequest(method: string, path: string, statusCode: number, duration: number) {
    this.info("API Request", {
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
    });
  }

  /**
   * Log performance metric
   */
  logPerformance(metric: string, value: number, unit: string = "ms") {
    this.info("Performance Metric", {
      metric,
      value: `${value}${unit}`,
    });
  }
}

export const logger = new Logger();



