import type { Snippet, PaginatedResponse } from "@snippex/shared";

export type { Snippet, PaginatedResponse };

export interface User {
  _id: string;
  username: string;
  email: string;
  profile?: {
    avatarUrl?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    pagination?: PaginatedResponse<unknown>["pagination"];
  };
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Vote {
  _id: string;
  user: string;
  snippet: string;
  type: "like" | "dislike";
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
