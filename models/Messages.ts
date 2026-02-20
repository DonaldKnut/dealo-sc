import { Schema, model, models, Document, Types } from "mongoose";

// Define the Message interface
export interface Message {
  body: string; // Message content
  image?: string; // Optional image URL
  seenIds: string[]; // Array of user IDs who have seen the message
  seenUsers: Types.ObjectId[]; // References to User model for seen users (using ObjectId)
  conversationId: string; // Conversation ID (string)
  conversation: Types.ObjectId; // Reference to the Conversation model (using ObjectId)
  senderId: string; // Sender ID (string)
  sender: Types.ObjectId; // Reference to the User model (using ObjectId)
  createdAt: Date;
  updatedAt: Date;
}

// MessageDocument interface extending both Document and Message
export interface MessageDocument extends Document, Message {
  _id: Types.ObjectId; // Mongoose's default _id field typed as ObjectId
}

// Define the Message schema
const MessageSchema = new Schema<MessageDocument>(
  {
    body: { type: String, required: true }, // Message content
    image: { type: String }, // Optional image URL
    seenIds: [{ type: String }], // Array of user IDs who have seen the message
    seenUsers: [{ type: Schema.Types.ObjectId, ref: "User" }], // References to the User model
    conversationId: { type: String, required: true }, // Conversation ID
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation" }, // Reference to the Conversation model
    senderId: { type: String, required: true }, // Sender ID
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
  },
  { timestamps: true } // Enable timestamps (createdAt, updatedAt)
);

// Add virtual for `id` to map to the `_id` field
MessageSchema.virtual("id").get(function () {
  return this._id.toHexString(); // Return _id as a string for the `id` virtual field
});

MessageSchema.set("toJSON", { virtuals: true });

export const MessageModel =
  models.Message || model<MessageDocument>("Message", MessageSchema);
