import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { CompanyModel } from "@/models/Company";
import { JobModel } from "@/models/Job";
import { Types } from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await connect();

    const { id } = params;

    // Validate the job ID format
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid Job ID format" },
        { status: 400 }
      );
    }

    // Find the job by ID
    const job = await JobModel.findById(id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Use the postedBy field to fetch the associated company
    const company = await CompanyModel.findById(job.postedBy).populate("owner");

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Return the job and company details
    return NextResponse.json({ job, company }, { status: 200 });
  } catch (error) {
    console.error("Error in fetch-job-and-company API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
