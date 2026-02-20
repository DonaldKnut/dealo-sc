import { Schema, model, models, Document } from "mongoose";

export enum JobPostStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
}

export interface JobPost extends Document {
  jobTitle: string;
  employmentType: string;
  location: string;
  salaryFrom: number;
  salaryTo: number;
  jobDescription: string;
  listingDuration: number; // Duration in days
  benefits: string[];
  status: JobPostStatus;
  applications: number;
  company: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date; // New field for expiry
  isPaid: boolean; // Tracks if N600 fee is paid for extended visibility
}

export interface JobPostDocument extends Document, JobPost {}

const JobPostSchema = new Schema<JobPostDocument>(
  {
    jobTitle: { type: String, required: true, trim: true },
    employmentType: { type: String, required: true },
    location: { type: String, required: true },
    salaryFrom: { type: Number, required: true, min: 0 },
    salaryTo: { type: Number, required: true, min: 0 },
    jobDescription: { type: String, required: true },
    listingDuration: { type: Number, required: true, min: 1 }, // In days
    benefits: { type: [String], default: [] },
    status: {
      type: String,
      enum: Object.values(JobPostStatus),
      default: JobPostStatus.DRAFT,
    },
    applications: { type: Number, default: 0 },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    expiresAt: { type: Date }, // Calculated based on listingDuration
    isPaid: { type: Boolean, default: false }, // N600 payment status
  },
  { timestamps: true }
);

// Add indexes for performance
JobPostSchema.index({ isActive: 1, createdAt: -1 }); // Note: Using status field, but adding isActive for common queries
JobPostSchema.index({ status: 1, createdAt: -1 });
JobPostSchema.index({ company: 1, status: 1 });
JobPostSchema.index({ expiresAt: 1 }); // For finding expired jobs
JobPostSchema.index({ createdAt: -1 });

// Pre-save hook to set expiresAt based on listingDuration
JobPostSchema.pre("save", function (next) {
  if (this.isNew && this.listingDuration) {
    const durationInMs = this.listingDuration * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    this.expiresAt = new Date(Date.now() + durationInMs);
  }
  next();
});

export const JobPostModel =
  models.JobPost || model<JobPostDocument>("JobPost", JobPostSchema);
