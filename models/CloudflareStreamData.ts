// CloudflareStreamData Model
import { Schema, model, models, Document } from "mongoose";

export interface CloudflareStreamData extends Document {
  uid: string; // Cloudflare Stream video ID
  playbackUrl?: string; // Direct playback URL
  thumbnail?: string; // Thumbnail URL
  duration?: number; // Video duration in seconds
  width?: number; // Video width
  height?: number; // Video height
  status: "uploading" | "ready" | "error"; // Video processing status
  fileSize?: number; // Original file size in bytes
  instructorId?: Schema.Types.ObjectId; // Reference to instructor who uploaded
  sectionId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CloudflareStreamDataSchema = new Schema<CloudflareStreamData>(
  {
    uid: { type: String, required: true, unique: true },
    playbackUrl: { type: String },
    thumbnail: { type: String },
    duration: { type: Number },
    width: { type: Number },
    height: { type: Number },
    status: {
      type: String,
      enum: ["uploading", "ready", "error"],
      default: "uploading",
    },
    fileSize: { type: Number }, // Original file size in bytes
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
CloudflareStreamDataSchema.index({ uid: 1 });
CloudflareStreamDataSchema.index({ sectionId: 1 });
CloudflareStreamDataSchema.index({ status: 1 });
CloudflareStreamDataSchema.index({ instructorId: 1 }); // For storage tracking queries

// Use models check to prevent overwrite errors in Next.js
export const CloudflareStreamDataModel =
  models.CloudflareStreamData ||
  model<CloudflareStreamData>("CloudflareStreamData", CloudflareStreamDataSchema);



