import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { TemplateData } from '../interface';

export const templateQueryKey = ['template'] as const;

/**
 * Service/connection templates and option lists (was getTemplates + the
 * templates reducer). Cached 5 minutes since templates rarely change.
 */
export function useTemplate() {
  return useQuery({
    queryKey: templateQueryKey,
    queryFn: () => api.get<TemplateData>('/template'),
    staleTime: 5 * 60 * 1000,
  });
}
