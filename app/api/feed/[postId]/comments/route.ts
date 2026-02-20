import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { PostModel, CommentModel } from "@/models/Post";

export const dynamic = "force-dynamic";

// GET: Fetch comments for a post
export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const comments = await CommentModel.find({ post: params.postId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("author", "firstName lastName avatar role")
      .lean();

    return NextResponse.json({ comments });
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST: Add a comment to a post
export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    const post = await PostModel.findById(params.postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment = await CommentModel.create({
      post: params.postId,
      author: session.user.id,
      content: content.trim(),
    });

    post.commentsCount = (post.commentsCount || 0) + 1;
    await post.save();

    const populated = await CommentModel.findById(comment._id)
      .populate("author", "firstName lastName avatar role")
      .lean();

    return NextResponse.json({ comment: populated }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create comment" },
      { status: 500 }
    );
  }
}
