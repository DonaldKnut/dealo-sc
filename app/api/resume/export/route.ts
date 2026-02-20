import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import Resume from "@/models/Resume";
import { generateResumePDF } from "@/lib/resume-pdf-generator";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connect();

    const { resumeId, format = "pdf" } = await request.json();

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 }
      );
    }

    const sessionAny = session.user as any;
    const userId = sessionAny?._id || sessionAny?.id || null;
    const resume = await Resume.findOne({ _id: resumeId, userId });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (format === "json") {
      return NextResponse.json({
        success: true,
        resume,
        message: "Resume exported successfully",
      });
    }

    // Generate PDF
    try {
      const pdf = generateResumePDF(resume);
      const pdfBuffer = pdf.output("arraybuffer");

      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${resume.personalInfo.firstName}_${resume.personalInfo.lastName}_Resume.pdf"`,
        },
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to generate PDF",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Resume export error:", error);
    return NextResponse.json(
      { error: "Failed to export resume" },
      { status: 500 }
    );
  }
}
