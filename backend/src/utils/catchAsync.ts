import { Request, Response, NextFunction, RequestHandler } from "express";

type Fn = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const catchAsync = (fn: Fn): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
