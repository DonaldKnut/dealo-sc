import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { UserModel } from "@/models/User";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    await connect();

    // Find user by verification code
    const user = await UserModel.findOne({
      emailVerificationCode: token,
      emailVerificationCodeExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Check if email is already verified
    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email is already verified." },
        { status: 200 }
      );
    }

    // Update user's email verification status
    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationCodeExpires = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}
