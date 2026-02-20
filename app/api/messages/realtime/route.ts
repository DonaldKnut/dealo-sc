import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { MessageModel } from "@/models/Messages";
import { ConversationModel } from "@/models/Conversation";

export const dynamic = "force-dynamic";

// WebSocket-like real-time messaging using Server-Sent Events
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID required" },
        { status: 400 }
      );
    }

    await connect();

    // Verify user has access to this conversation
    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      userIds: session.user.id,
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Set up Server-Sent Events for real-time messaging
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection confirmation
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({
              type: "connected",
              userId: session.user.id,
            })}\n\n`
          )
        );

        // Track last message timestamp for efficient polling
        let lastCheckTime = new Date();

        // Set up interval to check for new messages
        const interval = setInterval(async () => {
          try {
            const newMessages = await MessageModel.find({
              conversationId,
              senderId: { $ne: session.user.id },
              createdAt: { $gt: lastCheckTime },
            })
              .populate("sender", "firstName lastName avatar")
              .sort({ createdAt: 1 }) // Sort ascending to maintain order
              .limit(50)
              .lean();

            if (newMessages.length > 0) {
              // Update last check time
              const latestMessageTime = new Date(newMessages[newMessages.length - 1].createdAt);
              lastCheckTime = latestMessageTime;

              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({
                    type: "new_messages",
                    messages: newMessages,
                  })}\n\n`
                )
              );
            }
          } catch (error) {
            console.error("Error fetching new messages:", error);
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

// Send message endpoint
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId, content, messageType = "text" } = await req.json();

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: "Conversation ID and content required" },
        { status: 400 }
      );
    }

    await connect();

    // Verify user has access to this conversation
    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      userIds: session.user.id,
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Validate message content
    if (typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Message content cannot be empty" },
        { status: 400 }
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: "Message is too long (max 5000 characters)" },
        { status: 400 }
      );
    }

    // Create new message
    const message = await MessageModel.create({
      conversationId,
      senderId: session.user.id,
      body: content.trim(),
    });

    // Update conversation last message and timestamp
    await ConversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: new Date(),
    });

    // Populate sender info
    const populatedMessage = await MessageModel.findById(message._id)
      .populate("sender", "firstName lastName avatar")
      .lean();

    return NextResponse.json({
      success: true,
      message: populatedMessage,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}
