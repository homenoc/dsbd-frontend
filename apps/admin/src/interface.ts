import type {
  BGPRouterDetailData,
  NocTemplateData,
  ServiceAddIPData,
  ServiceAddIPv4PlanData,
  ServiceTemplateData,
  TunnelEndPointRouterIPTemplateData,
  TunnelEndPointRouterTemplateData,
} from '@dsbd/shared';

// App-local name for the shared catalog blob type (TECH-DEBT #10): the admin
// app calls the /catalog payload "catalog", not "template". The shared package
// keeps its original TemplateData name.
export type {
  BGPRouterDetailData,
  ConnectionTemplateData,
  IXTemplateData,
  MailTemplateData,
  MemberTypeTemplateData,
  NocTemplateData,
  PaymentMembershipTemplate,
  ServiceAddIPData,
  ServiceAddIPv4PlanData,
  ServiceTemplateData,
  TemplateData as CatalogData,
  TunnelEndPointRouterIPTemplateData,
  TunnelEndPointRouterTemplateData,
} from '@dsbd/shared';
export { DefaultAddIP, DefaultServiceAddIPv4PlanData } from '@dsbd/shared';

export interface NoticeData {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  start_time: string;
  end_time: string | undefined;
  everyone: boolean;
  fault: boolean;
  important: boolean;
  info: boolean;
  title: string;
  data: string;
  group_id: number;
  noc_id: number;
  user_id: number;
}

export interface NoticeRegisterData {
  user_id: number[];
  group_id: number[];
  noc_id: number[];
  start_time: string;
  end_time?: string;
  title: string;
  body: string;
  everyone: boolean;
  important: boolean;
  fault: boolean;
  info: boolean;
}

export interface UserDetailData {
  CreatedAt: string;
  ID: number;
  UpdatedAt: string;
  email: string;
  expired_status: number;
  group?: GroupDetailData;
  group_id: number;
  level: number;
  mail_token: string;
  mail_verify: true;
  name: string;
  name_en: string;
  notice?: NoticeData[];
  pass: string;
  tokens?: TokenDetailData[];
  antisocial_check?: boolean | null; // null = 未同意, true = 同意済み
  antisocial_check_at?: string | null; // 反社チェック同意日時
}

export interface TokenDetailData {
  CreatedAt: string;
  ID: number;
  UpdatedAt: string;
  access_token: string;
  admin: boolean;
  debug: string;
  expired_at: string;
  status: number;
  tmp_token: string;
  user?: UserDetailData;
  user_id: number;
  user_token: string;
}

export interface TicketDetailData {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  solved: boolean;
  group_id: number;
  user_id: number;
  admin: boolean;
  title: string;
  request: boolean;
  request_reject: boolean;
  chat?: ChatData[];
  user?: UserDetailData;
  group?: GroupDetailData;
}

export interface ServiceDetailData {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  group_id: number;
  asn: number;
  fee: number;
  org: string;
  org_en: string;
  postcode: string;
  address: string;
  address_en: string;
  abuse: string;
  start_date: string;
  end_date?: string;
  avg_downstream: number;
  avg_upstream: number;
  max_downstream: number;
  max_upstream: number;
  max_bandwidth_as: string;
  service_type: string;
  service_number: number;
  service_comment: string;
  bgp_comment: string;
  comment: string;
  pass: boolean;
  enable: boolean;
  add_allow: boolean;
  ip?: IPData[];
  jpnic_admin?: JPNICData;
  jpnic_tech?: JPNICData[];
  connections?: ConnectionDetailData[];
}

export interface IPData {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  service_id: number;
  PlanJPNIC: string;
  start_date: string;
  end_date: string;
  user_case: string;
  ip: string;
  name: string;
  version: number;
  open: boolean;
  plan?: PlanData[];
}

export interface PlanData {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  name: string;
  ip: string;
  after: number;
  half_year: number;
  one_year: number;
}

export interface JPNICData {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  is_group: boolean;
  hidden: boolean;
  address: string;
  address_en: string;
  country: string;
  dept: string;
  dept_en: string;
  title: string;
  title_en: string;
  fax: string;
  v4_jpnic_handle: string;
  v6_jpnic_handle: string;
  mail: string;
  name: string;
  name_en: string;
  org: string;
  org_en: string;
  postcode: string;
  tel: string;
  lock: boolean;
}

export interface ConnectionDetailData {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  address: string;
  link_v4_our: string;
  link_v4_your: string;
  link_v6_our: string;
  link_v6_your: string;
  term_ip: string;
  rfc8950: boolean;
  enable: boolean;
  open: boolean;
  monitor: boolean;
  noc?: NocTemplateData;
  noc_id: number;
  preferred_ap: string;
  bgp_router_id: number;
  bgp_router?: BGPRouterDetailData;
  group?: GroupDetailData;
  service?: ServiceDetailData;
  connection_type: string;
  connection_number: number;
  connection_comment: string;
  comment: string;
  tunnel_endpoint_router_ip_id: number;
  ntt: string;
  ipv4_route: string;
  ipv6_route: string;
  tunnel_endpoint_router_ip?: TunnelEndPointRouterIPTemplateData;
  ix?: string;
  ix_peer_type?: string;
  ix_vlan_id?: string;
}

export interface GroupDetailData {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  memos?: MemoData[];
  expired_status: number;
  status: number;
  pass: boolean;
  add_allow: boolean;
  agree: boolean;
  question: string;
  org: string;
  org_en: string;
  postcode: string;
  address: string;
  address_en: string;
  tel: string;
  country: string;
  contract: string;
  coupon_id: string;
  member_type: number;
  member_expired: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  users?: UserDetailData[];
  tickets?: TicketDetailData[];
  services?: ServiceDetailData[];
}

export interface MemoData {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  group_id: number;
  type: number;
  title: string;
  message: string;
}

// Catalog payload (GET /catalog): type registry + config option lists. Entity
// lists (nocs/bgp_router/tunnel_endpoint_router_ip/user/group) are no longer
// here — fetched via per-resource queries (hooks/useResources).

export interface MemoAddData {
  group_id: number;
  type: number;
  title: string;
  message: string;
}

export interface TicketAddData {
  is_group: boolean;
  user_id: number;
  group_id: number;
  title: string;
  data: string;
}

export interface ServiceAddData {
  jpnic_admin?: ServiceAddJPNICData;
  jpnic_tech?: ServiceAddJPNICData[];
  service_type: string;
  service_comment: string;
  org?: string;
  org_en?: string;
  postcode?: string;
  address?: string;
  address_en?: string;
  route_v4?: string;
  route_v6?: string;
  avg_upstream: number;
  max_upstream: number;
  avg_downstream: number;
  max_downstream: number;
  max_bandwidth_as?: string;
  asn?: number;
  ip?: ServiceAddIPData[];
  start_date: string;
  end_date?: string;
}

export interface ServiceAddJPNICData {
  is_group: boolean;
  hidden: boolean;
  org: string;
  org_en: string;
  mail: string;
  postcode: string;
  address: string;
  address_en: string;
  name: string;
  name_en: string;
  dept: string;
  dept_en: string;
  title: string;
  title_en: string;
  country: string;
  tel: string;
  fax: string;
}

export interface ConnectionAddData {
  address: string;
  connection_type: string;
  connection_comment: string;
  ipv4_route?: string;
  ipv6_route?: string;
  ntt: string;
  noc_id: number;
  term_ip: string;
  monitor: boolean;
  rfc8950?: boolean;
  ix?: string;
  ix_peer_type?: string;
  ix_vlan_id?: string;
  link_v4_your?: string;
  link_v6_your?: string;
}

export interface ChatData {
  CreatedAt: string;
  ID: number;
  UpdatedAt: string;
  data: string;
  user_id: number;
  user?: UserDetailData;
  admin: boolean;
}

export interface MailSendData {
  to_mail: string;
  subject: string;
  content: string;
}

export interface JPNICRegistrationData {
  network: JPNICRegistrationNetworkData;
  admin_user: JPNICRegistrationUserData;
  tech_users: JPNICRegistrationUserData[];
  etc: JPNICRegistrationEtcData;
}

export interface JPNICReturnData {
  version: number;
  address: string[];
  network_name: string;
  return_date: string;
  notify_e_mail: string;
}

export interface JPNICSearchData {
  version: number;
  org: string;
}

export interface JPNICRegistrationNetworkData {
  kind_id: string;
  ip_address: string;
  network_name: string;
  infra_user_kind: string;
  org_jp_1: string;
  org_jp_2: string;
  org_jp_3: string;
  org_1: string;
  org_2: string;
  org_3: string;
  zip_code: string;
  addr_jp_1: string;
  addr_jp_2: string;
  addr_jp_3: string;
  addr_1: string;
  addr_2: string;
  addr_3: string;
  abuse: string;
  ryakusho: string;
  name_server: string;
  notify_email: string;
  plan: string;
  deli_no: string;
  return_date: string;
}

export interface JPNICRegistrationUserData {
  jpnic_handle: string;
  name_jp: string;
  name: string;
  email: string;
  org_jp_1: string;
  org_jp_2: string;
  org_jp_3: string;
  org_1: string;
  org_2: string;
  org_3: string;
  zip_code: string;
  addr_jp_1: string;
  addr_jp_2: string;
  addr_jp_3: string;
  addr_1: string;
  addr_2: string;
  addr_3: string;
  division_jp: string;
  division: string;
  phone: string;
  fax: string;
  notify_mail: string;
}

export interface JPNICRegistrationEtcData {
  cert_id: string;
  password: string;
}

export interface JPNICGetData {
  ip_address: string;
  detail_link: string;
  size: string;
  network_name: string;
  assign_date: string;
  return_date: string;
  org_name: string;
  ryakusho: string;
  recep_no: string;
  deli_no: string;
  type: string;
  kind_id: string;
}

export interface JPNICGetDetailData {
  ip_address: string;
  ryakusho: string;
  type: string;
  infra_user_kind: string;
  network_name: string;
  org: string;
  org_en: string;
  post_code: string;
  address: string;
  address_en: string;
  admin_jpnic_handle: string;
  admin_jpnic_handle_link: string;
  tech_jpnic_handle: string;
  tech_jpnic_handle_link: string;
  name_server: string;
  ds_record: string;
  notify_address: string;
  deli_no: string;
  recep_no: string;
  assign_date: string;
  return_date: string;
  update_date: string;
}

export interface JPNICGetHandleData {
  is_jpnic_handle: boolean;
  jpnic_handle: string;
  name: string;
  name_en: string;
  email: string;
  org: string;
  org_en: string;
  division: string;
  division_en: string;
  title: string;
  title_en: string;
  tel: string;
  fax: string;
  notify_address: string;
  update_date: string;
}

export const DefaultServiceJPNICData: JPNICData = {
  ID: 0,
  CreatedAt: '',
  UpdatedAt: '',
  DeletedAt: '',
  is_group: false,
  hidden: false,
  address: '',
  address_en: '',
  country: '',
  dept: '',
  dept_en: '',
  title: '',
  title_en: '',
  fax: '',
  v4_jpnic_handle: '',
  v6_jpnic_handle: '',
  mail: '',
  name: '',
  name_en: '',
  org: '',
  org_en: '',
  postcode: '',
  tel: '',
  lock: false,
};

export const DefaultChatData: ChatData = {
  CreatedAt: '',
  ID: 0,
  UpdatedAt: '',
  data: '',
  user_id: 0,
  admin: false,
};

export const DefaultChatDataArray: ChatData[] = [DefaultChatData];

export const DefaultNoticeData: NoticeData = {
  CreatedAt: '',
  ID: 0,
  UpdatedAt: '',
  data: '',
  end_time: '',
  everyone: false,
  fault: false,
  group_id: 0,
  important: false,
  info: false,
  noc_id: 0,
  start_time: '',
  title: '',
  user_id: 0,
};

export const DefaultNoticeRegisterData: NoticeRegisterData = {
  user_id: [],
  group_id: [],
  noc_id: [],
  start_time: '',
  end_time: undefined,
  title: '',
  body: '',
  everyone: false,
  important: false,
  fault: false,
  info: false,
};

export const DefaultMemoAddData: MemoAddData = {
  group_id: 0,
  type: 0,
  title: '',
  message: '',
};

export const DefaultTicketAddData: TicketAddData = {
  is_group: true,
  user_id: 0,
  group_id: 0,
  title: '',
  data: '',
};

export const DefaultMailSendData: MailSendData = {
  to_mail: '',
  subject: '',
  content: '',
};

export const DefaultJPNICRegistrationData: JPNICRegistrationData = {
  network: {
    kind_id: '10',
    ip_address: '',
    network_name: '',
    infra_user_kind: '2',
    org_jp_1: '',
    org_jp_2: '',
    org_jp_3: '',
    org_1: '',
    org_2: '',
    org_3: '',
    zip_code: '',
    addr_jp_1: '',
    addr_jp_2: '',
    addr_jp_3: '',
    addr_1: '',
    addr_2: '',
    addr_3: '',
    abuse: '',
    ryakusho: '',
    name_server: '',
    notify_email: '',
    plan: '',
    deli_no: '',
    return_date: '',
  },
  admin_user: {
    jpnic_handle: '',
    name_jp: '',
    name: '',
    email: '',
    org_jp_1: '',
    org_jp_2: '',
    org_jp_3: '',
    org_1: '',
    org_2: '',
    org_3: '',
    zip_code: '',
    addr_jp_1: '',
    addr_jp_2: '',
    addr_jp_3: '',
    addr_1: '',
    addr_2: '',
    addr_3: '',
    division_jp: '',
    division: '',
    phone: '',
    fax: '',
    notify_mail: '',
  },
  tech_users: [
    {
      jpnic_handle: '',
      name_jp: '',
      name: '',
      email: '',
      org_jp_1: '',
      org_jp_2: '',
      org_jp_3: '',
      org_1: '',
      org_2: '',
      org_3: '',
      zip_code: '',
      addr_jp_1: '',
      addr_jp_2: '',
      addr_jp_3: '',
      addr_1: '',
      addr_2: '',
      addr_3: '',
      division_jp: '',
      division: '',
      phone: '',
      fax: '',
      notify_mail: '',
    },
    {
      jpnic_handle: '',
      name_jp: '',
      name: '',
      email: '',
      org_jp_1: '',
      org_jp_2: '',
      org_jp_3: '',
      org_1: '',
      org_2: '',
      org_3: '',
      zip_code: '',
      addr_jp_1: '',
      addr_jp_2: '',
      addr_jp_3: '',
      addr_1: '',
      addr_2: '',
      addr_3: '',
      division_jp: '',
      division: '',
      phone: '',
      fax: '',
      notify_mail: '',
    },
  ],
  etc: {
    cert_id: '',
    password: '',
  },
};

export const DefaultJPNICUserRegistrationData: JPNICRegistrationUserData = {
  jpnic_handle: '',
  name_jp: '',
  name: '',
  email: '',
  org_jp_1: '',
  org_jp_2: '',
  org_jp_3: '',
  org_1: '',
  org_2: '',
  org_3: '',
  zip_code: '',
  addr_jp_1: '',
  addr_jp_2: '',
  addr_jp_3: '',
  addr_1: '',
  addr_2: '',
  addr_3: '',
  division_jp: '',
  division: '',
  phone: '',
  fax: '',
  notify_mail: '',
};

export const DefaultJPNICReturnData: JPNICReturnData = {
  version: 0,
  address: [],
  network_name: '',
  return_date: '',
  notify_e_mail: '',
};
