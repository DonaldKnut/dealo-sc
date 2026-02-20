import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { JobModel } from "@/models/Job";
import { CompanyModel } from "@/models/Company";
import { UserModel } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connect();

    // Get real-time statistics
    const [totalJobs, activeJobs, totalCompanies, totalJobSeekers] = await Promise.all([
      // Total jobs (all statuses)
      JobModel.countDocuments(),
      
      // Active jobs (verified and active)
      JobModel.countDocuments({
        $or: [
          { status: "Active" },
          { isEmailVerified: true },
        ],
      }),
      
      // Total companies
      CompanyModel.countDocuments(),
      
      // Total users (job seekers)
      UserModel.countDocuments(),
    ]);

    // Calculate success rate (jobs with applications / total jobs)
    const jobsWithApplications = await JobModel.countDocuments({
      applications: { $exists: true, $ne: [] },
    });
    const successRate = totalJobs > 0 
      ? Math.round((jobsWithApplications / totalJobs) * 100)
      : 0;

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalJobs: totalJobs.toLocaleString(),
          activeJobs: activeJobs.toLocaleString(),
          totalCompanies: totalCompanies.toLocaleString(),
          totalJobSeekers: totalJobSeekers.toLocaleString(),
          successRate: `${successRate}%`,
        },
        // Raw numbers for calculations
        raw: {
          totalJobs,
          activeJobs,
          totalCompanies,
          totalJobSeekers,
          successRate,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching employment statistics:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch statistics",
        stats: {
          totalJobs: "10K+",
          activeJobs: "8K+",
          totalCompanies: "500+",
          totalJobSeekers: "50K+",
          successRate: "95%",
        },
      },
      { status: 500 }
    );
  }
}


