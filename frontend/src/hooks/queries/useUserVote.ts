import { useQuery } from "@tanstack/react-query";
import { votesApi } from "@/api/endpoints/votes";
import { queryKeys } from "@/lib/queryKeys";
import { useIsAuthenticated } from "./useUser";

export function useUserVote(snippetId: string | undefined) {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: queryKeys.votes.snippet(snippetId!),
    queryFn: async () => {
      const { data } = await votesApi.getUserVote(snippetId!);
      return data.data.vote;
    },
    enabled: !!snippetId && isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
}
