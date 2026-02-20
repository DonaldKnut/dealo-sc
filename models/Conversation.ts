import { Schema, model, models, Document } from "mongoose";

export interface Conversation {
  messageIds: string[];
  messages: Schema.Types.ObjectId[];
  userIds: string[];
  users: Schema.Types.ObjectId[];
  isGroup: boolean;
  name?: string;
  lastMessage: Schema.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

// Extend Mongoose's Document type
export interface ConversationDocument extends Document, Conversation {}

const ConversationSchema = new Schema<ConversationDocument>(
  {
    messageIds: [{ type: String }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    userIds: [{ type: String }],
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isGroup: { type: Boolean, default: false },
    name: { type: String },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message", default: null },
  },
  { timestamps: true }
);

export const ConversationModel =
  models.Conversation ||
  model<ConversationDocument>("Conversation", ConversationSchema);
