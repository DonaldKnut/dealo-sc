import mongoose, { Schema, Document } from "mongoose";

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  content: {
    type: "video" | "image" | "work" | "course" | "post";
    id: mongoose.Types.ObjectId;
  };
  contentType: string; // Reference to the model (Work, Course, etc.)
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: {
        type: String,
        enum: ["video", "image", "work", "course", "post"],
        required: true,
      },
      id: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "contentType",
      },
    },
    contentType: {
      type: String,
      required: true,
      enum: ["Work", "Course", "Post", "Video", "Image"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate likes
LikeSchema.index(
  { user: 1, "content.id": 1, "content.type": 1 },
  { unique: true }
);

// Index for efficient querying
LikeSchema.index({ "content.id": 1, "content.type": 1 });
LikeSchema.index({ user: 1, createdAt: -1 });

// Static method to get like count for content
LikeSchema.statics.getLikeCount = function (
  contentId: string,
  contentType: string
) {
  return this.countDocuments({
    "content.id": contentId,
    "content.type": contentType,
  });
};

// Static method to check if user has liked content
LikeSchema.statics.hasUserLiked = function (
  userId: string,
  contentId: string,
  contentType: string
) {
  return this.exists({
    user: userId,
    "content.id": contentId,
    "content.type": contentType,
  });
};

// Static method to get user's liked content
LikeSchema.statics.getUserLikes = function (
  userId: string,
  contentType?: string,
  limit = 20,
  skip = 0
) {
  const query: any = { user: userId };
  if (contentType) {
    query["content.type"] = contentType;
  }

  return this.find(query)
    .populate("content.id")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

export const LikeModel =
  mongoose.models.Like || mongoose.model<ILike>("Like", LikeSchema);
