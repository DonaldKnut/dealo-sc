import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { UserProfileModel } from "@/models/UserProfile";
import { FollowModel } from "@/models/Follow";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { rateLimiters } from "@/lib/middleware/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    // Public route but should have rate limiting
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;
    
    // Apply rate limiting (stricter for unauthenticated users)
    const rateLimitResult = await rateLimiters.standard(request, currentUserId);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": Math.ceil(rateLimitResult.resetTime / 1000).toString(),
            "Retry-After": Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }
    
    await connect();

    // Don't expose email - it's sensitive data
    const profile = await UserProfileModel.findOne({ handle: params.handle })
      .populate("userId", "firstName lastName avatar role")
      .lean();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Get follow counts
    const [followersCount, followingCount] = await Promise.all([
      FollowModel.countDocuments({ followingId: profile.userId._id }),
      FollowModel.countDocuments({ followerId: profile.userId._id }),
    ]);

    // Check if current user is following this profile
    let isFollowing = false;
    if (currentUserId && currentUserId !== profile.userId._id.toString()) {
      const followExists = await FollowModel.exists({
        followerId: currentUserId,
        followingId: profile.userId._id,
      });
      isFollowing = !!followExists;
    }

    // Remove sensitive data from response
    const { userId, ...profileData } = profile as any;
    const safeProfile = {
      ...profileData,
      user: {
        id: userId?._id?.toString(),
        firstName: userId?.firstName,
        lastName: userId?.lastName,
        avatar: userId?.avatar,
        role: userId?.role,
        // Email intentionally excluded - sensitive data
      },
      followersCount,
      followingCount,
      isFollowing: !!isFollowing,
    };
    
    const response = NextResponse.json({ profile: safeProfile });
    
    // Add rate limit headers
    response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString());
    response.headers.set("X-RateLimit-Reset", Math.ceil(rateLimitResult.resetTime / 1000).toString());
    
    return response;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
