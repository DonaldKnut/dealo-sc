import { Schema, model, models, Document } from "mongoose";

export interface JobAlert extends Document {
  user: Schema.Types.ObjectId;
  searchQuery?: string;
  location?: string;
  experience?: string;
  category?: string;
  type?: string;
  minSalary?: number;
  maxSalary?: number;
  remote?: boolean;
  isActive: boolean;
  lastNotifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobAlertSchema = new Schema<JobAlert>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    searchQuery: { type: String },
    location: { type: String },
    experience: { type: String },
    category: { type: String },
    type: { type: String },
    minSalary: { type: Number },
    maxSalary: { type: Number },
    remote: { type: Boolean },
    isActive: { type: Boolean, default: true },
    lastNotifiedAt: { type: Date },
  },
  { timestamps: true }
);

// Index for efficient querying
JobAlertSchema.index({ user: 1, isActive: 1 });

export const JobAlertModel =
  models.JobAlert || model<JobAlert>("JobAlert", JobAlertSchema);




