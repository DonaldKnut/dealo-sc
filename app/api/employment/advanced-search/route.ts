import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { JobModel } from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";

export const dynamic = "force-dynamic";

/**
 * Advanced Search API - Supports complex queries with multiple filters
 * Supports: text search, location, salary range, experience, job type, remote, skills, date range
 */
export async function GET(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession({ req, ...authOptions });
    const url = new URL(req.url);
    
    // Get all query parameters
    const searchQuery = url.searchParams.get("q") || "";
    const location = url.searchParams.get("location") || "";
    const city = url.searchParams.get("city") || "";
    const country = url.searchParams.get("country") || "";
    const experience = url.searchParams.get("experience") || "";
    const category = url.searchParams.get("category") || "";
    const type = url.searchParams.get("type") || "";
    const remote = url.searchParams.get("remote") || "";
    const minSalary = url.searchParams.get("minSalary");
    const maxSalary = url.searchParams.get("maxSalary");
    const featured = url.searchParams.get("featured");
    const urgent = url.searchParams.get("urgent");
    const skills = url.searchParams.get("skills"); // Comma-separated skills
    const postedAfter = url.searchParams.get("postedAfter"); // ISO date string
    const postedBefore = url.searchParams.get("postedBefore"); // ISO date string
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "12");
    const sortBy = url.searchParams.get("sortBy") || "updatedAt";
    const order = url.searchParams.get("order") || "desc"; // asc or desc

    // Build query
    const query: any = {};

    // Text search - search in title, description, and skills
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { companyName: { $regex: searchQuery, $options: "i" } },
        { skillsRequired: { $in: [new RegExp(searchQuery, "i")] } },
      ];
    }

    // Location filters
    if (location) {
      if (location.toLowerCase() === "remote") {
        query.remote = true;
      } else {
        query.$or = [
          ...(query.$or || []),
          { location: { $regex: location, $options: "i" } },
          { city: { $regex: location, $options: "i" } },
          { country: { $regex: location, $options: "i" } },
        ];
      }
    }

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    if (country) {
      query.country = { $regex: country, $options: "i" };
    }

    // Experience filter
    if (experience) {
      const experienceMap: Record<string, any> = {
        "Entry Level": { $lte: 1 },
        "entry": { $lte: 1 },
        "Mid Level": { $gte: 2, $lte: 5 },
        "mid": { $gte: 2, $lte: 5 },
        "Senior Level": { $gte: 5, $lte: 10 },
        "senior": { $gte: 5, $lte: 10 },
        "Expert Level": { $gte: 10 },
        "expert": { $gte: 10 },
      };
      
      if (experienceMap[experience]) {
        query.experienceRequired = experienceMap[experience];
      } else if (typeof experience === "string" && experience.includes("Level")) {
        query.experienceRequired = { $regex: experience, $options: "i" };
      } else if (!isNaN(parseInt(experience))) {
        // If it's a number, treat as years
        const years = parseInt(experience);
        query.experienceRequired = { $lte: years };
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

    // Urgent filter
    if (urgent === "true") {
      query.urgent = true;
    }

    // Skills filter
    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim()).filter(Boolean);
      if (skillsArray.length > 0) {
        query.skillsRequired = {
          $in: skillsArray.map((skill) => new RegExp(skill, "i")),
        };
      }
    }

    // Date range filters
    if (postedAfter) {
      query.createdAt = { ...(query.createdAt || {}), $gte: new Date(postedAfter) };
    }
    if (postedBefore) {
      query.createdAt = { ...(query.createdAt || {}), $lte: new Date(postedBefore) };
    }

    // Build sort object
    const sort: any = {};
    const sortOrder = order === "asc" ? 1 : -1;
    
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
      case "title":
        sort.title = sortOrder;
        break;
      case "updatedAt":
      default:
        sort.updatedAt = sortOrder;
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

    // Get aggregation stats for the search results
    const stats = {
      totalResults: total,
      averageSalary: jobs.length > 0
        ? Math.round(
            jobs.reduce((sum: number, job: any) => sum + (job.budget || 0), 0) /
              jobs.length
          )
        : 0,
      remoteJobs: jobs.filter((job: any) => job.remote).length,
      featuredJobs: jobs.filter((job: any) => job.isFeatured).length,
    };

    return NextResponse.json(
      {
        success: true,
        jobs: transformedJobs,
        stats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
        filters: {
          searchQuery,
          location,
          city,
          country,
          experience,
          category,
          type,
          remote,
          minSalary,
          maxSalary,
          featured,
          urgent,
          skills,
          postedAfter,
          postedBefore,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in advanced search:", error);
    return NextResponse.json(
      { success: false, message: "Failed to perform search" },
      { status: 500 }
    );
  }
}


