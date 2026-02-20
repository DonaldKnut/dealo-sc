import { Schema, model, Document } from "mongoose";

interface Rating extends Document {
  userId: Schema.Types.ObjectId;
  rating: number;
  comment?: string;
  reviews: Schema.Types.ObjectId[];
}

const RatingSchema = new Schema<Rating>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, default: 0, required: true },
  comment: { type: String },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

export const RatingModel = model<Rating>("Rating", RatingSchema);
