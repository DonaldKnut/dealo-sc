import mongoose, { Schema, model, Document } from "mongoose";
import { CloudflareStreamData } from "@/models/CloudflareStreamData";

interface Section extends Document {
  title: string;
  description?: string;
  videoUrl?: string;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  courseId: Schema.Types.ObjectId; // Use ObjectId for references
  cloudflareStreamData?: Schema.Types.ObjectId | CloudflareStreamData; // Reference to CloudflareStreamData
  resources: Schema.Types.ObjectId[]; // Array of resource IDs
  progress: Schema.Types.ObjectId[]; // Array of progress IDs
}

const SectionSchema = new Schema<Section>(
  {
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String },
    position: { type: Number, required: true },
    isPublished: { type: Boolean, default: false },
    isFree: { type: Boolean, default: false },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    cloudflareStreamData: { type: Schema.Types.ObjectId, ref: "CloudflareStreamData" },
    resources: [{ type: Schema.Types.ObjectId, ref: "Resource" }],
    progress: [{ type: Schema.Types.ObjectId, ref: "Progress" }],
  },
  { timestamps: true }
);

const SectionModel =
  mongoose.models.Section || model<Section>("Section", SectionSchema);

export { SectionModel };
export type { Section };
