import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { PostModel } from "@/models/Post";
import { UserModel } from "@/models/User";

export const dynamic = "force-dynamic";

// GET: Fetch feed posts
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const posts = await PostModel.find({ visibility: "public" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "firstName lastName avatar role email")
      .lean();

    const total = await PostModel.countDocuments({ visibility: "public" });

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + limit < total,
      },
    });
  } catch (error: any) {
    console.error("Error fetching feed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch feed" },
      { status: 500 }
    );
  }
}

// POST: Create a new post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const body = await req.json();
    const { content, images, visibility, tags } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Post content is required" },
        { status: 400 }
      );
    }

    if (content.trim().length > 3000) {
      return NextResponse.json(
        { error: "Post content exceeds 3000 characters" },
        { status: 400 }
      );
    }

    const post = await PostModel.create({
      author: session.user.id,
      content: content.trim(),
      images: images || [],
      visibility: visibility || "public",
      tags: tags || [],
    });

    const populated = await PostModel.findById(post._id)
      .populate("author", "firstName lastName avatar role email")
      .lean();

    return NextResponse.json({ post: populated }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create post" },
      { status: 500 }
    );
  }
}
