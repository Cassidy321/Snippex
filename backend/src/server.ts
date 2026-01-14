import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import crypto from "crypto";

import { env, logger, connectDatabase, isDatabaseConnected } from "@/config";
import { errorHandler, notFoundHandler } from "@/middlewares";
import { authRoutes, snippetRoutes, voteRoutes } from "@/routes";
import { globalLimiter, authLimiter } from "@/utils";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(globalLimiter);
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.headers["x-request-id"] || crypto.randomUUID(),
  })
);

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/snippets", snippetRoutes);
app.use("/api/snippets", voteRoutes);

app.get("/health", (_req, res) => {
  const dbConnected = isDatabaseConnected();
  const status = dbConnected ? "OK" : "DEGRADED";
  res.status(dbConnected ? 200 : 503).json({
    status,
    database: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  await connectDatabase();
  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });
};

startServer();
