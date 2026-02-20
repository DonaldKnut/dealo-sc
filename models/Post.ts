import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  author: mongoose.Types.ObjectId;
  content: string;
  images?: string[];
  likes: mongoose.Types.ObjectId[];
  likesCount: number;
  commentsCount: number;
  shares: number;
  visibility: "public" | "connections" | "private";
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 3000,
    },
    images: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    visibility: {
      type: String,
      enum: ["public", "connections", "private"],
      default: "public",
    },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

PostSchema.index({ createdAt: -1 });
PostSchema.index({ author: 1, createdAt: -1 });

export interface IComment extends Document {
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  likes: mongoose.Types.ObjectId[];
  likesCount: number;
  parentComment?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true }
);

CommentSchema.index({ post: 1, createdAt: -1 });

export const PostModel =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export const CommentModel =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
