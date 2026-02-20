import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { JobModel } from "@/models/Job";

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  await connect();
  try {
    const job = await JobModel.findById(params.jobId).lean();

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch job details" },
      { status: 500 }
    );
  }
}
