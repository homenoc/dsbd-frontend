import { type QueryClient, useQuery } from '@tanstack/react-query';
import type {
  ConnectionData,
  GroupData,
  InfosData,
  NoticeData,
  ServiceData,
  TicketData,
  UserData,
} from '../interface';
import { api } from '../lib/api';

// The user-facing read surface used to be a single GET /info bootstrap blob,
// mirrored here as one useInfo() hook. The backend now exposes one endpoint per
// resource, so this file exposes one hook per resource and each page fetches
// only the slices it renders (parallel + independently cached) instead of the
// whole blob.
//
// Every hook pins an explicit return type because @tanstack/react-query's
// generics resolve to `any` in this toolchain (see TECH-DEBT.md), and falls
// back to empty values so callers can read before the fetch resolves.

export const meQueryKey = ['me'] as const;
export const groupQueryKey = ['group'] as const;
export const servicesQueryKey = ['service'] as const;
export const connectionsQueryKey = ['connection'] as const;
export const noticesQueryKey = ['notice'] as const;
export const ticketsQueryKey = ['ticket'] as const;
export const requestsQueryKey = ['request'] as const;
export const infoSummaryQueryKey = ['info'] as const;

// Every resource key, for blanket invalidation after a mutation (see api/Info).
export const allInfoQueryKeys = [
  meQueryKey,
  groupQueryKey,
  servicesQueryKey,
  connectionsQueryKey,
  noticesQueryKey,
  ticketsQueryKey,
  requestsQueryKey,
  infoSummaryQueryKey,
] as const;

// Invalidate every per-resource query. This is the behavior-preserving
// equivalent of the old "refetch the whole /info blob" — a mutation used to
// refresh everything, so reload buttons and post-mutation refreshes call this.
// New code can invalidate just the affected resource key(s) instead.
export function invalidateAllInfo(queryClient: QueryClient): Promise<void> {
  return Promise.all(
    allInfoQueryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
  ).then(() => undefined);
}

const staleTime = 60 * 1000;

export function useMe(): { data: UserData | undefined; error: unknown; isLoading: boolean } {
  const q = useQuery({
    queryKey: meQueryKey,
    queryFn: () => api.get<{ user: UserData }>('/user/me'),
    staleTime,
  });
  return { data: q.data?.user, error: q.error, isLoading: q.isLoading };
}

export function useGroup(): {
  data: GroupData | undefined;
  userList: UserData[];
  error: unknown;
  isLoading: boolean;
} {
  const q = useQuery({
    queryKey: groupQueryKey,
    queryFn: () => api.get<{ group: GroupData; user_list: UserData[] }>('/group'),
    staleTime,
  });
  return {
    data: q.data?.group,
    userList: q.data?.user_list ?? [],
    error: q.error,
    isLoading: q.isLoading,
  };
}

export function useServices(): { data: ServiceData[]; error: unknown; isLoading: boolean } {
  const q = useQuery({
    queryKey: servicesQueryKey,
    queryFn: () => api.get<{ service: ServiceData[] }>('/service'),
    staleTime,
  });
  return { data: q.data?.service ?? [], error: q.error, isLoading: q.isLoading };
}

export function useConnections(): { data: ConnectionData[]; error: unknown; isLoading: boolean } {
  const q = useQuery({
    queryKey: connectionsQueryKey,
    queryFn: () => api.get<{ connection: ConnectionData[] }>('/connection'),
    staleTime,
  });
  return { data: q.data?.connection ?? [], error: q.error, isLoading: q.isLoading };
}

export function useNotices(): { data: NoticeData[]; error: unknown; isLoading: boolean } {
  const q = useQuery({
    queryKey: noticesQueryKey,
    queryFn: () => api.get<{ notice: NoticeData[] }>('/notice'),
    staleTime,
  });
  return { data: q.data?.notice ?? [], error: q.error, isLoading: q.isLoading };
}

export function useTickets(): { data: TicketData[]; error: unknown; isLoading: boolean } {
  const q = useQuery({
    queryKey: ticketsQueryKey,
    queryFn: () => api.get<{ ticket: TicketData[] }>('/ticket'),
    staleTime,
  });
  return { data: q.data?.ticket ?? [], error: q.error, isLoading: q.isLoading };
}

export function useRequests(): { data: TicketData[]; error: unknown; isLoading: boolean } {
  const q = useQuery({
    queryKey: requestsQueryKey,
    queryFn: () => api.get<{ request: TicketData[] }>('/request'),
    staleTime,
  });
  return { data: q.data?.request ?? [], error: q.error, isLoading: q.isLoading };
}

// The derived active-connection network summary (GET /info).
export function useInfoSummary(): { data: InfosData[]; error: unknown; isLoading: boolean } {
  const q = useQuery({
    queryKey: infoSummaryQueryKey,
    queryFn: () => api.get<{ info: InfosData[] }>('/info'),
    staleTime,
  });
  return { data: q.data?.info ?? [], error: q.error, isLoading: q.isLoading };
}
