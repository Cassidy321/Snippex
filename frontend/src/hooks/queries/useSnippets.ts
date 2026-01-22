import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { snippetsApi, type GetSnippetsParams } from "@/api/endpoints/snippets";
import { queryKeys } from "@/lib/queryKeys";

interface UseSnippetsOptions extends GetSnippetsParams {
  enabled?: boolean;
}

export function useSnippets(options: UseSnippetsOptions = {}) {
  const { enabled = true, ...filters } = options;

  return useQuery({
    queryKey: queryKeys.snippets.list(filters),
    queryFn: async () => {
      const { data } = await snippetsApi.getAll(filters);
      return {
        snippets: data.data.snippets,
        pagination: data.meta?.pagination,
      };
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60, // 1 minute
    enabled,
  });
}
