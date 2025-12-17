import { Request, Response, NextFunction } from "express";
import { z, ZodType } from "zod";

interface ValidationSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

declare global {
  namespace Express {
    interface Request {
      validated?: {
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

export const validate =
  (schemas: ValidationSchemas) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.validated = {};

      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }

      if (schemas.query) {
        req.validated.query = await schemas.query.parseAsync(req.query);
      }

      if (schemas.params) {
        req.validated.params = await schemas.params.parseAsync(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: "Validation failed",
          details: error.issues.map((issue) => issue.message),
        });
        return;
      }
      next(error);
    }
  };
