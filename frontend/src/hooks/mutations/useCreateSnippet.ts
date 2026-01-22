import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  snippetsApi,
  type CreateSnippetPayload,
} from "@/api/endpoints/snippets";
import { queryKeys } from "@/lib/queryKeys";

export function useCreateSnippet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSnippetPayload) => snippetsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.snippets.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.snippets.mySnippets(),
      });
    },
  });
}
