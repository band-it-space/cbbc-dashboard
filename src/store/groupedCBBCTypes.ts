import { Underlying } from "@/components/FiltersPanel";

export interface GroupedCBBCEntry {
  code: string;
  call_level: number;
  quantity: number;
  notional: number;
  shares_number: number;
  ul_price: number;
  issuer: string;
  bull_bear: "Bull" | "Bear";
  date: string;
  os_percent: number;
  last_price: number;
}

export interface GroupedBackendCBBC {
  date: string;
  range: string;
  outstanding_quantity: number;
  calculated_notional: number;
  cbcc_list: GroupedCBBCEntry[];
}

export interface GroupedCBBCFilters {
  from: string;
  to: string;
  range: number;
  underlying?: string;
  issuers?: string[];
}

export interface GroupedCBBCStore {
  filters: GroupedCBBCFilters;
  setFilters: (f: Partial<GroupedCBBCFilters>) => void;

  groupedRawData: GroupedBackendCBBC[];
  setGroupedRawData: (data: GroupedBackendCBBC[]) => void;

  lastFetchedFilters: GroupedCBBCFilters | null;
  setLastFetchedFilters: (filters: GroupedCBBCFilters) => void;

  hasFetchedOnce: boolean;
  setHasFetchedOnce: (val: boolean) => void;
  underlyings: Underlying[]; // 👈 Добавь сюда правильный тип
  setUnderlyings: (list: Underlying[]) => void; // 👈 И сюда
}

export interface AggregatedCell {
  notional: number;
  quantity: number;
  shares: number;
  codes: string[];
  items: GroupedCBBCEntry[];
}

export interface Filters {
  from?: string;
  to?: string;
  date?: string;
  underlying?: string;
  range?: number;
  issuer?: string[];
  grouping?: boolean;
  price?: number;
  groupBy?: number | null;
  code?: string;
}
