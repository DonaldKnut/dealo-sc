import { Schema, model, models, Document } from "mongoose";

export interface Comment extends Document {
  workId: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  content: string;
  likes: Schema.Types.ObjectId[];
  replies: Schema.Types.ObjectId[];
  parentComment?: Schema.Types.ObjectId;
  isEdited: boolean;
  editHistory: {
    content: string;
    editedAt: Date;
  }[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<Comment>(
  {
    workId: {
      type: Schema.Types.ObjectId,
      ref: "Work",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editHistory: [
      {
        content: {
          type: String,
          required: true,
        },
        editedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Indexes for better performance
CommentSchema.index({ workId: 1, createdAt: -1 });
CommentSchema.index({ author: 1, createdAt: -1 });
CommentSchema.index({ parentComment: 1 });

// Virtual for like count
CommentSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// Virtual for reply count
CommentSchema.virtual("replyCount").get(function () {
  return this.replies.length;
});

// Method to add like
CommentSchema.methods.addLike = function (userId: string) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
  }
  return this.save();
};

// Method to remove like
CommentSchema.methods.removeLike = function (userId: string) {
  this.likes = this.likes.filter((likeId: any) => likeId.toString() !== userId);
  return this.save();
};

// Method to edit comment
CommentSchema.methods.editComment = function (newContent: string) {
  // Add current content to edit history
  this.editHistory.push({
    content: this.content,
    editedAt: new Date(),
  });

  this.content = newContent;
  this.isEdited = true;
  this.updatedAt = new Date();

  return this.save();
};

// Method to delete comment
CommentSchema.methods.deleteComment = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.updatedAt = new Date();

  return this.save();
};

export const CommentModel =
  models.Comment || model<Comment>("Comment", CommentSchema);
