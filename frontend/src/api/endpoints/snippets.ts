import { apiClient } from "../client";
import type { Technology, UseCase, SortBy, Snippet } from "@snippex/shared";
import type { ApiResponse, PaginatedResponse } from "../types";

export interface GetSnippetsParams {
  page?: number;
  limit?: number;
  search?: string;
  technology?: Technology;
  useCase?: UseCase;
  sortBy?: SortBy;
}

export interface CreateSnippetPayload {
  title: string;
  description: string;
  code: string;
  technology: Technology;
  useCase: UseCase;
  isPublic?: boolean;
}

export type UpdateSnippetPayload = Partial<CreateSnippetPayload>;

interface SnippetsResponse {
  snippets: Snippet[];
}

interface SnippetResponse {
  snippet: Snippet;
}

interface PaginatedSnippetsResponse extends ApiResponse<SnippetsResponse> {
  meta?: {
    pagination?: PaginatedResponse<Snippet>["pagination"];
  };
}

export const snippetsApi = {
  getAll: (params: GetSnippetsParams = {}) =>
    apiClient.get<PaginatedSnippetsResponse>("/snippets", { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<SnippetResponse>>(`/snippets/${id}`),

  getMySnippets: (params: { page?: number; limit?: number } = {}) =>
    apiClient.get<PaginatedSnippetsResponse>("/snippets/my-snippets", {
      params,
    }),

  create: (data: CreateSnippetPayload) =>
    apiClient.post<ApiResponse<SnippetResponse>>("/snippets", data),

  update: (id: string, data: UpdateSnippetPayload) =>
    apiClient.patch<ApiResponse<SnippetResponse>>(`/snippets/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/snippets/${id}`),
};
