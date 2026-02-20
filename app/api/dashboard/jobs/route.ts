import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { JobModel } from "@/models/Job";
import { JobApplicationModel } from "@/models/JobApplication";
import { UserModel } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await connect();

    // Find user
    let userDoc = null as any;
    const sessionAny = session.user as any;
    if (sessionAny?._id) {
      userDoc = await UserModel.findById(sessionAny._id).select("_id email");
    }
    if (!userDoc && session.user.email) {
      userDoc = await UserModel.findOne({ email: session.user.email }).select("_id email");
    }
    if (!userDoc) {
      return NextResponse.json({ jobs: [] });
    }

    // Get all available jobs (not user-specific, as these are job listings to apply to)
    const jobs = await JobModel.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("company", "name")
      .lean();

    // Get user's applications to mark applied jobs
    const userApplications = await JobApplicationModel.find({ userId: userDoc._id })
      .select("jobId")
      .lean();
    const appliedJobIds = new Set(userApplications.map((app: any) => app.jobId?.toString()));

    const data = jobs.map((j: any) => ({
      id: j._id?.toString() || "",
      title: j.title || "",
      company: j.company?.name || (typeof j.company === 'string' ? j.company : "") || "",
      location: j.city
        ? `${j.city}${j.country ? ", " + j.country : ""}`
        : j.country || "Remote",
      type: j.type || (j.remote ? "freelance" : "full-time"),
      salary: j.budget ? `$${j.budget}` : "",
      posted: j.createdAt ? new Date(j.createdAt).toDateString() : "",
      description: j.description || "",
      requirements: j.requirements || [],
      benefits: j.benefits || [],
      featured: !!j.isFeatured,
      urgent: !!j.urgent,
      applied: appliedJobIds.has(j._id?.toString() || ""),
    }));

    return NextResponse.json({ jobs: data });
  } catch (e: any) {
    console.error("/api/dashboard/jobs error:", e);
    return NextResponse.json(
      { error: e?.message || "Internal Server Error", jobs: [] },
      { status: 500 }
    );
  }
}
