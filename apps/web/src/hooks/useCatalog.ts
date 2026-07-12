import { useQuery } from '@tanstack/react-query';
import type { CatalogData } from '../interface';
import { api } from '../lib/api';

export const catalogQueryKey = ['catalog'] as const;

export interface UseCatalogResult {
  data: CatalogData;
  error: unknown;
  isLoading: boolean;
}

/**
 * Service/connection catalog and option lists (was getTemplates + the
 * templates reducer). Cached 5 minutes since the catalog rarely changes.
 * `data` falls back to an empty object (every CatalogData field is optional)
 * so consumers can read fields before the fetch resolves.
 *
 * The explicit return type pins `data` to CatalogData for callers regardless
 * of how @tanstack/react-query's generics resolve in this toolchain.
 */
export function useCatalog(): UseCatalogResult {
  const query = useQuery({
    queryKey: catalogQueryKey,
    queryFn: () => api.get<CatalogData>('/catalog'),
    staleTime: 5 * 60 * 1000,
  });
  return {
    data: query.data ?? {},
    error: query.error,
    isLoading: query.isLoading,
  };
}
