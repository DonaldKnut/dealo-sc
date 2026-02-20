// Force dynamic rendering to avoid static build errors with headers/session usage
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { ConversationModel } from "@/models/Conversation";
import getCurrentUser from "@/actions/getCurrentUser";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Get all conversations where the user is a participant
    const conversations = await ConversationModel.find({
      userIds: currentUser._id.toString(),
    })
      .populate("users", "firstName lastName avatar email")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "firstName lastName avatar",
        },
      })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ conversations }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching conversations:", error);
    return NextResponse.json(
      {
        error: error?.message || "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, isGroup, members, name } = body;

    // Validate required fields
    if (
      !userId ||
      typeof isGroup !== "boolean" ||
      (isGroup && !name) ||
      !Array.isArray(members) ||
      members.length < (isGroup ? 2 : 1)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid data. userId, isGroup, name (for groups), and members are required.",
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connect();

    // Get authenticated user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Build unique member list
    const memberIds = Array.from(
      new Set([
        ...members.map((m: { value: string }) => m.value),
        currentUser._id.toString(),
      ])
    );

    // Check for existing 1-1 conversation
    if (!isGroup) {
      const existingConversation = await ConversationModel.findOne({
        isGroup: false,
        userIds: { $all: [currentUser._id.toString(), userId] },
      });

      if (existingConversation) {
        return NextResponse.json(
          {
            message: "Existing conversation found.",
            conversation: existingConversation,
          },
          { status: 200 }
        );
      }
    }

    // Create new conversation
    const newConversation = await ConversationModel.create({
      name: isGroup ? name : null,
      isGroup,
      userIds: memberIds,
      users: memberIds.map((id) => ({ _id: id })),
      createdBy: currentUser._id,
    });

    // Populate users field
    await newConversation.populate("users");

    return NextResponse.json(
      {
        message: "Conversation created successfully.",
        conversation: newConversation,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error creating conversation:", error);

    return NextResponse.json(
      {
        error:
          error?.name === "ValidationError"
            ? error.message
            : "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
