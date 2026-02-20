import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { MessageModel } from "@/models/Messages";
import { ConversationModel } from "@/models/Conversation";
import getCurrentUser from "@/actions/getCurrentUser";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    await connect();
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { conversationId } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Verify user has access to this conversation
    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      userIds: currentUser._id.toString(),
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Get messages with pagination
    const skip = (page - 1) * limit;
    const messages = await MessageModel.find({
      conversationId,
    })
      .populate("sender", "firstName lastName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const totalMessages = await MessageModel.countDocuments({
      conversationId,
    });

    return NextResponse.json({
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        page,
        limit,
        total: totalMessages,
        pages: Math.ceil(totalMessages / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

