// Service-add wizard IP/plan input shapes, identical in both apps.

export interface ServiceAddIPv4PlanData {
  name: string;
  after: number;
  half_year: number;
  one_year: number;
}

export interface ServiceAddIPData {
  version: number;
  ip: string;
  plan?: ServiceAddIPv4PlanData[];
  name: string;
  start_date: string;
  end_date?: string;
}

export const DefaultServiceAddIPv4PlanData: ServiceAddIPv4PlanData = {
  name: '',
  after: 0,
  half_year: 0,
  one_year: 0,
};

export const DefaultAddIP: ServiceAddIPData = {
  version: 0,
  ip: '',
  plan: undefined,
  name: '',
  start_date: '',
  end_date: undefined,
};
