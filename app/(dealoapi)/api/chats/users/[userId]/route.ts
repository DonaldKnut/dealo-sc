import { connect } from "@/database";
import { ChatModel } from "@/models/Chat";
import { Message, IMessage } from "@/models/Message";
import { UserModel } from "@/models/User";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { userId: string } }
): Promise<Response> => {
  try {
    await connect();

    const { userId } = params;

    const allChats = await ChatModel.find({ members: userId })
      .sort({ lastMessageAt: -1 })
      .populate({
        path: "members",
        model: UserModel,
      })
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: UserModel,
        },
      })
      .exec();

    return NextResponse.json(allChats, { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to get all chats of current user", {
      status: 500,
    });
  }
};
