// // store/groupedCBBCStore.ts
// import { create } from "zustand";
// import type { GroupedCBBCStore } from "./groupedCBBCTypes";
// import { persist } from "zustand/middleware";

// export const useGroupedCBBCStore = create(
//   persist<GroupedCBBCStore>(
//     (set) => ({
//       filters: {
//         from: "2025-06-11",
//         to: "2025-06-23",
//         range: 2,
//         underlying: "01088",
//       },
//       setFilters: (update) =>
//         set((state) => ({ filters: { ...state.filters, ...update } })),
//       groupedRawData: [],
//       setGroupedRawData: (data) => set({ groupedRawData: data }),
//       lastFetchedFilters: null,
//       setLastFetchedFilters: (filters) => set({ lastFetchedFilters: filters }),
//       hasFetchedOnce: false,
//       setHasFetchedOnce: (val) => set({ hasFetchedOnce: val }),
//     }),
//     {
//       name: "grouped-cbbc-storage",
//     }
//   )
// );
import { Underlying } from "@/components/FiltersPanel";
import { create } from "zustand";

export type GroupedCBBCStore = {
  filters: {
    from: string;
    to: string;
    range: number;
    underlying?: string;
    grouping?: boolean;
    issuers?: string[];
  };
  setFilters: (update: Partial<GroupedCBBCStore["filters"]>) => void;

  rawData: any[];
  setRawData: (data: any[]) => void;

  groupedRawData: any[];
  setGroupedRawData: (data: any[]) => void;

  lastFetchedFilters: GroupedCBBCStore["filters"] | null;
  setLastFetchedFilters: (filters: GroupedCBBCStore["filters"]) => void;

  hasFetchedOnce: boolean;
  setHasFetchedOnce: (val: boolean) => void;

  bullGroups: any[];
  bearGroups: any[];
  setGroupedData: (bull: any[], bear: any[]) => void;

  groupedMap: Record<string, any>;
  setGroupedMap: (map: Record<string, any>) => void;

  issuers: string[];
  underlyings: Underlying[]; // ✅ правильно
  setUnderlyings: (list: Underlying[]) => void; // ✅ правильно
  setMetaOptions: (underlyings: Underlying[], issuers: string[]) => void;
};

export const useGroupedCBBCStore = create<GroupedCBBCStore>((set) => {
  // Получаем вчерашний день
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const from = new Date(yesterday);
  from.setDate(yesterday.getDate() - 2);

  function format(d: Date) {
    return d.toISOString().slice(0, 10);
  }

  return {
    filters: {
      from: format(from),
      to: format(yesterday),
      range: 2,
      underlying: "01211",
      grouping: true,
      issuers: [],
    },
    setFilters: (update) =>
      set((state) => ({ filters: { ...state.filters, ...update } })),

    rawData: [],
    setRawData: (data) => set({ rawData: data }),

    groupedRawData: [],
    setGroupedRawData: (data) => set({ groupedRawData: data }),

    lastFetchedFilters: null,
    setLastFetchedFilters: (filters) => set({ lastFetchedFilters: filters }),

    hasFetchedOnce: false,
    setHasFetchedOnce: (val) => set({ hasFetchedOnce: val }),

    bullGroups: [],
    bearGroups: [],
    setGroupedData: (bull, bear) => set({ bullGroups: bull, bearGroups: bear }),

    groupedMap: {},
    setGroupedMap: (map) => set({ groupedMap: map }),

    underlyings: [],
    issuers: [],
    setUnderlyings: (list) => set({ underlyings: list }),
    setMetaOptions: (underlyings, issuers) => set({ underlyings, issuers }),
  };
});
