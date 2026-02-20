import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { UserModel } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const body = await req.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return NextResponse.json(
        { message: "Email and new password are required." },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session || session.user.email !== email) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email must be verified before resetting password. Please verify your email first." },
        { status: 403 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
