import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  name?: string;
  members: mongoose.Types.ObjectId[];
  lastMessageAt?: Date;
  lastMessage?: mongoose.Types.ObjectId;
  isGroupChat: boolean;
  groupAdmin?: mongoose.Types.ObjectId;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

const ChatSchema = new Schema<IChat>(
  {
    name: {
      type: String,
      trim: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.isGroupChat;
      },
    },
    metadata: {
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
ChatSchema.index({ members: 1 });
ChatSchema.index({ lastMessageAt: -1 });

// Method to add member to chat
ChatSchema.methods.addMember = function (userId: string): void {
  if (!this.members.includes(userId)) {
    this.members.push(userId);
  }
};

// Method to remove member from chat
ChatSchema.methods.removeMember = function (userId: string): void {
  this.members = this.members.filter(
    (member: any) => member.toString() !== userId
  );
};

// Method to check if user is member
ChatSchema.methods.isMember = function (userId: string): boolean {
  return this.members.some((member: any) => member.toString() === userId);
};

// Static method to find or create direct chat
ChatSchema.statics.findOrCreateDirectChat = async function (
  user1Id: string,
  user2Id: string
) {
  // Find existing direct chat
  const existingChat = await this.findOne({
    members: { $all: [user1Id, user2Id] },
    isGroupChat: false,
  });

  if (existingChat) {
    return existingChat;
  }

  // Create new direct chat
  const newChat = new this({
    members: [user1Id, user2Id],
    isGroupChat: false,
  });

  return await newChat.save();
};

// Static method to create group chat
ChatSchema.statics.createGroupChat = async function (
  name: string,
  adminId: string,
  memberIds: string[]
) {
  const members = [adminId, ...memberIds];

  const groupChat = new this({
    name,
    members,
    isGroupChat: true,
    groupAdmin: adminId,
  });

  return await groupChat.save();
};

export const ChatModel =
  mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);
