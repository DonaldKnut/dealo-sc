import { NextResponse } from "next/server";
import { connect } from "@/database";
import { logger } from "@/lib/monitoring/logger";
import { performanceMonitor } from "@/lib/monitoring/performance";

/**
 * Health Check Endpoint
 * Returns system health status
 */
export async function GET() {
  const startTime = Date.now();
  const health: {
    status: "healthy" | "degraded" | "unhealthy";
    timestamp: string;
    uptime: number;
    services: {
      database: "healthy" | "unhealthy";
      responseTime: number;
    };
    version: string;
  } = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: "unhealthy",
      responseTime: 0,
    },
    version: process.env.npm_package_version || "1.0.0",
  };

  try {
    // Check database connection
    const dbStart = Date.now();
    await connect();
    const dbDuration = Date.now() - dbStart;

    health.services.database = "healthy";
    health.services.responseTime = dbDuration;

    // Log health check
    logger.info("Health check passed", {
      responseTime: `${Date.now() - startTime}ms`,
      databaseResponseTime: `${dbDuration}ms`,
    });

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    health.status = "unhealthy";
    health.services.database = "unhealthy";

    logger.error("Health check failed", error as Error, {
      responseTime: `${Date.now() - startTime}ms`,
    });

    return NextResponse.json(health, { status: 503 });
  }
}



