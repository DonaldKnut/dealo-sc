import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { CommentModel } from "@/models/Comment";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId } = params;

    await connect();

    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const userId = session.user.id;
    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      // Unlike
      await CommentModel.findByIdAndUpdate(commentId, {
        $pull: { likes: userId },
      });
    } else {
      // Like
      await CommentModel.findByIdAndUpdate(commentId, {
        $addToSet: { likes: userId },
      });
    }

    // Get updated likes count
    const updatedComment = await CommentModel.findById(commentId).select(
      "likes"
    );

    return NextResponse.json({
      success: true,
      isLiked: !isLiked,
      likesCount: updatedComment?.likes.length || 0,
      likes: updatedComment?.likes || [],
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}
