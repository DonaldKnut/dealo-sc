// app/api/dealojobs/[jobId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { JobModel } from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  await connect();
  const session = await getServerSession({ req: req, ...authOptions });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobId } = params;

  try {
    const job = await JobModel.findById(jobId);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
