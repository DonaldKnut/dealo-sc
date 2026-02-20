import { Schema, model, models, Document } from "mongoose";

export interface UserRole extends Document {
  userId: Schema.Types.ObjectId;
  role: "student" | "freelancer" | "instructor" | "company" | "admin";
  title?: string; // Custom title like "Senior Developer", "Marketing Expert", etc.
  isVerified: boolean;
  verificationBadge?: string; // "Verified", "Top Rated", "Pro", etc.
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserRoleSchema = new Schema<UserRole>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["student", "freelancer", "instructor", "company", "admin"],
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationBadge: {
      type: String,
      enum: ["Verified", "Top Rated", "Pro", "Expert", "Elite"],
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

UserRoleSchema.index({ userId: 1 });
UserRoleSchema.index({ role: 1 });

export const UserRoleModel =
  models.UserRole || model<UserRole>("UserRole", UserRoleSchema);
