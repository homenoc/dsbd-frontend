// NOC / BGP router / tunnel endpoint entity shapes as served by the admin API
// (/noc, /router, /gateway, /gateway_ip). The cluster is mutually referential.

export interface NocTemplateData {
  CreatedAt: string;
  DeletedAt: string;
  ID: number;
  UpdatedAt: string;
  name: string;
  bandwidth: string;
  bgp_router?: BGPRouterDetailData;
  comment: string;
  enable: boolean;
  location: string;
}

export interface BGPRouterDetailData {
  CreatedAt: string;
  DeletedAt: string;
  ID: number;
  UpdatedAt: string;
  address: string;
  comment: string;
  enable: boolean;
  hostname: string;
  noc: NocTemplateData;
  noc_id: number;
  tunnel_endpoint_router: null;
}

export interface TunnelEndPointRouterTemplateData {
  CreatedAt: string;
  DeletedAt: string;
  ID: number;
  UpdatedAt: string;
  capacity: number;
  comment: string;
  enable: boolean;
  hostname: string;
  noc_id: number;
  tunnel_endpoint_router_ip: TunnelEndPointRouterIPTemplateData[];
}

export interface TunnelEndPointRouterIPTemplateData {
  CreatedAt: string;
  DeletedAt: string;
  ID: number;
  UpdatedAt: string;
  ip: string;
  enable: boolean;
  tunnel_endpoint_router: TunnelEndPointRouterTemplateData;
}
