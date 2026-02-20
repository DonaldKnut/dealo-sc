import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  chat: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  text: string;
  media: {
    type: "image" | "video" | "audio" | "document";
    url: string;
    thumbnail?: string;
    duration?: number; // For video/audio
    size?: number;
    filename?: string;
  }[];
  reactions: {
    userId: mongoose.Types.ObjectId;
    type:
      | "like"
      | "love"
      | "laugh"
      | "wow"
      | "sad"
      | "angry"
      | "fire"
      | "rocket"
      | "eyes";
    createdAt: Date;
  }[];
  replyTo?: mongoose.Types.ObjectId; // Reply to another message
  isEdited: boolean;
  editHistory: {
    text: string;
    editedAt: Date;
  }[];
  isDeleted: boolean;
  deletedAt?: Date;
  seenBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  addReaction(userId: string, reactionType: string): Promise<IMessage>;
  removeReaction(userId: string): Promise<IMessage>;
  markAsSeen(userId: string): Promise<IMessage>;
  editMessage(newText: string): Promise<IMessage>;
  deleteMessage(): Promise<IMessage>;
}

const MessageSchema = new Schema<IMessage>(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      default: "",
      maxlength: 5000, // Increased character limit for longer posts
    },
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video", "audio", "document"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        thumbnail: {
          type: String,
        },
        duration: {
          type: Number, // Duration in seconds for video/audio
        },
        size: {
          type: Number, // File size in bytes
        },
        filename: {
          type: String,
        },
      },
    ],
    reactions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        type: {
          type: String,
          enum: [
            "like",
            "love",
            "laugh",
            "wow",
            "sad",
            "angry",
            "fire",
            "rocket",
            "eyes",
          ],
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editHistory: [
      {
        text: {
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
    seenBy: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
MessageSchema.index({ chat: 1, createdAt: -1 }); // conversationId equivalent (chat field)
MessageSchema.index({ sender: 1, createdAt: -1 });
MessageSchema.index({ "reactions.userId": 1 });
MessageSchema.index({ replyTo: 1 });
MessageSchema.index({ isDeleted: 1, createdAt: -1 }); // For filtering deleted messages

// Virtual for reaction counts
MessageSchema.virtual("reactionCounts").get(function () {
  const counts: { [key: string]: number } = {};
  this.reactions.forEach((reaction: any) => {
    counts[reaction.type] = (counts[reaction.type] || 0) + 1;
  });
  return counts;
});

// Method to add reaction
MessageSchema.methods.addReaction = function (
  userId: string,
  reactionType: string
) {
  // Remove existing reaction from this user
  this.reactions = this.reactions.filter(
    (reaction: any) => reaction.userId.toString() !== userId
  );

  // Add new reaction
  this.reactions.push({
    userId,
    type: reactionType,
    createdAt: new Date(),
  });

  return this.save();
};

// Method to remove reaction
MessageSchema.methods.removeReaction = function (userId: string) {
  this.reactions = this.reactions.filter(
    (reaction: any) => reaction.userId.toString() !== userId
  );

  return this.save();
};

// Method to mark as seen
MessageSchema.methods.markAsSeen = function (userId: string) {
  if (!this.seenBy.includes(userId)) {
    this.seenBy.push(userId);
  }
  return this.save();
};

// Method to edit message
MessageSchema.methods.editMessage = function (newText: string) {
  // Add current text to edit history
  this.editHistory.push({
    text: this.text,
    editedAt: new Date(),
  });

  this.text = newText;
  this.isEdited = true;
  this.updatedAt = new Date();

  return this.save();
};

// Method to delete message
MessageSchema.methods.deleteMessage = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.updatedAt = new Date();

  return this.save();
};

// Pre-save middleware to update timestamps
MessageSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Export the Message model and IMessage type
export const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export const MessageModel = Message;
