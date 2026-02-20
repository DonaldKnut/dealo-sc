import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { Message } from "@/models/Message";
import { ChatModel } from "@/models/Chat";
import { uploadToR2 } from "@/lib/r2";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    await connect();

    // Verify user is member of the chat
    const chat = await ChatModel.findOne({
      _id: chatId,
      members: session.user.id,
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Get messages with pagination
    const skip = (page - 1) * limit;
    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: "sender",
          select: "firstName lastName avatar",
        },
        {
          path: "replyTo",
          populate: {
            path: "sender",
            select: "firstName lastName",
          },
        },
        {
          path: "reactions.userId",
          select: "firstName lastName",
        },
      ]);

    // Mark messages as seen
    await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: session.user.id },
        seenBy: { $ne: session.user.id },
      },
      {
        $addToSet: { seenBy: session.user.id },
      }
    );

    // Get total count
    const totalMessages = await Message.countDocuments({ chat: chatId });

    return NextResponse.json({
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        page,
        limit,
        total: totalMessages,
        pages: Math.ceil(totalMessages / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const chatId = formData.get("chatId") as string;
    const text = formData.get("text") as string;
    const replyTo = formData.get("replyTo") as string;
    const files = formData.getAll("files") as File[];

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    await connect();

    // Verify user is member of the chat
    const chat = await ChatModel.findOne({
      _id: chatId,
      members: session.user.id,
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Handle file uploads
    const media = [];
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const fileKey = `messages/${chatId}/${Date.now()}-${file.name}`;
          const uploadResult = await uploadToR2(buffer, {
            fileName: fileKey,
            contentType: file.type,
          });

          media.push({
            type: file.type.startsWith("image/")
              ? "image"
              : file.type.startsWith("video/")
              ? "video"
              : file.type.startsWith("audio/")
              ? "audio"
              : "document",
            url: uploadResult,
            filename: file.name,
            size: file.size,
          });
        } catch (error) {
          console.error("Error uploading file:", error);
          return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
          );
        }
      }
    }

    // Create message
    const message = new Message({
      chat: chatId,
      sender: session.user.id,
      text: text || "",
      media,
      replyTo: replyTo || undefined,
      seenBy: [session.user.id],
    });

    await message.save();

    // Update chat's last message
    await ChatModel.findByIdAndUpdate(chatId, {
      lastMessageAt: new Date(),
      lastMessage: message._id,
    });

    // Populate message for response
    await message.populate([
      {
        path: "sender",
        select: "firstName lastName avatar",
      },
      {
        path: "replyTo",
        populate: {
          path: "sender",
          select: "firstName lastName",
        },
      },
    ]);

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
