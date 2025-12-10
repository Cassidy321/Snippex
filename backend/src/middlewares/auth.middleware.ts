import { Request, Response, NextFunction } from "express";
import { tokenService, TokenPayload } from "@/services";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Invalid token format" });
      return;
    }

    const payload = tokenService.verifyAccessToken(token);

    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};
