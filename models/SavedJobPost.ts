import { Schema, model, models, Document } from "mongoose";

export interface SavedJobPost extends Document {
  job: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedJobPostDocument extends Document, SavedJobPost {}

const SavedJobPostSchema = new Schema<SavedJobPostDocument>(
  {
    job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Ensure unique combination of user and job
SavedJobPostSchema.index({ user: 1, job: 1 }, { unique: true });

export const SavedJobPostModel =
  models.SavedJobPost ||
  model<SavedJobPostDocument>("SavedJobPost", SavedJobPostSchema);
