import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";
import mongoose from "mongoose";
import { Message } from "@/models/Message";
import { ChatModel } from "@/models/Chat";
import { UserModel } from "@/models/User";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

// Store active users
const activeUsers = new Map<string, string>(); // userId -> socketId
const userSockets = new Map<string, string>(); // socketId -> userId

export const initSocket = (server: NetServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Authenticate user and join their rooms
    socket.on("authenticate", async (data: { userId: string }) => {
      try {
        const user = await UserModel.findById(data.userId);
        if (!user) {
          socket.emit("error", { message: "User not found" });
          return;
        }

        // Store user mapping
        activeUsers.set(data.userId, socket.id);
        userSockets.set(socket.id, data.userId);

        // Join user's personal room
        socket.join(`user:${data.userId}`);

        // Join user's chat rooms
        const userChats = await ChatModel.find({
          members: data.userId,
        });

        userChats.forEach((chat) => {
          socket.join(`chat:${chat._id}`);
        });

        // Emit online status to other users
        socket.broadcast.emit("user:online", { userId: data.userId });

        socket.emit("authenticated", { success: true });
      } catch (error) {
        console.error("Authentication error:", error);
        socket.emit("error", { message: "Authentication failed" });
      }
    });

    // Handle new message
    socket.on(
      "message:send",
      async (data: {
        chatId: string;
        text: string;
        media?: any[];
        replyTo?: string;
      }) => {
        try {
          const userId = userSockets.get(socket.id);
          if (!userId) {
            socket.emit("error", { message: "Not authenticated" });
            return;
          }

          // Create message in database
          const message = await Message.create({
            chat: data.chatId,
            sender: userId,
            text: data.text,
            media: data.media || [],
            replyTo: data.replyTo,
            seenBy: [userId],
          });

          // Populate sender information
          await message.populate([
            { path: "sender", select: "firstName lastName avatar" },
            {
              path: "replyTo",
              populate: { path: "sender", select: "firstName lastName" },
            },
          ]);

          // Update chat's last message
          await ChatModel.findByIdAndUpdate(data.chatId, {
            lastMessageAt: new Date(),
          });

          // Emit to chat room
          io.to(`chat:${data.chatId}`).emit("message:new", message);

          // Emit typing stop
          socket.to(`chat:${data.chatId}`).emit("typing:stop", { userId });
        } catch (error) {
          console.error("Message send error:", error);
          socket.emit("error", { message: "Failed to send message" });
        }
      }
    );

    // Handle typing indicator
    socket.on("typing:start", (data: { chatId: string }) => {
      const userId = userSockets.get(socket.id);
      if (userId) {
        socket.to(`chat:${data.chatId}`).emit("typing:start", { userId });
      }
    });

    socket.on("typing:stop", (data: { chatId: string }) => {
      const userId = userSockets.get(socket.id);
      if (userId) {
        socket.to(`chat:${data.chatId}`).emit("typing:stop", { userId });
      }
    });

    // Handle message reactions
    socket.on(
      "message:react",
      async (data: { messageId: string; reactionType: string }) => {
        try {
          const userId = userSockets.get(socket.id);
          if (!userId) {
            socket.emit("error", { message: "Not authenticated" });
            return;
          }

          const message = await Message.findById(data.messageId);
          if (!message) {
            socket.emit("error", { message: "Message not found" });
            return;
          }

          // Add reaction
          await message.addReaction(userId, data.reactionType);

          // Populate and emit updated message
          await message.populate([
            { path: "sender", select: "firstName lastName avatar" },
            { path: "reactions.userId", select: "firstName lastName" },
          ]);

          // Emit to chat room
          io.to(`chat:${message.chat}`).emit("message:updated", message);
        } catch (error) {
          console.error("Reaction error:", error);
          socket.emit("error", { message: "Failed to add reaction" });
        }
      }
    );

    // Handle message seen
    socket.on("message:seen", async (data: { messageId: string }) => {
      try {
        const userId = userSockets.get(socket.id);
        if (!userId) return;

        const message = await Message.findById(data.messageId);
        if (!message) return;

        // Add user to seen list if not already there
        if (!message.seenBy.some((id) => id.toString() === userId)) {
          message.seenBy.push(new mongoose.Types.ObjectId(userId));
          await message.save();

          // Emit to chat room
          io.to(`chat:${message.chat}`).emit("message:seen", {
            messageId: data.messageId,
            userId,
          });
        }
      } catch (error) {
        console.error("Message seen error:", error);
      }
    });

    // Handle user status
    socket.on(
      "status:update",
      (data: { status: "online" | "away" | "busy" | "offline" }) => {
        const userId = userSockets.get(socket.id);
        if (userId) {
          socket.broadcast.emit("user:status", {
            userId,
            status: data.status,
          });
        }
      }
    );

    // Handle disconnect
    socket.on("disconnect", () => {
      const userId = userSockets.get(socket.id);
      if (userId) {
        activeUsers.delete(userId);
        userSockets.delete(socket.id);

        // Emit offline status
        socket.broadcast.emit("user:offline", { userId });
      }

      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Helper function to get user's socket ID
export const getUserSocketId = (userId: string) => {
  return activeUsers.get(userId);
};

// Helper function to emit to specific user
export const emitToUser = (userId: string, event: string, data: any) => {
  const socketId = getUserSocketId(userId);
  if (socketId) {
    // This would need to be called from within the socket context
    // For now, we'll use the global io instance
    global.io?.to(socketId).emit(event, data);
  }
};

// Client-side socket utility
let socketInstance: any = null;

export const getSocket = () => {
  if (typeof window === "undefined") {
    // Server-side, return null or throw error
    throw new Error("getSocket can only be called on the client side");
  }

  if (!socketInstance) {
    // Import socket.io-client dynamically to avoid SSR issues
    const { io } = require("socket.io-client");
    socketInstance = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000",
      {
        autoConnect: true,
        transports: ["websocket", "polling"],
      }
    );
  }

  return socketInstance;
};
