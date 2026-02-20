import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { EnterpriseModel } from "@/models/Enterprise";
import { EnterpriseInviteModel } from "@/models/EnterpriseInvite";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, role = "employee" } = await req.json();
    if (!email)
      return NextResponse.json({ error: "Email required" }, { status: 400 });

    await connect();

    // Find enterprise by user's email domain
    const userDomain = session.user.email.split("@")[1]?.toLowerCase();
    const enterprise = await EnterpriseModel.findOne({
      domain: userDomain,
      verified: true,
    });
    if (!enterprise) {
      return NextResponse.json(
        { error: "Enterprise not found or not verified" },
        { status: 404 }
      );
    }

    // Check if user has admin role (simplified - you can add role-based access later)
    if (!enterprise.approved) {
      return NextResponse.json(
        { error: "Enterprise not approved for team management" },
        { status: 403 }
      );
    }

    // Check seat limits
    if (enterprise.usedSeats >= enterprise.seatsLimit) {
      return NextResponse.json(
        { error: "Seat limit reached" },
        { status: 400 }
      );
    }

    // Check if email is from same domain
    const inviteDomain = email.split("@")[1]?.toLowerCase();
    if (inviteDomain !== enterprise.domain) {
      return NextResponse.json(
        { error: "Can only invite users from your company domain" },
        { status: 400 }
      );
    }

    // Create invite
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const invite = await EnterpriseInviteModel.create({
      enterpriseId: enterprise._id,
      email,
      role,
      invitedBy: session.user.id,
      expiresAt,
    });

    // TODO: Send email invite
    // await sendEnterpriseInviteEmail(email, enterprise.companyName, role, invite._id);

    return NextResponse.json({ success: true, invite });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const userDomain = session.user.email.split("@")[1]?.toLowerCase();
    const enterprise = await EnterpriseModel.findOne({ domain: userDomain });
    if (!enterprise) return NextResponse.json({ invites: [] });

    const invites = await EnterpriseInviteModel.find({
      enterpriseId: enterprise._id,
    })
      .populate("invitedBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ invites });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}
