import { useQuery } from '@tanstack/react-query';
import type { TemplateData } from '../interface';
import { api } from '../lib/api';

export const templateQueryKey = ['catalog'] as const;

export interface UseTemplateResult {
  data: TemplateData;
  error: unknown;
  isLoading: boolean;
}

/**
 * Service/connection templates and option lists (was getTemplates + the
 * templates reducer). Cached 5 minutes since templates rarely change.
 * `data` falls back to an empty object (every TemplateData field is optional)
 * so consumers can read fields before the fetch resolves.
 *
 * The explicit return type pins `data` to TemplateData for callers regardless
 * of how @tanstack/react-query's generics resolve in this toolchain.
 */
export function useTemplate(): UseTemplateResult {
  const query = useQuery({
    queryKey: templateQueryKey,
    queryFn: () => api.get<TemplateData>('/catalog'),
    staleTime: 5 * 60 * 1000,
  });
  return {
    data: query.data ?? {},
    error: query.error,
    isLoading: query.isLoading,
  };
}
