import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriber extends Document {
  email: string;
  firstName?: string;
  lastName?: string;
  source: "footer" | "popup" | "landing" | "manual";
  isActive: boolean;
  subscribedAt: Date;
  lastEmailSent?: Date;
  tags: string[];
  preferences: {
    marketing: boolean;
    updates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

const subscriberSchema = new Schema<ISubscriber>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  source: {
    type: String,
    enum: ["footer", "popup", "landing", "manual"],
    default: "footer",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  lastEmailSent: {
    type: Date,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  preferences: {
    marketing: {
      type: Boolean,
      default: true,
    },
    updates: {
      type: Boolean,
      default: true,
    },
    promotions: {
      type: Boolean,
      default: true,
    },
    newsletter: {
      type: Boolean,
      default: true,
    },
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    referrer: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
  },
});

// Index for efficient queries
// Note: email index is automatically created by unique: true, so we don't need to add it explicitly
subscriberSchema.index({ isActive: 1 });
subscriberSchema.index({ subscribedAt: -1 });
subscriberSchema.index({ tags: 1 });

export const SubscriberModel =
  mongoose.models.Subscriber ||
  mongoose.model<ISubscriber>("Subscriber", subscriberSchema);








