import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { SavedJobPostModel } from "@/models/SavedJobPost";
import { JobModel } from "@/models/Job";

export const dynamic = "force-dynamic";

// Save a job
export async function POST(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession({ req, ...authOptions });
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
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

    // Check if already saved
    const existing = await SavedJobPostModel.findOne({
      user: session.user.id,
      job: jobId,
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Job already saved" },
        { status: 400 }
      );
    }

    // Save the job
    const savedJob = await SavedJobPostModel.create({
      user: session.user.id,
      job: jobId,
    });

    return NextResponse.json(
      { success: true, savedJob },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error saving job:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to save job" },
      { status: 500 }
    );
  }
}

// Unsave a job
export async function DELETE(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession({ req, ...authOptions });
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
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

    await SavedJobPostModel.findOneAndDelete({
      user: session.user.id,
      job: jobId,
    });

    return NextResponse.json(
      { success: true, message: "Job unsaved" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error unsaving job:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to unsave job" },
      { status: 500 }
    );
  }
}

// Get saved jobs
export async function GET(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession({ req, ...authOptions });
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const savedJobs = await SavedJobPostModel.find({
      user: session.user.id,
    })
      .populate("job")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        savedJobs: savedJobs.map((sj: any) => ({
          _id: sj._id.toString(),
          job: sj.job,
          createdAt: sj.createdAt?.toISOString(),
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching saved jobs:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch saved jobs" },
      { status: 500 }
    );
  }
}

