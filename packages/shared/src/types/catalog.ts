// GET /catalog response types (service/connection type registry + config
// option lists). Shared verbatim by both apps. Naming keeps the legacy
// "Template" wording for now (rename to Catalog* is tracked in TECH-DEBT).

export interface ServiceTemplateData {
  name: string;
  comment: string;
  hidden: boolean;
  type: string;
  need_comment: boolean;
  need_global_as: boolean;
  need_jpnic: boolean;
  need_route: boolean;
  need_bgp: boolean;
}

export interface ConnectionTemplateData {
  name: string;
  type: string;
  comment: string;
  need_comment: boolean;
  need_cross_connect: boolean;
  need_internet: boolean;
  is_l2: boolean;
  is_l3: boolean;
}

export interface IXTemplateData {
  name: string;
  ipv4_address: string;
  ipv6_address: string;
}

export interface PaymentMembershipTemplate {
  title: string;
  plan: string;
  price_id: string;
  fee: string;
}

export interface MailTemplateData {
  id: string;
  title: string;
  message: string;
}

export interface MemberTypeTemplateData {
  id: string;
  name: string;
}

/** Superset of both apps' catalog reads; admin-only fields stay optional. */
export interface TemplateData {
  services?: ServiceTemplateData[];
  connections?: ConnectionTemplateData[];
  ipv4?: string[];
  ipv6?: string[];
  ntts?: string[];
  preferred_ap?: string[];
  ipv4_route?: string[];
  ipv6_route?: string[];
  mail_template?: MailTemplateData[];
  member_type?: MemberTypeTemplateData[];
  payment_membership?: PaymentMembershipTemplate[];
  ix?: IXTemplateData[];
}
