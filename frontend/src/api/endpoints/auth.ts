import { apiClient } from "../client";
import type { ApiResponse, AuthResponse } from "../types";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (data: RegisterPayload) =>
    apiClient.post<ApiResponse<AuthResponse>>("/auth/register", data),

  login: (data: LoginPayload) =>
    apiClient.post<ApiResponse<AuthResponse>>("/auth/login", data),

  refresh: () => apiClient.post<ApiResponse<AuthResponse>>("/auth/refresh"),

  logout: () => apiClient.post<ApiResponse<null>>("/auth/logout"),
};
