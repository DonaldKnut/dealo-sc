import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { JobModel } from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";

export async function POST(request: NextRequest) {
  try {
    // Retrieve user session
    await connect();
    const session = await getServerSession({ req: request, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse the job data from the request body
    const jobInput = await request.json();

    const jobData = {
      title: jobInput.title || "Untitled Job",
      description: jobInput.description || "No description provided",
      jobIcon: jobInput.jobIcon || "",
      skillsRequired: jobInput.skillsRequired || [],
      budget: jobInput.budget || 0,
      deadline: new Date(jobInput.deadline) || null,
      country: jobInput.country?.value || "Unknown Country",
      remote: jobInput.remote === "true",
      category: jobInput.category || "Jobs",
      isRemote: jobInput.isRemote || false,
      experienceRequired: jobInput.experienceRequired || "Not specified",
      location: jobInput.location || "Unknown location",
      status: jobInput.status || "Pending",
      postedBy: session.user.id,
    };

    // Create and save the new job
    const newJob = new JobModel(jobData);
    const savedJob = await newJob.save();

    return NextResponse.json({ success: true, job: savedJob }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create job" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connect();

    // Retrieve all jobs from the database
    const jobs = await JobModel.find({});

    return NextResponse.json({ success: true, jobs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connect();
    
    const session = await getServerSession({ req, ...authOptions });
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in to delete jobs." },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Job ID is required" },
        { status: 400 }
      );
    }

    // Find the job
    const job = await JobModel.findById(id);
    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    // Check if user is the creator (postedBy) or if job has contactEmail, check if user's email matches
    const userId = session.user.id;
    const userEmail = session.user.email;
    
    const isCreator = 
      (job.postedBy && job.postedBy.toString() === userId) ||
      (job.userId && job.userId.toString() === userId) ||
      (job.contactEmail && userEmail && job.contactEmail.toLowerCase() === userEmail.toLowerCase());

    if (!isCreator) {
      return NextResponse.json(
        { success: false, message: "You don't have permission to delete this job. Only the job creator can delete it." },
        { status: 403 }
      );
    }

    // Delete the job
    await JobModel.deleteOne({ _id: id });
    
    return NextResponse.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete job" },
      { status: 500 }
    );
  }
}
