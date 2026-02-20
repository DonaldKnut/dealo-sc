import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { UserModel } from "@/models/User";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connect();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate new verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const codeExpires = new Date();
    codeExpires.setHours(codeExpires.getHours() + 24); // 24 hours

    console.log("Generated verification code:", verificationCode);
    console.log("Code type:", typeof verificationCode);
    console.log("Code length:", verificationCode.length);

    // Update user with new code
    user.emailVerificationCode = verificationCode;
    user.emailVerificationCodeExpires = codeExpires;
    await user.save();

    console.log(
      "Saved to database - emailVerificationCode:",
      user.emailVerificationCode
    );
    console.log("Database field type:", typeof user.emailVerificationCode);

    // Send verification email
    console.log("Attempting to send verification email to:", user.email);
    const emailResult = await sendVerificationEmail(
      user.email,
      user.firstName,
      user.lastName || "",
      verificationCode
    );

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error);
      return NextResponse.json(
        {
          message: "Failed to send verification email",
          error: emailResult.error,
        },
        { status: 500 }
      );
    }

    console.log("Verification email sent successfully to:", user.email);

    return NextResponse.json({
      message: "Verification email sent successfully",
      email: user.email,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { message: "Failed to resend verification email" },
      { status: 500 }
    );
  }
}
