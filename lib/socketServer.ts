// lib/socketServer.ts
import { Server as IOServer } from "socket.io";

export const getIO = (): IOServer => {
  if (!global.io) {
    throw new Error("Socket.IO server not initialized.");
  }
  return global.io;
};
