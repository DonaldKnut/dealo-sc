import { Schema, model, models, Document } from "mongoose";

export interface Enterprise {
  companyName: string;
  primaryEmail: string;
  domain: string;
  isFreeEmailDomain: boolean;
  verified: boolean;
  verificationCode?: string;
  verificationExpires?: Date;
  trustLevel: "low" | "medium" | "high";
  approved?: boolean;
  lastOtpSentAt?: Date;
  seatsLimit?: number;
  storageLimitBytes?: number;
  usedSeats?: number;
  usedStorageBytes?: number;
  createdAt: Date;
  updatedAt: Date;
}

const EnterpriseSchema = new Schema<Enterprise>(
  {
    companyName: { type: String, required: true },
    primaryEmail: { type: String, required: true, unique: true },
    domain: { type: String, required: true, index: true },
    isFreeEmailDomain: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationExpires: { type: Date },
    trustLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    approved: { type: Boolean, default: false },
    lastOtpSentAt: { type: Date },
    seatsLimit: { type: Number, default: 10 },
    storageLimitBytes: { type: Number, default: 10 * 1024 * 1024 * 1024 },
    usedSeats: { type: Number, default: 0 },
    usedStorageBytes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

EnterpriseSchema.index({ domain: 1, verified: 1 });

export const EnterpriseModel =
  models.Enterprise || model<Enterprise>("Enterprise", EnterpriseSchema);
