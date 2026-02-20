import { Schema, model, Document, models } from "mongoose";

export interface Job extends Document {
  _id: Schema.Types.ObjectId;
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  postedBy?: Schema.Types.ObjectId;
  completedAt?: Date;
  canceledAt?: Date;
  skillsRequired: string[];
  location: string;
  experienceRequired: string | number;
  isRemote: boolean;
  category: string;
  applications: Schema.Types.ObjectId[];
  userId?: Schema.Types.ObjectId;
  payment?: Schema.Types.ObjectId;
  city?: string;
  country?: string;
  type?: string;
  remote: boolean;
  jobIcon?: string;
  contactPhone?: string;
  contactPhoto?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isFeatured?: boolean;
  organizationId?: Schema.Types.ObjectId; // Reference to Company/Organization
  company?: Schema.Types.ObjectId; // Alias for organizationId
  status?: string; // Job status: "Active", "Pending Verification", "Closed", etc.
  contactEmail?: string; // For unauthenticated users
  companyName?: string; // For unauthenticated users
  verificationToken?: string; // For email verification
  isEmailVerified?: boolean; // Email verification status
}

const JobSchema = new Schema<Job>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    budget: { type: Number, required: true, min: 0 },
    deadline: { type: Date, required: true },
    postedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Made optional for unauthenticated users
    completedAt: { type: Date },
    canceledAt: { type: Date },
    skillsRequired: { type: [String], required: true },
    location: { type: String, required: true },
    experienceRequired: { type: Schema.Types.Mixed },
    isRemote: { type: Boolean, required: true },
    category: { type: String, required: true },
    applications: [{ type: Schema.Types.ObjectId, ref: "JobApplication" }],
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    payment: { type: Schema.Types.ObjectId, ref: "Payment" },
    city: { type: String, trim: true },
    country: { type: String, trim: true },
    type: {
      type: String,
      enum: ["contract", "part-time", "full-time", "internship", "freelance"],
      default: "full-time",
    },
    remote: { type: Boolean, required: true },
    jobIcon: { type: String },
    contactPhone: { 
      type: String,
      trim: true,
      validate: {
        validator: function(v: any) {
          // Handle optional field
          if (!v || v === '' || v === null || v === undefined) {
            return true;
          }
          
          // Ensure it's a string
          const phoneStr = String(v).trim();
          if (!phoneStr) return true; // Empty after trim is valid (optional field)
          
          // Remove all formatting characters (spaces, dashes, parentheses) but keep the + sign
          const cleaned = phoneStr.replace(/[\s\-\(\)]/g, '');
          
          // E.164 format: starts with +, followed by 1-15 digits (first digit after + should be 1-9)
          if (cleaned.startsWith('+')) {
            // E.164 format: + followed by 1-15 digits total
            // The first digit after + must be 1-9, then 0-14 more digits
            const digitsAfterPlus = cleaned.substring(1);
            if (digitsAfterPlus.length < 1 || digitsAfterPlus.length > 15) {
              return false;
            }
            // First digit must be 1-9, rest can be 0-9
            return /^[1-9]\d{0,14}$/.test(digitsAfterPlus);
          } else {
            // Allow numbers without + (for backward compatibility)
            // Must be 7-15 digits, first digit should be 1-9
            if (cleaned.length < 7 || cleaned.length > 15) {
              return false;
            }
            return /^[1-9]\d{6,14}$/.test(cleaned);
          }
        },
        message: function(props: any) {
          return `Phone number "${props.value}" is invalid. Please use E.164 format (e.g., +1234567890)`;
        }
      }
    },
    contactPhoto: { type: String },
    isFeatured: { type: Boolean, default: false },
    organizationId: { type: Schema.Types.ObjectId, ref: "Company" }, // Reference to Company
    company: { type: Schema.Types.ObjectId, ref: "Company" }, // Alias for organizationId
    status: { 
      type: String, 
      enum: ["Active", "Pending Verification", "Closed", "Draft"],
      default: "Active" 
    },
    contactEmail: { type: String, trim: true },
    companyName: { type: String, trim: true },
    verificationToken: { type: String },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const JobModel = models.Job || model<Job>("Job", JobSchema);
