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

    const { professionId } = await request.json();

    if (!professionId) {
      return NextResponse.json(
        { error: "Profession ID is required" },
        { status: 400 }
      );
    }

    // Start assessment
    const assessmentId = await certificationEngine.startAssessment(
      session.user._id,
      professionId
    );

    return NextResponse.json({
      success: true,
      assessmentId,
      message: "Assessment started successfully",
    });
  } catch (error) {
    console.error("Error starting assessment:", error);
    return NextResponse.json(
      { error: "Failed to start assessment" },
      { status: 500 }
    );
  }
}
