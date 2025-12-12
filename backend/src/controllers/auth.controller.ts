import { Request, Response, NextFunction } from "express";
import { authService, tokenService } from "@/services";
import { RegisterDTO, LoginDTO } from "@/dto";

export const register = async (
  req: Request<{}, {}, RegisterDTO>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await authService.registerUser(req.body);
    const tokens = tokenService.generateTokens(user._id.toString(), user.email);

    tokenService.setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(201).json({
      message: "Account created successfully",
      accessToken: tokens.accessToken,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<{}, {}, LoginDTO>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await authService.loginUser(req.body);
    const tokens = tokenService.generateTokens(user._id.toString(), user.email);

    tokenService.setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(200).json({
      message: "Logged in successfully",
      accessToken: tokens.accessToken,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ error: "Session expired, plaese login again" });
      return;
    }

    const user = await authService.refreshAuth(refreshToken);
    const tokens = tokenService.generateTokens(user._id.toString(), user.email);

    tokenService.setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  tokenService.clearRefreshTokenCookie(res);
  res.status(200).json({ message: "Logged out successfully" });
};
