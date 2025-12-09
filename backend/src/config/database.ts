import mongoose from "mongoose";
import { logger } from "@/config";

export const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI!);
    logger.info({ host: connection.connection.host }, "MongoDB connected");
  } catch (error) {
    logger.error({ error }, "MongoDB connection failed");
    process.exit(1);
  }
};
