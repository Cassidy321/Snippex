import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/config";

const WINDOW_MS = 15 * 60 * 1000;

const unauthenticatedLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: 30,
  keyGenerator: (req) => req.ip || "unknown",
  message: { success: false, message: "Too many requests, please try again later" },
});

const authenticatedLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: 200,
  keyGenerator: (req) =>
    (req as Request & { rateLimitKey?: string }).rateLimitKey || req.ip || "unknown",
  message: { success: false, message: "Too many requests, please try again later" },
});

export const globalLimiter = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
      (req as Request & { rateLimitKey?: string }).rateLimitKey = decoded.id;
      return authenticatedLimiter(req, res, next);
    } catch {
      return unauthenticatedLimiter(req, res, next);
    }
  }

  return unauthenticatedLimiter(req, res, next);
};

export const authLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: 20,
  skipSuccessfulRequests: true,
  message: { success: false, message: "Too many attempts, please try again later" },
});
