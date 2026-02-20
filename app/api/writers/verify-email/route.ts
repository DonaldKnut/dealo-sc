import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { WriterModel } from "@/models/Writer";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 }
      );
    }

    await connect();

    const writer = await WriterModel.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpires: { $gt: new Date() },
    });

    if (!writer) {
      // Check if writer exists but token is expired
      const expiredWriter = await WriterModel.findOne({
        emailVerificationToken: token,
      });

      if (expiredWriter) {
        return NextResponse.json(
          { message: "Verification link has expired" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: "Invalid verification token" },
        { status: 400 }
      );
    }

    // Check if already verified
    if (writer.isEmailVerified) {
      return NextResponse.json(
        { message: "Email is already verified." },
        { status: 200 }
      );
    }

    // Verify the email
    writer.isEmailVerified = true;
    writer.emailVerificationToken = undefined;
    writer.emailVerificationTokenExpires = undefined;
    await writer.save();

    return NextResponse.json({
      status: "success",
      message: "Email verified successfully",
      writerId: writer._id,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
