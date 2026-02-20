import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { FollowModel } from "@/models/Follow";
import { UserModel } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connect();

    const user = await UserModel.findOne({ email: session.user.email }).select("_id");
    if (!user) return NextResponse.json({ connections: [] });

    // People this user follows
    const following = await FollowModel.find({ followerId: user._id })
      .populate("followingId", "firstName lastName role company avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    // People who follow this user
    const followers = await FollowModel.find({ followingId: user._id })
      .populate("followerId", "firstName lastName role company avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    const followingIds = new Set(following.map((f: any) => f.followingId?._id?.toString()));
    const followerIds = new Set(followers.map((f: any) => f.followerId?._id?.toString()));

    const followingList = following
      .filter((f: any) => f.followingId?._id)
      .map((f: any) => ({
        id: f.followingId._id,
        name: `${f.followingId.firstName || ""} ${f.followingId.lastName || ""}`.trim(),
        role: f.followingId.role || "",
        company: f.followingId.company || "",
        avatar: f.followingId.avatar || null,
        createdAt: f.createdAt,
        type: followerIds.has(f.followingId._id.toString()) ? "mutual" : "following",
      }));

    const followerList = followers
      .filter((f: any) => f.followerId?._id && !followingIds.has(f.followerId._id.toString()))
      .map((f: any) => ({
        id: f.followerId._id,
        name: `${f.followerId.firstName || ""} ${f.followerId.lastName || ""}`.trim(),
        role: f.followerId.role || "",
        company: f.followerId.company || "",
        avatar: f.followerId.avatar || null,
        createdAt: f.createdAt,
        type: "follower",
      }));

    const connections = [...followingList, ...followerList];

    return NextResponse.json({ connections });
  } catch (e: any) {
    console.error("/api/dashboard/network error:", e);
    return NextResponse.json(
      { error: e?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
