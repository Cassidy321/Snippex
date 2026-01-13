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

    await tokenService.saveRefreshToken(tokens.refreshToken, user._id.toString());
    tokenService.setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { accessToken: tokens.accessToken, user: user.toJSON() },
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

    await tokenService.saveRefreshToken(tokens.refreshToken, user._id.toString());
    tokenService.setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { accessToken: tokens.accessToken, user: user.toJSON() },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ success: false, message: "Session expired, please login again" });
      return;
    }

    const tokenExists = await tokenService.findRefreshToken(refreshToken);
    if (!tokenExists) {
      res.status(401).json({ success: false, message: "Session expired, please login again" });
      return;
    }

    const user = await authService.refreshAuth(refreshToken);
    const tokens = tokenService.generateTokens(user._id.toString(), user.email);

    await tokenService.revokeRefreshToken(refreshToken);
    await tokenService.saveRefreshToken(tokens.refreshToken, user._id.toString());
    tokenService.setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: { accessToken: tokens.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await tokenService.revokeRefreshToken(refreshToken);
  }

  tokenService.clearRefreshTokenCookie(res);
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
