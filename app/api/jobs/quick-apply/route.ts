import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { JobModel } from "@/models/Job";
import { JobApplicationModel } from "@/models/JobApplication";
import { UserModel } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

/**
 * Quick Apply - Simplified application process using user's default resume/profile
 * This endpoint allows users to apply quickly without selecting a resume
 */
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

    const { jobId } = await req.json();

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
        { 
          success: false, 
          message: "You have already applied to this job",
          applicationId: existingApplication._id.toString(),
        },
        { status: 400 }
      );
    }

    // Get user's profile for quick apply
    let userDoc = null as any;
    const sessionAny = session.user as any;
    if (sessionAny?._id) {
      userDoc = await UserModel.findById(sessionAny._id);
    }
    if (!userDoc && session.user.email) {
      userDoc = await UserModel.findOne({ email: session.user.email });
    }

    if (!userDoc) {
      return NextResponse.json(
        { success: false, message: "User profile not found" },
        { status: 404 }
      );
    }

    // Create quick application with minimal data
    // Note: resume field is required in schema, so we use empty string for quick apply
    const application = await JobApplicationModel.create({
      jobId: jobId,
      userId: session.user.id,
      coverLetter: `I am interested in the ${job.title} position. I believe my skills and experience make me a great fit for this role.`,
      resume: "", // Empty for quick apply - employer will review user profile instead
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
        message: "Quick application submitted successfully!",
        application: {
          _id: application._id.toString(),
          status: application.status,
          quickApply: true,
        },
        applicationCount: job.applications.length,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in quick apply:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to submit quick application",
      },
      { status: 500 }
    );
  }
}

