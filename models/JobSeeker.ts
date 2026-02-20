import { Schema, model, models, Document } from "mongoose";

export interface JobSeeker extends Document {
  about: string;
  coverLetter: string;
  resume: string;
  user: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobSeekerDocument extends Document, JobSeeker {}

const JobSeekerSchema = new Schema<JobSeekerDocument>(
  {
    about: { type: String, required: true },
    coverLetter: { type: String, required: true }, // URL or path to resume file
    resume: { type: String, required: true }, // URL or path to resume file
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const JobSeekerModel =
  models.JobSeeker || model<JobSeekerDocument>("JobSeeker", JobSeekerSchema);
