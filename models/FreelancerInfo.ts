// models/FreelancerInfo.ts
import { Schema, model, models, Document } from "mongoose";

export interface FreelancerInfo extends Document {
  bio: string;
  skills: string[];
  hourlyRate: number;
  availability: "full_time" | "part_time" | "as_needed";
  experienceLevel: string;
  preferredWorkType: string;
  portfolioUrl: string;
  location: string;
  languagesSpoken: string[];
}

const FreelancerInfoSchema = new Schema<FreelancerInfo>(
  {
    bio: { type: String, required: true },
    skills: [{ type: String, required: true }],
    hourlyRate: { type: Number, required: true },
    availability: {
      type: String,
      enum: ["full_time", "part_time", "as_needed"],
      required: true,
    },
    experienceLevel: { type: String, required: true },
    preferredWorkType: { type: String, required: true },
    portfolioUrl: { type: String, required: true },
    location: { type: String, required: true },
    languagesSpoken: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export const FreelancerInfoModel =
  models.FreelancerInfo ||
  model<FreelancerInfo>("FreelancerInfo", FreelancerInfoSchema);
