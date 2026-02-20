import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { JobModel } from "@/models/Job";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const jobId = searchParams.get("jobId");

    if (!token || !jobId) {
      return NextResponse.json(
        { success: false, message: "Token and job ID are required" },
        { status: 400 }
      );
    }

    await connect();

    // Find job by verification token and job ID
    const job = await JobModel.findOne({
      _id: jobId,
      verificationToken: token,
    });

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Check if already verified
    if (job.isEmailVerified) {
      return NextResponse.json(
        {
          success: true,
          message: "Job is already verified",
          job: job,
        },
        { status: 200 }
      );
    }

    // Verify the job
    job.isEmailVerified = true;
    job.status = "Active"; // Change status from "Pending Verification" to "Active"
    job.verificationToken = undefined; // Clear the token
    await job.save();

    return NextResponse.json(
      {
        success: true,
        message: "Job verified successfully! Your listing is now live.",
        job: job,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Job verification error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to verify job",
      },
      { status: 500 }
    );
  }
}




