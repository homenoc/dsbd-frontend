import { infoQueryKey } from '../hooks/useInfo';
import { templateQueryKey } from '../hooks/useTemplate';
import { queryClient } from '../lib/queryClient';

// The info/template data lives in TanStack Query (see hooks/useInfo,
// hooks/useTemplate). These helpers are kept as thin "refresh" triggers so the
// many dialog call sites (Get().then(), GetTemplate()) keep working: they
// invalidate the cached query, which refetches through the hooks. Prefer
// invalidateQueries directly in new code.

export function Get(): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: infoQueryKey });
}

export function GetTemplate(): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: templateQueryKey });
}
