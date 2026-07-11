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
 * User/group/service info (was renewInfos + the infos reducer). Components read
 * `data` with the `isLoading` guard instead of `state.infos[length-1].data`.
 *
 * The explicit return type pins `data` to InfoData for callers regardless of
 * how @tanstack/react-query's generics resolve in this toolchain.
 */
export function useInfo(): UseInfoResult {
  return useQuery({
    queryKey: infoQueryKey,
    queryFn: () => api.get<InfoData>('/info'),
  });
}
