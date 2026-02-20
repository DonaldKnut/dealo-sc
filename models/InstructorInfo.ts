// models/InstructorInfo.ts
import { Schema, model, models, Document } from "mongoose";

export interface InstructorInfo extends Document {
  bio: string;
  availability: "full_time" | "part_time" | "as_needed";
  portfolioUrl: string;
  course: string;
  qualifications: string;
  certificateUrl?: string;
}

const InstructorInfoSchema = new Schema<InstructorInfo>(
  {
    bio: { type: String, required: true },
    availability: {
      type: String,
      enum: ["full_time", "part_time", "as_needed"],
      required: true,
    },
    portfolioUrl: { type: String, required: true },
    course: { type: String, required: true },
    qualifications: { type: String, required: true },
    certificateUrl: { type: String },
  },
  { timestamps: true }
);

export const InstructorInfoModel =
  models.InstructorInfo ||
  model<InstructorInfo>("InstructorInfo", InstructorInfoSchema);
