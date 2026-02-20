import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import {
  certificationEngine,
  AssessmentType,
} from "@/lib/certification-engine";
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

    const { assessmentId, assessmentType, responses } = await request.json();

    if (!assessmentId || !assessmentType || !responses) {
      return NextResponse.json(
        { error: "Assessment ID, type, and responses are required" },
        { status: 400 }
      );
    }

    // Validate assessment type
    if (!Object.values(AssessmentType).includes(assessmentType)) {
      return NextResponse.json(
        { error: "Invalid assessment type" },
        { status: 400 }
      );
    }

    // Validate responses
    if (!Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json(
        { error: "Responses must be a non-empty array" },
        { status: 400 }
      );
    }

    // Evaluate responses
    const score = await certificationEngine.evaluateResponse(
      assessmentId,
      assessmentType,
      responses
    );

    return NextResponse.json({
      success: true,
      score,
      assessmentType,
      message: "Assessment evaluated successfully",
    });
  } catch (error) {
    console.error("Error evaluating assessment:", error);
    return NextResponse.json(
      { error: "Failed to evaluate assessment" },
      { status: 500 }
    );
  }
}
