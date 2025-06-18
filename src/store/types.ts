export interface Filters {
  from?: string;
  to?: string;
  underlying?: string;
  range?: number;
  issuer?: string[];
  grouping?: boolean;
  price?: number;
  groupBy?: number | null;
  code?: string;
}

export interface GroupedCBBC {
  rangeStart: number;
  rangeEnd: number;
  notional: number;
  contracts: number;
  shares: number;
  direction: "Bull" | "Bear";
  issuer?: string;
}

export type GroupedMap = Record<
  string,
  {
    group: GroupedCBBC;
    items: any[];
  }
>;

export interface CBBCStore {
  filters: Filters;
  setFilters: (update: Partial<Filters>) => void;
  rawData: any[];
  setRawData: (data: any[]) => void;

  bullGroups: GroupedCBBC[];
  bearGroups: GroupedCBBC[];
  setGroupedData: (bull: GroupedCBBC[], bear: GroupedCBBC[]) => void;

  groupedMap: GroupedMap;
  setGroupedMap: (map: GroupedMap) => void;

  underlyings: string[];
  issuers: string[];
  setMetaOptions: (underlyings: string[], issuers: string[]) => void;
}

export interface CBBCItem {
  code: string;
  issuer: string;
  underlying: string;
  bull_bear: "Bull" | "Bear";
  cbbc_type: string;
  cbbc_category: string;
  call_level: number;
  strike_level: number;
  currency: string;
  strike_call_currency: string;
  ul_currency: string;
  ul_price: number;
  day_high: number;
  day_low: number;
  closing_price: number;
  turnover_000: number;
  listing_date: string;
  maturity_date: string;
  divisor: number;
  outstanding_quantity: number;
  calculated_notional: number;
  shares_number: number;
}
