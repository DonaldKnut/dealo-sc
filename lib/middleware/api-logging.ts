/**
 * API Request Logging Middleware
 * Logs all API requests with performance metrics
 */

import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/monitoring/logger";
import { performanceMonitor } from "@/lib/monitoring/performance";

export function withApiLogging(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const startTime = Date.now();
    const method = req.method;
    const path = req.nextUrl.pathname;
    const url = req.nextUrl.toString();

    try {
      const response = await performanceMonitor.measure(
        `api.${method}.${path}`,
        () => handler(req)
      );

      const duration = Date.now() - startTime;
      const statusCode = response.status;

      // Log request
      logger.logRequest(method, path, statusCode, duration);

      // Add performance headers
      response.headers.set("X-Response-Time", `${duration}ms`);
      response.headers.set("X-Request-ID", crypto.randomUUID());

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.error(
        `API Error: ${method} ${path}`,
        error as Error,
        {
          method,
          path,
          url,
          duration: `${duration}ms`,
        }
      );

      throw error;
    }
  };
}



