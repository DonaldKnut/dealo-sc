import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { PostModel, CommentModel } from "@/models/Post";

export const dynamic = "force-dynamic";

// POST: Like / unlike a post
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

    const { action } = await req.json();
    const userId = session.user.id;
    const { postId } = params;

    if (action === "like") {
      const post = await PostModel.findById(postId);
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      const alreadyLiked = post.likes.includes(userId);

      if (alreadyLiked) {
        post.likes = post.likes.filter(
          (id: any) => id.toString() !== userId
        );
        post.likesCount = Math.max(0, post.likesCount - 1);
      } else {
        post.likes.push(userId);
        post.likesCount = post.likes.length;
      }

      await post.save();

      return NextResponse.json({
        liked: !alreadyLiked,
        likesCount: post.likesCount,
      });
    }

    if (action === "comment") {
      const { content } = await req.json().catch(() => ({ content: "" }));
      // handled by separate comment endpoint
      return NextResponse.json({ error: "Use /comments endpoint" }, { status: 400 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Error with post action:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process action" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a post (author only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const post = await PostModel.findById(params.postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.author.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await CommentModel.deleteMany({ post: params.postId });
    await PostModel.findByIdAndDelete(params.postId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete post" },
      { status: 500 }
    );
  }
}
