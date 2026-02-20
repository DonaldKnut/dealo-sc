import { NextResponse } from "next/server";

/**
 * Liveness Check Endpoint
 * Used by Kubernetes/Docker to check if app is alive
 */
export async function GET() {
  return NextResponse.json(
    { status: "alive", timestamp: new Date().toISOString() },
    { status: 200 }
  );
}



