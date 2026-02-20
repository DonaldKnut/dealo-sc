import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../database/index";
import IWork from "@/models/Work";

export const POST = async (req: NextRequest) => {
  try {
    await connect();

    const body = await req.json();
    const { query, type = "all", profession, limit = 20, page = 1 } = body;

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          message: "Search query is required",
        },
        { status: 400 }
      );
    }

    const results: any = {
      courses: [],
      works: [],
      professionals: [],
      total: 0,
      page,
      limit,
      hasMore: false,
    };

    // Search for professionals
    if (type === "all" || type === "professionals") {
      try {
        const professionalsResponse = await fetch(
          `${
            req.nextUrl.origin
          }/api/professionals/search?q=${encodeURIComponent(query)}&category=${
            profession || ""
          }`
        );
        if (professionalsResponse.ok) {
          const professionalsData = await professionalsResponse.json();
          results.professionals = professionalsData.professionals || [];
        }
      } catch (error) {
        console.error("Error fetching professionals:", error);
        results.professionals = [];
      }
    }

    // Search for works (existing functionality)
    if (type === "all" || type === "works") {
      try {
        const works = await IWork.find({
          $or: [
            { category: { $regex: query, $options: "i" } },
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        })
          .populate("creator")
          .limit(limit)
          .skip((page - 1) * limit)
          .exec();

        results.works = works || [];
      } catch (error) {
        console.error("Error fetching works:", error);
        results.works = [];
      }
    }

    // Search for courses (placeholder - you can implement this later)
    if (type === "all" || type === "courses") {
      // TODO: Implement course search when you have a course model
      results.courses = [];
    }

    // Calculate totals
    results.total =
      results.professionals.length +
      results.works.length +
      results.courses.length;
    results.hasMore = results.total >= limit;

    return NextResponse.json({ success: true, data: results }, { status: 200 });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
};
