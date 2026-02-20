import { Schema, model, Document, Types, models } from "mongoose";

// Define the Message interface extending Document
interface Message extends Document {
  sender: Types.ObjectId;
  text: string;
  timestamp: Date;
}

const MessageSchema = new Schema<Message>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const MessageModel =
  models.Message || model<Message>("Message", MessageSchema);
