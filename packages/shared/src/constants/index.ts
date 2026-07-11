// Mirrors dsbd-backend pkg/api/core enums/constants. The numeric/string values
// are FROZEN wire/DB values — change labels here freely, never the codes.

/** User.Level — lower value = more privilege within a group (core/enums.go). */
export const UserLevel = {
  Master: 1,
  Member: 2,
  Viewer: 3,
  StatusOnly: 4,
} as const;
export type UserLevel = (typeof UserLevel)[keyof typeof UserLevel];

/** Mirrors core.CanManageServices: may create/modify services & connections. */
export function canManageServices(level: number): boolean {
  return level <= UserLevel.Member;
}

/** User/Group.ExpiredStatus (core/enums.go). 0 = active. */
export const ExpiredStatus = {
  None: 0,
  ByMaster: 1,
  ByCommittee: 2,
  ReviewFailed: 3,
} as const;
export type ExpiredStatus = (typeof ExpiredStatus)[keyof typeof ExpiredStatus];

export function isActive(expiredStatus: number | undefined): boolean {
  return expiredStatus === ExpiredStatus.None;
}

/** Group.MemberType IDs (core/constant.go). 1-49 paid / 70-89 free special / 90-99 steering. */
export const MemberType = {
  Standard: 1,
  Committee: 40,
  Student: 70,
  CommitteeFree: 90,
  Disable: 99,
} as const;
export type MemberType = (typeof MemberType)[keyof typeof MemberType];

export const memberTypeLabels: Record<number, string> = {
  [MemberType.Standard]: '一般会員',
  [MemberType.Committee]: '運営委員(有償)',
  [MemberType.Student]: '学生会員',
  [MemberType.CommitteeFree]: '運営委員(無償)',
  [MemberType.Disable]: '',
};

/** Membership fees apply to types 1-49 (backend constant.go comment). */
export function isPaidMemberType(memberTypeId: number): boolean {
  return memberTypeId < 50;
}

/** Service type codes (core/servicetype.go registry). */
export const ServiceTypeCode = {
  L2: '2000',
  L3Static: '3S00',
  L3BGP: '3B00',
  Transit: 'IP3B',
} as const;
export type ServiceTypeCode = (typeof ServiceTypeCode)[keyof typeof ServiceTypeCode];

/** Connection type codes (core/connectiontype.go registry). */
export const ConnectionTypeCode = {
  EtherIP: 'EIP',
  GRE: 'GRE',
  IPIP: 'IPT',
  CrossConnect: 'CC0',
  IX: 'IXP',
  Etc: 'ETC',
} as const;
export type ConnectionTypeCode = (typeof ConnectionTypeCode)[keyof typeof ConnectionTypeCode];
