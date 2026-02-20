import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { CommentModel } from "@/models/Comment";

export const dynamic = "force-dynamic";

// Real-time comments using Server-Sent Events
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: postId } = params;

    await connect();

    // Set up Server-Sent Events for real-time comments
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection confirmation
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({
              type: "connected",
              userId: session.user.id,
              postId,
            })}\n\n`
          )
        );

        // Set up interval to check for new comments
        const interval = setInterval(async () => {
          try {
            const newComments = await CommentModel.find({
              postId,
              author: { $ne: session.user.id },
              createdAt: { $gte: new Date(Date.now() - 5000) }, // Last 5 seconds
            })
              .populate("author", "firstName lastName avatar")
              .sort({ createdAt: -1 })
              .limit(10);

            if (newComments.length > 0) {
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({
                    type: "new_comment",
                    comment: newComments[0], // Send the latest comment
                  })}\n\n`
                )
              );
            }
          } catch (error) {
            console.error("Error fetching new comments:", error);
          }
        }, 2000); // Check every 2 seconds

        // Clean up on close
        req.signal.addEventListener("abort", () => {
          clearInterval(interval);
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
      },
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}
