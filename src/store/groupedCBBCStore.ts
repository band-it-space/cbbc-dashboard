import { Underlying } from "@/components/FiltersPanel";
import { create } from "zustand";

export type GroupedCBBCStore = {
  date: string | null;
  setDate: (date: string | null) => void;
  filters: {
    from: string | undefined;
    to: string | undefined;
    range: number;
    underlying?: string;
    grouping?: boolean;
    issuers?: string[];
  };
  setFilters: (update: Partial<GroupedCBBCStore["filters"]>) => void;

  groupedRawData: any[];
  setGroupedRawData: (data: any[]) => void;

  lastFetchedFilters: GroupedCBBCStore["filters"] | null;
  setLastFetchedFilters: (filters: GroupedCBBCStore["filters"]) => void;

  hasFetchedOnce: boolean;
  setHasFetchedOnce: (val: boolean) => void;

  issuers: string[];
  underlyings: Underlying[];
  setUnderlyings: (list: Underlying[]) => void;
  setMetaOptions: (underlyings: Underlying[], issuers: string[]) => void;
};

export const useGroupedCBBCStore = create<GroupedCBBCStore>((set) => ({
  date: null,
  setDate: (date: string | null) => set({ date }),
  filters: {
    from: undefined,
    to: undefined,
    range: 0,
    underlying: "HSI",
    grouping: true,
    issuers: [],
  },
  setFilters: (update) =>
    set((state) => ({ filters: { ...state.filters, ...update } })),

  groupedRawData: [],
  setGroupedRawData: (data) => set({ groupedRawData: data }),

  lastFetchedFilters: null,
  setLastFetchedFilters: (filters) => set({ lastFetchedFilters: filters }),

  hasFetchedOnce: false,
  setHasFetchedOnce: (val) => set({ hasFetchedOnce: val }),

  underlyings: [],
  issuers: [],
  setUnderlyings: (list) => set({ underlyings: list }),
  setMetaOptions: (underlyings, issuers) => set({ underlyings, issuers }),
}));
