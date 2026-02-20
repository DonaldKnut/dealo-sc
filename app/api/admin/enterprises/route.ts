import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { EnterpriseModel } from "@/models/Enterprise";

export const dynamic = "force-dynamic";

// Simple admin check - you can enhance this with proper role-based access
function isAdmin(session: any) {
  // For now, check if user email is in admin list or has admin role
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  return (
    adminEmails.includes(session?.user?.email) ||
    session?.user?.role === "admin"
  );
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !isAdmin(session)) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    await connect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // "pending", "approved", "rejected"

    const query: any = {};
    if (status === "pending") query.approved = { $exists: false };
    else if (status === "approved") query.approved = true;
    else if (status === "rejected") query.approved = false;

    const enterprises = await EnterpriseModel.find(query)
      .sort({ createdAt: -1 })
      .select(
        "companyName primaryEmail domain trustLevel approved verified createdAt"
      );

    return NextResponse.json({ enterprises });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !isAdmin(session)) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { enterpriseId, approved, seatsLimit, storageLimitBytes } =
      await req.json();
    if (!enterpriseId)
      return NextResponse.json(
        { error: "Enterprise ID required" },
        { status: 400 }
      );

    await connect();

    const updateData: any = { approved };
    if (seatsLimit) updateData.seatsLimit = seatsLimit;
    if (storageLimitBytes) updateData.storageLimitBytes = storageLimitBytes;

    const enterprise = await EnterpriseModel.findByIdAndUpdate(
      enterpriseId,
      updateData,
      { new: true }
    );
    if (!enterprise)
      return NextResponse.json(
        { error: "Enterprise not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, enterprise });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}
