import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import Work from "@/models/Work";

// Revalidate every 5 minutes for trending works
export const revalidate = 300;

export async function GET(req: NextRequest) {
  try {
    await connect();

    // Get trending works (mock data for demo)
    const trendingWorks = await Work.find({})
      .populate("creator", "firstName lastName avatar")
      .limit(10)
      .lean();

    // Add mock trending data
    const mockTrendingWorks = trendingWorks.map((work) => ({
      ...work,
      viewsCount: Math.floor(Math.random() * 5000) + 100,
      thumbnail: work.workMedia?.[0]?.url || "/placeholder-image.jpg",
    }));

    const response = NextResponse.json({ works: mockTrendingWorks });
    
    // Add cache headers
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );
    
    return response;
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}
