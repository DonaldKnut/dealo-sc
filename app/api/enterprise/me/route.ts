import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { EnterpriseModel } from "@/models/Enterprise";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({});
    await connect();
    const domain = session.user.email.split("@")[1]?.toLowerCase();
    const ent = await EnterpriseModel.findOne({ domain });
    if (!ent) return NextResponse.json({});
    const usedGB =
      (ent.storageLimitBytes
        ? ent.usedStorageBytes / (1024 * 1024 * 1024)
        : 0) || 0;
    const totalGB = (ent.storageLimitBytes || 0) / (1024 * 1024 * 1024);
    return NextResponse.json({
      companyName: ent.companyName,
      trustLevel: ent.trustLevel,
      approved: ent.approved,
      seatsLimit: ent.seatsLimit,
      usedSeats: ent.usedSeats,
      storageLimitBytes: ent.storageLimitBytes,
      usedStorageBytes: ent.usedStorageBytes,
      storageProgress: totalGB ? Math.round((usedGB / totalGB) * 100) : 0,
    });
  } catch (e: any) {
    return NextResponse.json({});
  }
}
