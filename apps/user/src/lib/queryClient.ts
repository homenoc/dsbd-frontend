import { QueryClient } from '@tanstack/react-query';

// Single client for the user app. Retries off (the API errors are meaningful,
// not transient) and no refetch-on-focus to match the previous manual flow.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
