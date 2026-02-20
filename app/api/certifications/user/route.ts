import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { Certification } from "@/models";
import { connect } from "@/database";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connect();

    // Fetch user's certifications
    const certifications = await Certification.find({
      userId: session.user._id,
    })
      .populate("professionId")
      .sort({ issuedAt: -1 });

    return NextResponse.json({
      success: true,
      certifications: certifications.map((cert) => ({
        id: cert._id,
        profession: cert.professionId.name,
        level: cert.level,
        score: cert.score,
        status: cert.status || "completed",
        certificateUrl: cert.certificateUrl,
        badgeUrl: cert.badgeUrl,
        issuedAt: cert.issuedAt,
        validUntil: cert.validUntil,
      })),
    });
  } catch (error) {
    console.error("Error fetching user certifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch certifications" },
      { status: 500 }
    );
  }
}
