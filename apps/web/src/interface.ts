import type {
  ServiceAddIPData,
  ServiceAddIPv4PlanData,
  ServiceTemplateData,
  TemplateData,
} from '@dsbd/shared';

export type {
  ConnectionTemplateData,
  IXTemplateData,
  PaymentMembershipTemplate,
  ServiceAddIPData,
  ServiceAddIPv4PlanData,
  ServiceTemplateData,
  TemplateData,
} from '@dsbd/shared';
export { DefaultAddIP, DefaultServiceAddIPv4PlanData } from '@dsbd/shared';

export interface InfoData {
  user?: UserData;
  group?: GroupData;
  user_list?: UserData[];
  service?: ServiceData[];
  connection?: ConnectionData[];
  info?: InfosData[];
  notice?: NoticeData[];
  ticket?: TicketData[];
  request?: TicketData[];
}

export interface UserData {
  id: number;
  group_id: number;
  stripe_customer_id: string;
  name: string;
  name_en: string;
  email: string;
  status: number;
  level: number;
  mail_verify: boolean;
  antisocial_check: boolean | null;
}

export interface GroupData {
  id: number;
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
  member_type_id: number;
  member_type: string;
  member_expired: string;
  is_expired: boolean;
  is_stripe_id: boolean;
  fee: number;
  expired_status: number;
  status: number;
  pass: boolean;
  add_allow: boolean;
}

export interface ServiceData {
  id: number;
  service_id: string;
  service_type: string;
  need_route: boolean;
  need_jpnic: boolean;
  add_allow: boolean;
  pass: boolean;
  org: string;
  org_en: string;
  postcode: string;
  address: string;
  address_en: string;
  asn: number;
  avg_upstream: number;
  max_upstream: number;
  avg_downstream: number;
  max_downstream: number;
  max_bandwidth_as: string;
  start_date: string;
  end_date?: string;
  ip?: IP[];
  jpnic_admin?: JPNICData;
  jpnic_tech?: JPNICData[];
}

export interface JPNICData {
  id: number;
  jpnic_handle: string;
  name: string;
  name_en: string;
  mail: string;
  org: string;
  org_en: string;
  postcode: string;
  address: string;
  address_en: string;
  dept: string;
  dept_en: string;
  tel: string;
  fax: string;
  country: string;
}

export interface IP {
  id: number;
  version: number;
  name: string;
  ip: string;
  plan: Plan[];
  start_date: string;
  end_date: string;
  use_case: string;
  open: boolean;
}

export interface Plan {
  id: number;
  ip_id: number;
  name: string;
  after: number;
  half_year: number;
  one_year: number;
}

export interface ConnectionData {
  id: number;
  service_id: string;
  open: boolean;
}

export interface NoticeData {
  start_time: string;
  end_time: string;
  everyone: boolean;
  fault: boolean;
  important: boolean;
  info: boolean;
  title: string;
  data: string;
}

export interface TicketData {
  id: number;
  created_at: string;
  group_id: number;
  user_id: number;
  title: string;
  chat?: ChatData[];
  solved: boolean;
  reject: boolean;
  admin: boolean;
}

export interface ChatData {
  created_at: string;
  ticket_id: number;
  user_id: number;
  user_name: string;
  admin: boolean;
  data: string;
}

export interface InfosData {
  service_id: string;
  service: string;
  assign: boolean;
  asn: number;
  v4?: string[];
  v6?: string[];
  noc: string;
  noc_ip: string;
  term_ip: string;
  rfc8950?: boolean;
  link_v4_our: string;
  link_v4_your: string;
  link_v6_our: string;
  link_v6_your: string;
  fee: string;
  org: string;
  org_en: string;
  postcode: string;
  address: string;
  address_en: string;
  jpnic_admin?: JPNICData;
  jpnic_tech?: JPNICData[];
  avg_downstream: number;
  avg_upstream: number;
  max_downstream: number;
  max_upstream: number;
  max_bandwidth_as: string;
  bgp_route_v4: string;
  bgp_route_v6: string;
}

export interface IPTemplateData {
  name: any;
  CreatedAt: string;
  DeletedAt: string;
  ID: number;
  UpdatedAt: string;
  comment: string;
  hide: boolean;
  quantity: number;
  subnet: string;
  title: string;
}

export interface IPRouteData {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  name: string;
}

export interface GroupAddData {
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
  student: boolean;
  student_expired: string;
}

export interface ServiceAddJPNICData {
  org: string;
  org_en: string;
  mail: string;
  postcode: string;
  address: string;
  address_en: string;
  name: string;
  name_en: string;
  dept_en: string;
  dept: string;
  country: string;
  tel: string;
  fax: string;
}

export interface SupportAddData {
  is_group: boolean;
  title: string;
  data: string;
}

export interface UserAddData {
  name: string;
  name_en: string;
  email: string;
  pass: string;
  level: number;
}

export const DefaultGroupAddData: GroupAddData = {
  agree: false,
  question: '',
  org: '',
  org_en: '',
  postcode: '',
  address: '',
  address_en: '',
  tel: '',
  country: '',
  contract: 'E-Mail',
  student: false,
  student_expired: '',
};

export const DefaultServiceAddJPNICData: ServiceAddJPNICData = {
  org: '',
  org_en: '',
  mail: '',
  postcode: '',
  address: '',
  address_en: '',
  name: '',
  name_en: '',
  dept_en: '',
  dept: '',
  country: '',
  tel: '',
  fax: '',
};

export const DefaultSupportAddData: SupportAddData = {
  is_group: true,
  title: '',
  data: '',
};

export const DefaultUserAddData: UserAddData = {
  name: '',
  name_en: '',
  email: '',
  pass: '',
  level: 2,
};
