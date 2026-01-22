import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { snippetsApi } from "@/api/endpoints/snippets";
import { queryKeys } from "@/lib/queryKeys";
import { useIsAuthenticated } from "./useUser";

export function useMySnippets(page = 1, limit = 20) {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: queryKeys.snippets.mySnippets(page),
    queryFn: async () => {
      const { data } = await snippetsApi.getMySnippets({ page, limit });
      return {
        snippets: data.data.snippets,
        pagination: data.meta?.pagination,
      };
    },
    placeholderData: keepPreviousData,
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
  });
}
