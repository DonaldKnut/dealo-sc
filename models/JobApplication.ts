import { Schema, model, Document, models } from "mongoose";

interface JobApplication extends Document {
  jobId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  coverLetter: string;
  resume: string; // Added resume field
  status: string;
}

const JobApplicationSchema = new Schema<JobApplication>({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  coverLetter: { type: String, required: true },
  resume: { type: String, required: true }, // Resume field added
  status: { type: String, required: true, default: "pending" }, // Default status
});

// Prevent model overwrite during hot reloads in development
export const JobApplicationModel =
  models.JobApplication || model<JobApplication>("JobApplication", JobApplicationSchema);
