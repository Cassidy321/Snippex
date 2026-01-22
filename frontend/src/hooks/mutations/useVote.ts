import { useMutation, useQueryClient } from "@tanstack/react-query";
import { votesApi } from "@/api/endpoints/votes";
import { queryKeys } from "@/lib/queryKeys";
import type { Snippet } from "@snippex/shared";
import type { Vote } from "@/api/types";

export function useVote(snippetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (type: "like" | "dislike") => votesApi.vote(snippetId, type),

    onMutate: async (newVoteType) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.snippets.detail(snippetId),
      });
      await queryClient.cancelQueries({
        queryKey: queryKeys.votes.snippet(snippetId),
      });

      const previousSnippet = queryClient.getQueryData<Snippet>(
        queryKeys.snippets.detail(snippetId),
      );
      const previousVote = queryClient.getQueryData<Vote | null>(
        queryKeys.votes.snippet(snippetId),
      );

      queryClient.setQueryData(queryKeys.votes.snippet(snippetId), {
        type: newVoteType,
        snippet: snippetId,
      });

      if (previousSnippet) {
        const oldVoteType = previousVote?.type;
        queryClient.setQueryData<Snippet>(
          queryKeys.snippets.detail(snippetId),
          {
            ...previousSnippet,
            likesCount:
              previousSnippet.likesCount +
              (newVoteType === "like" ? 1 : 0) -
              (oldVoteType === "like" ? 1 : 0),
            dislikesCount:
              previousSnippet.dislikesCount +
              (newVoteType === "dislike" ? 1 : 0) -
              (oldVoteType === "dislike" ? 1 : 0),
          },
        );
      }

      return { previousSnippet, previousVote };
    },

    onError: (_, __, context) => {
      if (context?.previousSnippet) {
        queryClient.setQueryData(
          queryKeys.snippets.detail(snippetId),
          context.previousSnippet,
        );
      }
      if (context?.previousVote !== undefined) {
        queryClient.setQueryData(
          queryKeys.votes.snippet(snippetId),
          context.previousVote,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.snippets.detail(snippetId),
      });
    },
  });
}

export function useRemoveVote(snippetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => votesApi.removeVote(snippetId),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.votes.snippet(snippetId),
      });

      const previousSnippet = queryClient.getQueryData<Snippet>(
        queryKeys.snippets.detail(snippetId),
      );
      const previousVote = queryClient.getQueryData<Vote | null>(
        queryKeys.votes.snippet(snippetId),
      );

      queryClient.setQueryData(queryKeys.votes.snippet(snippetId), null);

      if (previousSnippet && previousVote) {
        const oldVoteType = previousVote.type;
        queryClient.setQueryData<Snippet>(
          queryKeys.snippets.detail(snippetId),
          {
            ...previousSnippet,
            likesCount:
              previousSnippet.likesCount - (oldVoteType === "like" ? 1 : 0),
            dislikesCount:
              previousSnippet.dislikesCount -
              (oldVoteType === "dislike" ? 1 : 0),
          },
        );
      }

      return { previousSnippet, previousVote };
    },

    onError: (_, __, context) => {
      if (context?.previousSnippet) {
        queryClient.setQueryData(
          queryKeys.snippets.detail(snippetId),
          context.previousSnippet,
        );
      }
      if (context?.previousVote) {
        queryClient.setQueryData(
          queryKeys.votes.snippet(snippetId),
          context.previousVote,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.snippets.detail(snippetId),
      });
    },
  });
}
