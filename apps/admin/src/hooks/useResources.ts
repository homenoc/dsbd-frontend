import { useQuery } from '@tanstack/react-query';
import type {
  BGPRouterDetailData,
  GroupDetailData,
  NocTemplateData,
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
