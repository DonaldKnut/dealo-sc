import { NextRequest, NextResponse } from "next/server";
import Work from "@/models/Work";
import { connect } from "@/database";
import { UserRoleModel } from "@/models/UserRole";

export const dynamic = "force-dynamic";

// Route handler to fetch all works
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const experienceLevel = searchParams.get("experienceLevel");
    const sortBy = searchParams.get("sortBy") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Connect to the database
    await connect();

    // Build query
    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skills: { $in: [new RegExp(search, "i")] } },
      ];
    }
    if (category && category !== "All") {
      query.category = category;
    }
    if (experienceLevel && experienceLevel !== "All") {
      query.experienceLevel = experienceLevel;
    }

    // Build sort
    let sort: any = { createdAt: -1 };
    switch (sortBy) {
      case "price_low":
        sort = { price: 1 };
        break;
      case "price_high":
        sort = { price: -1 };
        break;
      case "oldest":
        sort = { createdAt: 1 };
        break;
      case "newest":
      default:
        sort = { createdAt: -1 };
        break;
    }

    // Fetch all works from the database
    const works = await Work.find(query)
      .populate("creator", "firstName lastName avatar") // Populate creator fields
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(); // Convert Mongoose documents to plain JavaScript objects

    // Enhance works with role information
    const enhancedWorks = await Promise.all(
      works.map(async (work: any) => {
        const userRole = await UserRoleModel.findOne({
          userId: work.creator._id,
        }).lean();

        // Handle case where userRole might be an array or single object
        const roleData = Array.isArray(userRole) ? userRole[0] : userRole;

        return {
          ...work,
          creator: {
            ...work.creator,
            role: roleData?.role || "freelancer",
            title: roleData?.title || "Freelancer",
            isVerified: roleData?.isVerified || false,
            verificationBadge: roleData?.verificationBadge,
          },
        };
      })
    );

    // Return the works in the response
    return NextResponse.json({ success: true, data: enhancedWorks });
  } catch (error: any) {
    console.error("Error fetching works:", error);

    // Handle errors and return an error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch works",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
