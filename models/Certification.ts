import mongoose, { Schema, Document } from "mongoose";
import { CertificationLevel } from "@/lib/ai-assessment";

export interface ICertification extends Document {
  userId: mongoose.Types.ObjectId;
  field: string;
  level: CertificationLevel;
  assessmentId: mongoose.Types.ObjectId;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  certificateId: string;
  certificateUrl?: string;
  issuedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  revokedAt?: Date;
  revokedReason?: string;
  metadata: {
    assessmentDuration: number;
    attempts: number;
    feedback: string;
    skills: string[];
    endorsements: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CertificationSchema = new Schema<ICertification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    field: {
      type: String,
      required: true,
      index: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      required: true,
    },
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPoints: {
      type: Number,
      required: true,
      min: 0,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      required: true,
      default: false,
    },
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    certificateUrl: {
      type: String,
    },
    issuedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    revokedAt: {
      type: Date,
    },
    revokedReason: {
      type: String,
    },
    metadata: {
      assessmentDuration: {
        type: Number,
        required: true,
        min: 0,
      },
      attempts: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
      },
      feedback: {
        type: String,
        required: true,
      },
      skills: [
        {
          type: String,
        },
      ],
      endorsements: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
CertificationSchema.index({ userId: 1, field: 1, level: 1 });
CertificationSchema.index({ field: 1, level: 1, isActive: 1 });
CertificationSchema.index({ issuedAt: -1 });
CertificationSchema.index({ expiresAt: 1 });

// Virtual for certificate status
CertificationSchema.virtual("status").get(function () {
  if (this.revokedAt) return "revoked";
  if (this.expiresAt && this.expiresAt < new Date()) return "expired";
  if (!this.isActive) return "inactive";
  return "active";
});

// Virtual for time until expiration
CertificationSchema.virtual("daysUntilExpiration").get(function () {
  if (!this.expiresAt) return null;
  const now = new Date();
  const diffTime = this.expiresAt.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to check if certificate is valid
CertificationSchema.methods.isValid = function (): boolean {
  return (
    this.isActive &&
    !this.revokedAt &&
    (!this.expiresAt || this.expiresAt > new Date())
  );
};

// Method to revoke certificate
CertificationSchema.methods.revoke = function (reason: string): void {
  this.isActive = false;
  this.revokedAt = new Date();
  this.revokedReason = reason;
};

// Method to renew certificate
CertificationSchema.methods.renew = function (expirationDate?: Date): void {
  this.isActive = true;
  this.revokedAt = undefined;
  this.revokedReason = undefined;
  if (expirationDate) {
    this.expiresAt = expirationDate;
  }
};

// Static method to find active certifications for a user
CertificationSchema.statics.findActiveByUser = function (userId: string) {
  return this.find({
    userId,
    isActive: true,
    revokedAt: { $exists: false },
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } },
    ],
  }).populate("assessmentId");
};

// Static method to find certifications by field and level
CertificationSchema.statics.findByFieldAndLevel = function (
  field: string,
  level: CertificationLevel
) {
  return this.find({
    field,
    level,
    isActive: true,
    revokedAt: { $exists: false },
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } },
    ],
  }).populate("userId", "firstName lastName avatar");
};

// Static method to generate certificate ID
CertificationSchema.statics.generateCertificateId = function (): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `CERT-${timestamp}-${random}`.toUpperCase();
};

export const CertificationModel =
  mongoose.models.Certification ||
  mongoose.model<ICertification>("Certification", CertificationSchema);
