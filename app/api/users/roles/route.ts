import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { UserRoleModel } from "@/models/UserRole";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    // Get user's role
    const userRole = await UserRoleModel.findOne({ userId: session.user.id })
      .populate("userId", "firstName lastName avatar")
      .lean();

    if (!userRole) {
      // Create default role for new users
      const newRole = await UserRoleModel.create({
        userId: session.user.id,
        role: "freelancer", // Default role
        title: "Freelancer",
        isVerified: false,
      });

      return NextResponse.json({
        success: true,
        role: newRole,
      });
    }

    return NextResponse.json({
      success: true,
      role: userRole,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, title, isVerified, verificationBadge } = await req.json();

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    await connect();

    // Update or create user role
    const userRole = await UserRoleModel.findOneAndUpdate(
      { userId: session.user.id },
      {
        role,
        title: title || role.charAt(0).toUpperCase() + role.slice(1),
        isVerified: isVerified || false,
        verificationBadge: verificationBadge || undefined,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      role: userRole,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}
