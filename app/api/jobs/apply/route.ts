import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { JobModel } from "@/models/Job";
import { JobApplicationModel } from "@/models/JobApplication";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

// Apply to a job
export async function POST(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession({ req, ...authOptions });
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in to apply." },
        { status: 401 }
      );
    }

    const { jobId, coverLetter, resume } = await req.json();

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: "Job ID is required" },
        { status: 400 }
      );
    }

    // Find the job
    const job = await JobModel.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    // Check if user already applied
    const existingApplication = await JobApplicationModel.findOne({
      jobId: jobId,
      userId: session.user.id,
    });

    if (existingApplication) {
      return NextResponse.json(
        { success: false, message: "You have already applied to this job" },
        { status: 400 }
      );
    }

    // Create job application
    const application = await JobApplicationModel.create({
      jobId: jobId,
      userId: session.user.id,
      coverLetter: coverLetter || "",
      resume: resume || "",
      status: "pending",
    });

    // Add application to job
    const userId = new mongoose.Types.ObjectId(session.user.id);
    job.applications = job.applications || [];
    job.applications.push(userId);
    await job.save();

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        application: {
          _id: application._id.toString(),
          status: application.status,
        },
        applicationCount: job.applications.length,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error applying to job:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to apply to job" },
      { status: 500 }
    );
  }
}

// Check if user has applied
export async function GET(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession({ req, ...authOptions });
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, applied: false },
        { status: 200 }
      );
    }

    const url = new URL(req.url);
    const jobId = url.searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: "Job ID is required" },
        { status: 400 }
      );
    }

    const application = await JobApplicationModel.findOne({
      jobId: jobId,
      userId: session.user.id,
    });

    const hasApplied = !!application;
    
    const job = await JobModel.findById(jobId);
    const applicationCount = job?.applications?.length || 0;

    return NextResponse.json(
      { success: true, applied: hasApplied, applicationCount },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error checking application:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to check application" },
      { status: 500 }
    );
  }
}

