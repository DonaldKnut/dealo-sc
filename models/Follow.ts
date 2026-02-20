import mongoose, { Schema, Document } from "mongoose";

export interface IFollow extends Document {
  followerId: mongoose.Types.ObjectId;
  followingId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FollowSchema = new Schema<IFollow>(
  {
    followerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    followingId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate follows
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

// Indexes for efficient queries
FollowSchema.index({ followerId: 1 }); // Who user is following
FollowSchema.index({ followingId: 1 }); // Who follows user
FollowSchema.index({ createdAt: -1 }); // Recent follows

export const FollowModel =
  mongoose.models.Follow || mongoose.model<IFollow>("Follow", FollowSchema);
