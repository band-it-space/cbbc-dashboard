import { create } from "zustand";
import { CBBCStore } from "./types";

export const useCBBCStore = create<CBBCStore>((set) => ({
  filters: {
    from: "2025-06-11",
    to: "2025-06-11",
    range: 0,
    grouping: true,
  },
  setFilters: (update) =>
    set((state) => ({ filters: { ...state.filters, ...update } })),

  rawData: [],
  setRawData: (data) => set({ rawData: data }),

  bullGroups: [],
  bearGroups: [],
  setGroupedData: (bull, bear) => set({ bullGroups: bull, bearGroups: bear }),

  groupedMap: {},
  setGroupedMap: (map) => set({ groupedMap: map }),

  underlyings: [],
  issuers: [],
  setMetaOptions: (underlyings, issuers) => set({ underlyings, issuers }),
}));
