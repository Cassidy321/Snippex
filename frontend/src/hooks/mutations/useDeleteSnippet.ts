import { useMutation, useQueryClient } from "@tanstack/react-query";
import { snippetsApi } from "@/api/endpoints/snippets";
import { queryKeys } from "@/lib/queryKeys";

export function useDeleteSnippet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (snippetId: string) => snippetsApi.delete(snippetId),
    onSuccess: (_, snippetId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.snippets.detail(snippetId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.snippets.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.snippets.mySnippets(),
      });
    },
  });
}
