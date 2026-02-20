import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { certificationEngine } from "@/lib/certification-engine";
import { connect } from "@/database";

export async function POST(request: NextRequest) {
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

    const { assessmentId } = await request.json();

    if (!assessmentId) {
      return NextResponse.json(
        { error: "Assessment ID is required" },
        { status: 400 }
      );
    }

    // Calculate final score
    const finalScore = await certificationEngine.calculateFinalScore(
      assessmentId
    );

    // Generate certification
    const certification = await certificationEngine.generateCertification(
      assessmentId
    );

    return NextResponse.json({
      success: true,
      certification: {
        id: certification._id,
        score: certification.score,
        level: certification.level,
        certificateUrl: certification.certificateUrl,
        badgeUrl: certification.badgeUrl,
        issuedAt: certification.issuedAt,
        validUntil: certification.validUntil,
      },
      message: "Certification completed successfully",
    });
  } catch (error) {
    console.error("Error completing certification:", error);
    return NextResponse.json(
      { error: "Failed to complete certification" },
      { status: 500 }
    );
  }
}
