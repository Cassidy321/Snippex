import type { Technology, UseCase, SortBy } from "@snippex/shared";

export interface SnippetFilters {
  page?: number;
  limit?: number;
  search?: string;
  technology?: Technology;
  useCase?: UseCase;
  sortBy?: SortBy;
}

export const queryKeys = {
  snippets: {
    all: ["snippets"] as const,
    lists: () => [...queryKeys.snippets.all, "list"] as const,
    list: (filters: SnippetFilters) =>
      [...queryKeys.snippets.lists(), filters] as const,
    details: () => [...queryKeys.snippets.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.snippets.details(), id] as const,
    mySnippets: (page?: number) =>
      [...queryKeys.snippets.all, "my", { page }] as const,
  },

  votes: {
    all: ["votes"] as const,
    snippet: (snippetId: string) =>
      [...queryKeys.votes.all, snippetId] as const,
  },

  auth: {
    user: ["auth", "user"] as const,
  },
};
