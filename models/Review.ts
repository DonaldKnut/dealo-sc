// models/Review.ts
import { Schema, model, models, Document, Types } from "mongoose";

export interface ReviewDocument extends Document {
  rating: number;
  comment: string;
  createdAt: Date;
  reviewer: Types.ObjectId; // User who gave the review
  reviewee: Types.ObjectId; // User being reviewed
  roleContext: "FREELANCER" | "INSTRUCTOR" | "COMPANY" | "DOCTOR";
  courseId?: Types.ObjectId;
  jobId?: Types.ObjectId;
}

const ReviewSchema = new Schema<ReviewDocument>(
  {
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewee: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roleContext: {
      type: String,
      enum: ["FREELANCER", "INSTRUCTOR", "COMPANY", "DOCTOR"],
      required: true,
    },
    courseId: { type: Schema.Types.ObjectId, ref: "Course" },
    jobId: { type: Schema.Types.ObjectId, ref: "JobPost" },
  },
  { timestamps: true }
);

export const ReviewModel =
  models.Review || model<ReviewDocument>("Review", ReviewSchema);
