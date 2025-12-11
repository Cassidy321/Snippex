import { Request, Response, NextFunction } from "express";
import { ApiError } from "@/utils";
import { logger } from "@/config";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  logger.error({ err }, "Unexpected error");
  res.status(500).json({ error: "Server error" });
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ error: "Route not found" });
};
