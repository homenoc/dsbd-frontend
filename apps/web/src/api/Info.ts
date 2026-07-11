import { allInfoQueryKeys } from '../hooks/useInfo';
import { templateQueryKey } from '../hooks/useTemplate';
import { queryClient } from '../lib/queryClient';

// The info/template data now lives in TanStack Query (see hooks/useInfo,
// hooks/useTemplate). These helpers are kept as thin "refresh" triggers so the
// many dialog call sites (Get().then(), GetTemplate()) keep working: they
// invalidate the cached queries, which refetch through the hooks. Prefer
// invalidateQueries directly in new code.
//
// GET /info is decomposed into per-resource queries, so a generic refresh
// invalidates every resource key (a mutation may touch any of them).

export function Get(): Promise<void> {
  return Promise.all(
    allInfoQueryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
  ).then(() => undefined);
}

export function GetTemplate(): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: templateQueryKey });
}
