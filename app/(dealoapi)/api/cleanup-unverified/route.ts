import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { UserModel } from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const now = new Date();

    // Find and delete unverified accounts with expired tokens
    const result = await UserModel.deleteMany({
      isEmailVerified: false,
      emailVerificationTokenExpires: { $lt: now },
      status: "UNVERIFIED",
    });

    console.log(
      `Cleaned up ${result.deletedCount} expired unverified accounts`
    );

    return NextResponse.json({
      message: `Successfully cleaned up ${result.deletedCount} expired unverified accounts`,
      deletedCount: result.deletedCount,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { message: "Failed to cleanup expired accounts" },
      { status: 500 }
    );
  }
}

// Also allow GET for manual cleanup
export async function GET() {
  return POST(
    new NextRequest("http://localhost/api/cleanup-unverified", {
      method: "POST",
    })
  );
}








