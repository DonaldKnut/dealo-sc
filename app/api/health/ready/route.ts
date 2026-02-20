import { NextResponse } from "next/server";
import { connect } from "@/database";

/**
 * Readiness Check Endpoint
 * Used by Kubernetes/Docker to check if app is ready to receive traffic
 */
export async function GET() {
  try {
    // Check critical dependencies
    await connect();

    return NextResponse.json(
      { status: "ready" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "not ready", error: (error as Error).message },
      { status: 503 }
    );
  }
}



