import { useQuery } from '@tanstack/react-query';
import type { InfoData } from '../interface';
import { api } from '../lib/api';

export const infoQueryKey = ['info'] as const;

export interface UseInfoResult {
  data: InfoData | undefined;
  error: unknown;
  isLoading: boolean;
}

/**
 * The user-facing bootstrap payload (GET /info): user, group, member list,
 * services, connections, notices, tickets, requests, and the derived network
 * summary — one GET-only query (owner decision: the user side is read-only,
 * so a single payload beats per-resource endpoints here).
 *
 * The explicit return type pins `data` to InfoData regardless of how
 * @tanstack/react-query's generics resolve in this toolchain (see TECH-DEBT.md).
 */
export function useInfo(): UseInfoResult {
  return useQuery({
    queryKey: infoQueryKey,
    queryFn: () => api.get<InfoData>('/info'),
  });
}
