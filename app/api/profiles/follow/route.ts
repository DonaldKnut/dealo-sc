import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { FollowModel } from "@/models/Follow";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetUserId, action } = await request.json();
    if (!targetUserId || !action) {
      return NextResponse.json(
        { error: "Missing targetUserId or action" },
        { status: 400 }
      );
    }

    if (action !== "follow" && action !== "unfollow") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (session.user.id === targetUserId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    await connect();

    if (action === "follow") {
      // Create follow relationship
      await FollowModel.create({
        followerId: session.user.id,
        followingId: targetUserId,
      });
    } else {
      // Remove follow relationship
      await FollowModel.deleteOne({
        followerId: session.user.id,
        followingId: targetUserId,
      });
    }

    // Get updated counts
    const [followersCount, followingCount] = await Promise.all([
      FollowModel.countDocuments({ followingId: targetUserId }),
      FollowModel.countDocuments({ followerId: targetUserId }),
    ]);

    return NextResponse.json({
      success: true,
      action,
      followersCount,
      followingCount,
    });
  } catch (error) {
    console.error("Error following/unfollowing:", error);
    return NextResponse.json(
      { error: "Failed to process follow action" },
      { status: 500 }
    );
  }
}
