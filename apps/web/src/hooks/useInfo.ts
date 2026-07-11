import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { InfoData } from '../interface';

export const infoQueryKey = ['info'] as const;

/**
 * User/group/service info (was renewInfos + the infos reducer). Components read
 * `data` with the `isLoading` guard instead of `state.infos[length-1].data`.
 */
export function useInfo() {
  return useQuery({
    queryKey: infoQueryKey,
    queryFn: () => api.get<InfoData>('/info'),
  });
}
