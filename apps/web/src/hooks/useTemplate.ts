import { useQuery } from '@tanstack/react-query';
import type { TemplateData } from '../interface';
import { api } from '../lib/api';

export const templateQueryKey = ['template'] as const;

export interface UseTemplateResult {
  data: TemplateData | undefined;
  error: unknown;
  isLoading: boolean;
}

/**
 * Service/connection templates and option lists (was getTemplates + the
 * templates reducer). Cached 5 minutes since templates rarely change.
 *
 * The explicit return type pins `data` to TemplateData for callers regardless
 * of how @tanstack/react-query's generics resolve in this toolchain.
 */
export function useTemplate(): UseTemplateResult {
  return useQuery({
    queryKey: templateQueryKey,
    queryFn: () => api.get<TemplateData>('/template'),
    staleTime: 5 * 60 * 1000,
  });
}
