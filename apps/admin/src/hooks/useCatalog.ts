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
 * Admin catalog blob (NOC/routers/service+connection templates/option lists),
 * replacing the single Recoil TemplateState atom. `data` falls back to an
 * empty object (every CatalogData field is optional) so consumers can read
 * fields before the fetch resolves, matching the atom's default.
 *
 * The explicit return type pins `data` to CatalogData regardless of how
 * @tanstack/react-query's generics resolve in this toolchain (see TECH-DEBT.md).
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
