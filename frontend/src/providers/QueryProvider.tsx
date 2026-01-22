import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, useEffect, type ReactNode } from "react";
import type { AxiosError } from "axios";
import { setAccessToken } from "@/api/client";
import { setCachedUser } from "@/hooks/queries/useUser";
import { queryKeys } from "@/lib/queryKeys";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            gcTime: 1000 * 60 * 5,
            retry: (failureCount, error) => {
              const axiosError = error as AxiosError;
              if (
                axiosError?.response?.status === 401 ||
                axiosError?.response?.status === 403 ||
                axiosError?.response?.status === 404
              ) {
                return false;
              }
              return failureCount < 3;
            },
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setAccessToken(data.data.accessToken);
          setCachedUser(data.data.user);
          queryClient.setQueryData(queryKeys.auth.user, data.data.user);
        }
      } catch {
        // no valid session, user just stays logged out
      } finally {
        setIsReady(true);
      }
    };

    restoreSession();
  }, [queryClient]);

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
