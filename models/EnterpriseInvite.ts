import { Schema, model, models, Document } from "mongoose";

export interface EnterpriseInvite extends Document {
  enterpriseId: Schema.Types.ObjectId;
  email: string;
  role: "employee" | "instructor" | "admin";
  status: "pending" | "accepted" | "expired";
  invitedBy: Schema.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EnterpriseInviteSchema = new Schema<EnterpriseInvite>(
  {
    enterpriseId: {
      type: Schema.Types.ObjectId,
      ref: "Enterprise",
      required: true,
    },
    email: { type: String, required: true },
    role: {
      type: String,
      enum: ["employee", "instructor", "admin"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "expired"],
      default: "pending",
    },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

EnterpriseInviteSchema.index({ email: 1, enterpriseId: 1 });
EnterpriseInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const EnterpriseInviteModel =
  models.EnterpriseInvite ||
  model<EnterpriseInvite>("EnterpriseInvite", EnterpriseInviteSchema);
