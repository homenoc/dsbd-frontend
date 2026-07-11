import { QueryClient } from '@tanstack/react-query';

// Single client for the admin app. Retries off and no refetch-on-focus to
// match the previous manual (Recoil) flow.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
