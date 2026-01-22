import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getAccessToken } from "@/api/client";
import type { User } from "@/api/types";

let cachedUser: User | null = null;

export const setCachedUser = (user: User | null) => {
  cachedUser = user;
};

export const getCachedUser = () => cachedUser;

export function useUser() {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: () => cachedUser,
    enabled: !!getAccessToken(),
    staleTime: Infinity,
  });
}

export function useIsAuthenticated() {
  const { data: user } = useUser();
  return !!user;
}
