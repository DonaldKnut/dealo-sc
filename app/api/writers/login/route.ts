import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/database";
import { WriterModel } from "@/models/Writer";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const body = await request.json();
    const { email, password } = body;

    // Find writer by email
    const writer = await WriterModel.findOne({ email });
    if (!writer) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!writer.isEmailVerified) {
      return NextResponse.json(
        {
          message:
            "Please verify your email before signing in. Check your inbox for a verification link.",
        },
        { status: 403 }
      );
    }

    // Check if writer is approved
    if (writer.status !== "approved") {
      return NextResponse.json(
        {
          message:
            "Your writer account is pending approval or has been rejected. Please contact support.",
        },
        { status: 403 }
      );
    }

    // Check if writer is active
    if (!writer.isActive) {
      return NextResponse.json(
        {
          message:
            "Your writer account is currently inactive. Please contact support.",
        },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, writer.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session data (you might want to use NextAuth or a similar solution)
    const sessionData = {
      writerId: writer._id,
      email: writer.email,
      firstName: writer.firstName,
      lastName: writer.lastName,
      status: writer.status,
      isActive: writer.isActive,
    };

    // For now, we'll return the session data
    // In a production environment, you should use proper session management
    return NextResponse.json(
      {
        message: "Login successful",
        writer: {
          id: writer._id,
          email: writer.email,
          firstName: writer.firstName,
          lastName: writer.lastName,
          status: writer.status,
          isActive: writer.isActive,
          totalPosts: writer.totalPosts,
          totalViews: writer.totalViews,
          totalEarnings: writer.totalEarnings,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Writer login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
