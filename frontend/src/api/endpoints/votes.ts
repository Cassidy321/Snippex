import { apiClient } from "../client";
import type { ApiResponse, Vote } from "../types";

interface VoteResponse {
  vote: Vote;
}

interface UserVoteResponse {
  vote: Vote | null;
}

export const votesApi = {
  vote: (snippetId: string, type: "like" | "dislike") =>
    apiClient.post<ApiResponse<VoteResponse>>(`/snippets/${snippetId}/vote`, {
      type,
    }),

  removeVote: (snippetId: string) =>
    apiClient.delete<ApiResponse<null>>(`/snippets/${snippetId}/vote`),

  getUserVote: (snippetId: string) =>
    apiClient.get<ApiResponse<UserVoteResponse>>(`/snippets/${snippetId}/vote`),
};
