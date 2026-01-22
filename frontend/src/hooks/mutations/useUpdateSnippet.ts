import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  snippetsApi,
  type UpdateSnippetPayload,
} from "@/api/endpoints/snippets";
import { queryKeys } from "@/lib/queryKeys";

export function useUpdateSnippet(snippetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSnippetPayload) =>
      snippetsApi.update(snippetId, data),
    onSuccess: (response) => {
      const updatedSnippet = response.data.data.snippet;
      queryClient.setQueryData(
        queryKeys.snippets.detail(snippetId),
        updatedSnippet,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.snippets.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.snippets.mySnippets(),
      });
    },
  });
}
