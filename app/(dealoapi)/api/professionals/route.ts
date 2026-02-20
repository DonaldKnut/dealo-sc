import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../database/index";
import { ProfessionalModel } from "@/models/Professional";
import { UserModel } from "@/models/User";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const featured = searchParams.get("featured") === "true";

    let query: any = {
      isProfileComplete: true,
      isAvailable: true,
    };

    if (featured) {
      query.isCertified = true;
      query.rating = { $gte: 4.5 };
    }

    const professionals = await ProfessionalModel.find(query)
      .sort({ rating: -1, completedProjects: -1 })
      .limit(limit)
      .exec();

    if (professionals.length === 0) {
      return NextResponse.json(
        {
          professionals: [],
          message: "No professionals found",
        },
        { status: 200 }
      );
    }

    // Transform the data to match the expected format
    const transformedProfessionals = professionals.map((professional) => ({
      id: professional._id,
      name: `${professional.firstName} ${professional.lastName}`,
      profession: professional.servicesOffered[0] || "Professional",
      image:
        professional.avatar ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=256&fit=crop",
      skills: professional.skills.slice(0, 3),
      earnings: professional.hourlyRate,
      rating: professional.rating,
      category:
        professional.servicesOffered[0]?.toLowerCase().replace(/\s+/g, "-") ||
        "general",
      bio: professional.bio,
      completedProjects: professional.completedProjects,
      isCertified: professional.isCertified,
    }));

    return NextResponse.json(
      {
        professionals: transformedProfessionals,
        total: transformedProfessionals.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching professionals:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch professionals",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
