import mongoose, { Mongoose } from "mongoose";
import dns from "dns";
import dotenv from "dotenv";
dotenv.config();

// Fix for "querySrv ECONNREFUSED" on Windows: use public DNS for SRV lookup.
// Node's default resolver can fail (firewall/antivirus); Compass may still work via OS resolver.
if (typeof dns.setServers === "function") {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
}
dns.setDefaultResultOrder("ipv4first");

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connect() {
  // Prefer standard (non-SRV) URI if set — avoids querySrv ECONNREFUSED on some networks.
  // Same cluster = same data; no need to copy users. See docs/MONGODB_CONNECTION.md.
  const mongodbUrl =
    process.env.MONGODB_STANDARD_URI ||
    process.env.MONGODB_URL ||
    process.env.MONGODB_URI;

  if (!mongodbUrl) {
    throw new Error("MongoDB URL is not defined in environment variables.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongodbUrl, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        family: 4,
      })
      .then((mongooseInstance) => {
        console.log("MongoDB connected successfully");
        mongoose.connection.on("error", (err) => {
          console.error("MongoDB connection error:", err);
          cached.conn = null;
          cached.promise = null;
        });
        mongoose.connection.on("disconnected", () => {
          console.warn("MongoDB disconnected, will retry on next request");
          cached.conn = null;
          cached.promise = null;
        });
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message || error);
        cached.promise = null;
        cached.conn = null;
        throw new Error("Failed to connect to MongoDB");
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
