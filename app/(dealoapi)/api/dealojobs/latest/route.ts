// app/api/jobs/latest/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { JobModel } from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connect();

    // Retrieve the user session
    const session = await getServerSession({ req: request, ...authOptions });
    console.log("User Session:", session);

    // If the user is not authenticated, return an unauthorized response
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Fetch the latest jobs from the database
    const latestJobs = await JobModel.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("postedBy", "name email");

    return NextResponse.json(
      { success: true, jobs: latestJobs },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching latest jobs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch latest jobs" },
      { status: 500 }
    );
  }
}
