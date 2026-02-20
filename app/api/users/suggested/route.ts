import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { rateLimiters } from "@/lib/middleware/rate-limit";
import { connect } from "@/database";
import { UserModel } from "@/models/User";
import { parsePaginationParams, createPaginatedResponse } from "@/lib/db/pagination";
import { caches } from "@/lib/db/cache";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(req);
    
    // Apply rate limiting
    const rateLimitResult = await rateLimiters.standard(req, user.id);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    await connect();

    // Parse pagination params
    const paginationParams = parsePaginationParams(new URL(req.url).searchParams);

    // Get suggested users with caching and pagination
    const { data: suggestedUsers, total } = await caches.users(
      { userId: user.id, page: paginationParams.page, limit: paginationParams.limit, type: "suggested" },
      async () => {
        const skip = (paginationParams.page - 1) * paginationParams.limit;
        const query = UserModel.find({
          _id: { $ne: user.id },
          // Add logic to exclude already followed users if you have a follow system
        }).select("firstName lastName avatar location");
        
        const [data, total] = await Promise.all([
          query.clone().sort({ createdAt: -1 }).skip(skip).limit(paginationParams.limit).lean().exec(),
          query.countDocuments().exec(),
        ]);
        
        return { data, total };
      }
    );

    // Add mock data for demo purposes
    const mockUsers = suggestedUsers.map((user: any) => ({
      ...user,
      followersCount: Math.floor(Math.random() * 1000) + 50,
      category: [
        "Web Development",
        "Design",
        "Writing",
        "Marketing",
        "Video Editing",
      ][Math.floor(Math.random() * 5)],
      rating: 4.5 + Math.random() * 0.5,
      isFollowing: false,
    }));

    const response = NextResponse.json(createPaginatedResponse(mockUsers, total, paginationParams));
    
    // Add rate limit headers
    response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString());
    response.headers.set("X-RateLimit-Reset", Math.ceil(rateLimitResult.resetTime / 1000).toString());
    
    return response;
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}
