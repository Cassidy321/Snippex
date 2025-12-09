import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import "dotenv/config";

import { connectDatabase } from "@/config";
import { logger } from "@/config";
// import snippetRoutes from "@/routes/snippet";
// import authRoutes from "@/routes/auth";

const app = express();
const PORT = process.env.PORT || 8000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(limiter);
app.use(cookieParser());

// app.use("/api/snippets", snippetRoutes);
// app.use("/api/auth", authRoutes);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const startServer = async (): Promise<void> => {
  await connectDatabase();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

startServer();
