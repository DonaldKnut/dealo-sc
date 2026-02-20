// app/api/jobs/latest/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { JobModel, Job } from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";

// Mark route as dynamic
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession({ req, ...authOptions });
    const url = new URL(req.url);
    
    // Get query parameters
    const searchQuery = url.searchParams.get("q") || "";
    const location = url.searchParams.get("location") || "";
    const experience = url.searchParams.get("experience") || "";
    const category = url.searchParams.get("category") || "";
    const type = url.searchParams.get("type") || "";
    const remote = url.searchParams.get("remote") || "";
    const minSalary = url.searchParams.get("minSalary");
    const maxSalary = url.searchParams.get("maxSalary");
    const featured = url.searchParams.get("featured");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "12");
    const sortBy = url.searchParams.get("sortBy") || "updatedAt";

    // Build query - Only show active, verified jobs
    const query: any = {
      status: "Active", // Only show active jobs
      $or: [
        { isEmailVerified: { $exists: false } }, // Jobs from authenticated users (no email verification needed)
        { isEmailVerified: true }, // Verified jobs from unauthenticated users
      ],
    };

    // Search query - search in title, description, and skills
    if (searchQuery) {
      const searchConditions = {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
          { skillsRequired: { $in: [new RegExp(searchQuery, "i")] } },
        ],
      };
      
      // Combine with existing query using $and
      query.$and = [
        { status: "Active" },
        {
          $or: [
            { isEmailVerified: { $exists: false } },
            { isEmailVerified: true },
          ],
        },
        searchConditions,
      ];
      delete query.$or;
      delete query.status;
    }

    // Location filter
    if (location) {
      if (location.toLowerCase() === "remote") {
        query.remote = true;
      } else {
        const locationQuery = {
          $or: [
            { location: { $regex: location, $options: "i" } },
            { city: { $regex: location, $options: "i" } },
            { country: { $regex: location, $options: "i" } },
          ],
        };
        
        if (query.$and) {
          query.$and.push(locationQuery);
        } else {
          query.$and = [
            { status: "Active" },
            {
              $or: [
                { isEmailVerified: { $exists: false } },
                { isEmailVerified: true },
              ],
            },
            locationQuery,
          ];
          delete query.$or;
          delete query.status;
        }
      }
    }

    // Experience filter
    if (experience) {
      const experienceMap: Record<string, any> = {
        "Entry Level": { $lte: 1 },
        "Mid Level": { $gte: 2, $lte: 5 },
        "Senior Level": { $gte: 5, $lte: 10 },
        "Expert Level": { $gte: 10 },
      };
      
      if (experienceMap[experience]) {
        query.experienceRequired = experienceMap[experience];
      } else if (typeof experience === "string" && experience.includes("Level")) {
        query.experienceRequired = { $regex: experience, $options: "i" };
      }
    }

    // Category filter
    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    // Type filter
    if (type) {
      query.type = type;
    }

    // Remote filter
    if (remote === "true") {
      query.remote = true;
    } else if (remote === "false") {
      query.remote = false;
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      query.budget = {};
      if (minSalary) {
        query.budget.$gte = parseFloat(minSalary);
      }
      if (maxSalary) {
        query.budget.$lte = parseFloat(maxSalary);
      }
    }

    // Featured filter
    if (featured === "true") {
      query.isFeatured = true;
    }

    // Build sort object
    const sort: any = {};
    switch (sortBy) {
      case "salaryHigh":
        sort.budget = -1;
        break;
      case "salaryLow":
        sort.budget = 1;
        break;
      case "newest":
        sort.createdAt = -1;
        break;
      case "oldest":
        sort.createdAt = 1;
        break;
      case "updatedAt":
      default:
        sort.updatedAt = -1;
        break;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [jobs, total] = await Promise.all([
      JobModel.find(query)
        .populate("postedBy", "firstName lastName email avatar")
        .populate("company", "name logo")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      JobModel.countDocuments(query),
    ]);

    // Transform the response for the frontend
    const transformedJobs = jobs.map((job: any) => ({
      ...job,
      _id: job._id.toString(),
      postedBy: job.postedBy
        ? {
            _id: job.postedBy._id?.toString(),
            name: `${job.postedBy.firstName || ""} ${job.postedBy.lastName || ""}`.trim(),
            email: job.postedBy.email,
            avatar: job.postedBy.avatar,
          }
        : undefined,
      company: job.company
        ? {
            _id: job.company._id?.toString(),
            name: job.company.name,
            logo: job.company.logo,
          }
        : undefined,
      applications: job.applications?.map((app: any) => app.toString()) || [],
      deadline: job.deadline?.toISOString(),
      createdAt: job.createdAt?.toISOString(),
      updatedAt: job.updatedAt?.toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        jobs: transformedJobs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
