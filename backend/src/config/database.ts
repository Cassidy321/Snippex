import mongoose from "mongoose";
import logger from "@/config/logger";

export const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI!);
    logger.info("MongoDB connected");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("MongoDB connection error: " + message);
    process.exit(1);
  }
};

export default connectDatabase;
