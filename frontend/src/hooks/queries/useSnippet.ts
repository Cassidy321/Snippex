import { useQuery } from "@tanstack/react-query";
import { snippetsApi } from "@/api/endpoints/snippets";
import { queryKeys } from "@/lib/queryKeys";

export function useSnippet(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.snippets.detail(id!),
    queryFn: async () => {
      const { data } = await snippetsApi.getById(id!);
      return data.data.snippet;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
