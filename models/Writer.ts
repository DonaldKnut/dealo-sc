import mongoose, { Schema, Document } from "mongoose";

export interface IWriter extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  writingExperience: string;
  writingCategories: string[];
  portfolioUrl?: string;
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationTokenExpires?: Date;
  totalPosts: number;
  totalViews: number;
  totalEarnings: number;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const WriterSchema = new Schema<IWriter>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    writingExperience: {
      type: String,
      required: true,
    },
    writingCategories: [
      {
        type: String,
        required: true,
      },
    ],
    portfolioUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationTokenExpires: {
      type: Date,
    },
    totalPosts: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      website: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
// Note: email index is automatically created by unique: true, so we don't need to add it explicitly
WriterSchema.index({ status: 1 });
WriterSchema.index({ isActive: 1 });

export const WriterModel =
  mongoose.models.Writer || mongoose.model<IWriter>("Writer", WriterSchema);
