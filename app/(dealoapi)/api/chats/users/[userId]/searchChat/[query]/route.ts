import { connect } from "@/database";
import { ChatModel } from "@/models/Chat";
import { Message, IMessage } from "@/models/Message"; // ✅ Correct named import
import { UserModel } from "@/models/User";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { userId: string; query: string } }
): Promise<Response> => {
  try {
    await connect();

    const { userId, query } = params;

    const searchedChat = await ChatModel.find({
      members: userId,
      name: { $regex: query, $options: "i" },
    })
      .populate({
        path: "members",
        model: UserModel,
      })
      .populate({
        path: "messages",
        model: Message, // ✅ use the actual Mongoose model
        populate: {
          path: "sender seenBy",
          model: UserModel,
        },
      })
      .exec();

    return NextResponse.json(searchedChat, { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to search chat", { status: 500 });
  }
};
