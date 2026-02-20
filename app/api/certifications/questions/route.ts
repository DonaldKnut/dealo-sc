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

    const { assessmentId, assessmentType } = await request.json();

    if (!assessmentId || !assessmentType) {
      return NextResponse.json(
        { error: "Assessment ID and type are required" },
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

    // Generate questions
    const questions = await certificationEngine.generateQuestions(
      assessmentId,
      assessmentType
    );

    return NextResponse.json({
      success: true,
      questions,
      assessmentType,
      message: "Questions generated successfully",
    });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
