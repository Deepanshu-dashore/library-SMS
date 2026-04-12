import mongoose from "mongoose";
import "@/app/lib/models"; // registers all Mongoose schemas at connection time

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export const connectDB = async (): Promise<void> => {
  if (connection.isConnected) {
    return;
  }
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const connectionString = process.env.MONGODB_URI;
  if (!connectionString) {
    throw new Error("MongoDB URI is not defined");
  }
  try {
    const db = await mongoose.connect(connectionString);
    connection.isConnected = db.connections[0].readyState;
    console.log("Library-SMS connected");
  } catch (error) {
    console.error("Library-SMS connection error:", error);
    throw error;
  }
};
