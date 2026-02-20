import mongoose, { Schema, Document, models, model } from "mongoose";

interface Avatar extends Document {
  url: string;
  user: mongoose.Schema.Types.ObjectId;
}

const AvatarSchema = new Schema<Avatar>({
  url: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export const AvatarModel =
  models.Avatar || model<Avatar>("Avatar", AvatarSchema);

export type UserDocument = Avatar;
