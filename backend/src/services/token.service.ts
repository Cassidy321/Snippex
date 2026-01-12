import jwt, { JwtPayload } from "jsonwebtoken";
import { Response } from "express";
import { env } from "@/config";
import { ApiError } from "@/utils";
import { RefreshToken } from "@/models";

export interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
}

export interface RefreshTokenPayload extends JwtPayload {
  id: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "30d";
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

export const generateAccessToken = (userId: string, email: string): string => {
  return jwt.sign({ id: userId, email }, env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const generateTokens = (userId: string, email: string): Tokens => {
  return {
    accessToken: generateAccessToken(userId, email),
    refreshToken: generateRefreshToken(userId),
  };
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch {
    throw new ApiError(401, "Invalid access token");
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }
};

export const saveRefreshToken = async (token: string, userId: string): Promise<void> => {
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE);
  await RefreshToken.create({ token, user: userId, expiresAt });
};

export const findRefreshToken = async (token: string): Promise<boolean> => {
  const exists = await RefreshToken.exists({ token });
  return !!exists;
};

export const revokeRefreshToken = async (token: string): Promise<void> => {
  await RefreshToken.deleteOne({ token });
};

export const revokeAllUserTokens = async (userId: string): Promise<void> => {
  await RefreshToken.deleteMany({ user: userId });
};

export const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie("refreshToken");
};
