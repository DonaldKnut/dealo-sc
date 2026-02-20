import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { UserModel } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    try {
      await connect();
    } catch (connErr) {
      console.error("check-user connection error:", connErr);
      // Degrade gracefully: do not block the UX; tell client we cannot confirm
      return NextResponse.json(
        { exists: false, isEmailVerified: false, degraded: true },
        { status: 200 }
      );
    }

    const user = await UserModel.findOne({ email }).select(
      "_id email isEmailVerified firstName lastName"
    );

    if (!user) {
      return NextResponse.json({ exists: false, isEmailVerified: false });
    }

    return NextResponse.json({
      exists: true,
      isEmailVerified: !!user.isEmailVerified,
      email: user.email,
    });
  } catch (error) {
    console.error("check-user error:", error);
    // Fail soft to avoid blocking sign-in UX
    return NextResponse.json(
      { exists: false, isEmailVerified: false },
      { status: 200 }
    );
  }
}
