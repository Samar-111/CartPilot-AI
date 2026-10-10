import mongoose from "mongoose";
import { config } from "../config";

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(config.mongoUri);
    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}
