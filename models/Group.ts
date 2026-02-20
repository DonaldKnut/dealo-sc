import { Schema, model, Document, Types, models } from "mongoose";

// Define the Group interface extending Document
interface Group extends Document {
  createdAt: Date;
  name: string;
  createdBy: Types.ObjectId;
  members: Types.ObjectId[];
  messages: Types.ObjectId[]; // Updated to store references to Message objects
}

const GroupSchema = new Schema<Group>({
  createdAt: { type: Date, default: Date.now },
  name: { type: String, required: true, unique: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }], // Relationship with Message schema
});

export const GroupModel = models.Group || model<Group>("Group", GroupSchema);
