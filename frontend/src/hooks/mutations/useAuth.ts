import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authApi,
  type LoginPayload,
  type RegisterPayload,
} from "@/api/endpoints/auth";
import { setAccessToken, clearAccessToken } from "@/api/client";
import { setCachedUser } from "@/hooks/queries/useUser";
import { queryKeys } from "@/lib/queryKeys";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
    onSuccess: (response) => {
      const { accessToken, user } = response.data.data;
      setAccessToken(accessToken);
      setCachedUser(user);
      queryClient.setQueryData(queryKeys.auth.user, user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterPayload) => authApi.register(data),
    onSuccess: (response) => {
      const { accessToken, user } = response.data.data;
      setAccessToken(accessToken);
      setCachedUser(user);
      queryClient.setQueryData(queryKeys.auth.user, user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAccessToken();
      setCachedUser(null);
      queryClient.setQueryData(queryKeys.auth.user, null);
      queryClient.removeQueries({ queryKey: queryKeys.snippets.mySnippets() });
      queryClient.removeQueries({ queryKey: queryKeys.votes.all });
    },
  });
}
