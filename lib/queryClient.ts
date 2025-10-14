import { QueryClient } from "@tanstack/react-query";

export const makeQueryClient = () => {
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 1,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        retry: 1,
      },
    },
  });
};
