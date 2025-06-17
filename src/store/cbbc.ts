import { create } from "zustand";
import { CBBCStore } from "./types";

export const useCBBCStore = create<CBBCStore>((set) => ({
  filters: {
    date: "2025-06-11",
    range: 200,
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
