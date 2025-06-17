export interface Filters {
  date: string;
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
  call_level: number;
  calculated_notional: number;
  shares_number: number;
  underlying: string;
}
