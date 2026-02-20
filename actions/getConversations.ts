import { ConversationModel } from "@/models/Conversation";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) return [];

    const conversations = await ConversationModel.find({
      userIds: currentUser.id, // Adjust this based on your schema
    })
      .populate("users")
      .populate({
        path: "messages",
        populate: [{ path: "sender" }, { path: "seen" }],
      })
      .sort({ lastMessageAt: -1 }); // Sort in descending order

    return conversations;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

export default getConversations;
