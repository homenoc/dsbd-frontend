import { useQuery } from '@tanstack/react-query';
import { DefaultTemplateData, type TemplateData } from '../interface';
import { api } from '../lib/api';

export const templateQueryKey = ['catalog'] as const;

export interface UseTemplateResult {
  data: TemplateData;
  error: unknown;
  isLoading: boolean;
}

/**
 * Admin template blob (NOC/routers/service+connection templates/option lists),
 * replacing the single Recoil TemplateState atom. `data` falls back to
 * DefaultTemplateData so consumers can read fields before the fetch resolves,
 * matching the atom's default.
 *
 * The explicit return type pins `data` to TemplateData regardless of how
 * @tanstack/react-query's generics resolve in this toolchain (see TECH-DEBT.md).
 */
export function useTemplate(): UseTemplateResult {
  const query = useQuery({
    queryKey: templateQueryKey,
    queryFn: () => api.get<TemplateData>('/catalog'),
    staleTime: 5 * 60 * 1000,
  });
  return {
    data: query.data ?? DefaultTemplateData,
    error: query.error,
    isLoading: query.isLoading,
  };
}
