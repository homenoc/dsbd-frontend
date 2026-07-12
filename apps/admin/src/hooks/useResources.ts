import { useQuery } from '@tanstack/react-query';
import type {
  BGPRouterDetailData,
  ConnectionDetailData,
  GroupDetailData,
  NocTemplateData,
  NoticeData,
  ServiceDetailData,
  TicketDetailData,
  TokenDetailData,
  TunnelEndPointRouterIPTemplateData,
  UserDetailData,
} from '../interface';
import { api } from '../lib/api';

// Per-resource queries that replace the entity dumps the old /template admin
// blob carried (nocs / bgp_router / tunnel_endpoint_router_ip / user / group).
// Each pins its return type explicitly because @tanstack/react-query's generics
// resolve to `any` in this toolchain (see TECH-DEBT.md), and falls back to [].

export function useNOCs(): { data: NocTemplateData[]; error: unknown } {
  const q = useQuery({
    queryKey: ['noc'],
    queryFn: () => api.get<{ noc: NocTemplateData[] }>('/noc'),
    staleTime: 5 * 60 * 1000,
  });
  return { data: q.data?.noc ?? [], error: q.error };
}

export function useBGPRouters(): { data: BGPRouterDetailData[]; error: unknown } {
  const q = useQuery({
    queryKey: ['router'],
    queryFn: () => api.get<{ bgp_router: BGPRouterDetailData[] }>('/router'),
    staleTime: 5 * 60 * 1000,
  });
  return { data: q.data?.bgp_router ?? [], error: q.error };
}

export function useGatewayIPs(): {
  data: TunnelEndPointRouterIPTemplateData[];
  error: unknown;
} {
  const q = useQuery({
    queryKey: ['gateway_ip'],
    queryFn: () =>
      api.get<{ gateway_endpoint_ip: TunnelEndPointRouterIPTemplateData[] }>('/gateway_ip'),
    staleTime: 5 * 60 * 1000,
  });
  return { data: q.data?.gateway_endpoint_ip ?? [], error: q.error };
}

export function useUsers(): { data: UserDetailData[]; error: unknown } {
  const q = useQuery({
    queryKey: ['user'],
    // NOTE: the admin API returns this list under "users" (plural) — unlike
    // /group,/noc,/router which use the singular resource name.
    queryFn: () => api.get<{ users: UserDetailData[] }>('/user'),
    staleTime: 60 * 1000,
  });
  return { data: q.data?.users ?? [], error: q.error };
}

export function useGroups(): { data: GroupDetailData[]; error: unknown } {
  const q = useQuery({
    queryKey: ['group'],
    queryFn: () => api.get<{ group: GroupDetailData[] }>('/group'),
    staleTime: 60 * 1000,
  });
  return { data: q.data?.group ?? [], error: q.error };
}

// Detail/list queries for the admin pages. Keys are resource-based and
// parameterized (['group', id], ['service', id], …) so a prefix invalidation
// on ['group'] refreshes both the list and every open detail page. Detail
// hooks intentionally return `T | undefined` (no fallback object): the detail
// pages gate rendering on `data !== undefined`, which prevents edit forms from
// mounting on empty data and PUT-ing it back (see GroupDetail/ServiceDetail).

export function useGroup(id: string | undefined): {
  data: GroupDetailData | undefined;
  error: unknown;
  isLoading: boolean;
} {
  const q = useQuery({
    queryKey: ['group', id],
    queryFn: () => api.get<{ group: GroupDetailData }>('/group/' + id),
    enabled: !!id,
  });
  return { data: q.data?.group, error: q.error, isLoading: q.isLoading };
}

export function useServices(): {
  data: ServiceDetailData[] | undefined;
  error: unknown;
  isLoading: boolean;
} {
  const q = useQuery({
    queryKey: ['service'],
    queryFn: () => api.get<{ service: ServiceDetailData[] }>('/service'),
  });
  return { data: q.data?.service, error: q.error, isLoading: q.isLoading };
}

export function useService(id: number | undefined): {
  data: ServiceDetailData | undefined;
  error: unknown;
  isLoading: boolean;
} {
  const q = useQuery({
    queryKey: ['service', id],
    queryFn: () => api.get<{ service: ServiceDetailData[] }>('/service/' + id),
    enabled: !!id,
  });
  return { data: q.data?.service?.[0], error: q.error, isLoading: q.isLoading };
}

export function useConnections(): {
  data: ConnectionDetailData[] | undefined;
  error: unknown;
  isLoading: boolean;
} {
  const q = useQuery({
    queryKey: ['connection'],
    queryFn: () => api.get<{ connection: ConnectionDetailData[] }>('/connection'),
  });
  return { data: q.data?.connection, error: q.error, isLoading: q.isLoading };
}

export function useConnection(id: number | undefined): {
  data: ConnectionDetailData | undefined;
  error: unknown;
  isLoading: boolean;
} {
  const q = useQuery({
    queryKey: ['connection', id],
    queryFn: () => api.get<{ connection: ConnectionDetailData[] }>('/connection/' + id),
    enabled: !!id,
  });
  return { data: q.data?.connection?.[0], error: q.error, isLoading: q.isLoading };
}

export function useSupportTickets(): {
  data: TicketDetailData[] | undefined;
  error: unknown;
  isLoading: boolean;
} {
  const q = useQuery({
    queryKey: ['support'],
    // NOTE: the admin API returns this list under "tickets" (plural).
    queryFn: () => api.get<{ tickets: TicketDetailData[] }>('/support'),
  });
  return { data: q.data?.tickets, error: q.error, isLoading: q.isLoading };
}

export function useSupportTicket(id: number | undefined): {
  data: TicketDetailData | undefined;
  error: unknown;
  isLoading: boolean;
} {
  const q = useQuery({
    queryKey: ['support', id],
    queryFn: () => api.get<{ ticket: TicketDetailData[] }>('/support/' + id),
    enabled: !!id,
  });
  return { data: q.data?.ticket?.[0], error: q.error, isLoading: q.isLoading };
}

export function useNotices(): {
  data: NoticeData[] | undefined;
  error: unknown;
  isLoading: boolean;
} {
  const q = useQuery({
    queryKey: ['notice'],
    queryFn: () => api.get<{ notice: NoticeData[] }>('/notice'),
  });
  return { data: q.data?.notice, error: q.error, isLoading: q.isLoading };
}

export function useNotice(id: number | undefined): {
  data: NoticeData | undefined;
  error: unknown;
  isLoading: boolean;
} {
  const q = useQuery({
    queryKey: ['notice', id],
    queryFn: () => api.get<{ notice: NoticeData[] }>('/notice/' + id),
    enabled: !!id,
  });
  return { data: q.data?.notice?.[0], error: q.error, isLoading: q.isLoading };
}

export function useTokens(): {
  data: TokenDetailData[] | undefined;
  error: unknown;
  isLoading: boolean;
} {
  const q = useQuery({
    queryKey: ['token'],
    queryFn: () => api.get<{ token: TokenDetailData[] }>('/token'),
  });
  return { data: q.data?.token, error: q.error, isLoading: q.isLoading };
}

export function useUser(id: string | undefined): {
  data: UserDetailData | undefined;
  error: unknown;
  isLoading: boolean;
} {
  const q = useQuery({
    queryKey: ['user', id],
    queryFn: () => api.get<{ users: UserDetailData[] }>('/user/' + id),
    enabled: !!id,
  });
  return { data: q.data?.users?.[0], error: q.error, isLoading: q.isLoading };
}
