// server.ts
import express, { Request, Response } from "express";
import next from "next";
import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

let io: IOServer;

declare global {
  var io: IOServer | undefined;
}

app.prepare().then(() => {
  const expressApp = express();
  const httpServer: HTTPServer = createServer(expressApp);

  io = new IOServer(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  global.io = io;

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  expressApp.all("*", (req: Request, res: Response) => {
    return handle(req, res);
  });

  const PORT = parseInt(process.env.NEXTAUTH_URL || "3000", 10);
  httpServer.listen(PORT, () => {
    console.log(`✅ Server ready on http://localhost:${PORT}`);
  });
});
