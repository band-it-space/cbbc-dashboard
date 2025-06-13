import { create } from "zustand";

interface Filters {
  from: string;
  to: string;
  range: number;
  code?: string;
  price?: number;
  issuer?: string;
}

interface CBBCStore {
  filters: Filters;
  setFilters: (update: Partial<Filters>) => void;
  data: any[];
  setData: (data: any[]) => void;
}

export const useCBBCStore = create<CBBCStore>((set) => ({
  filters: {
    from: "2025-06-11",
    to: new Date().toISOString().slice(0, 10),
    range: 200,
  },
  setFilters: (update) =>
    set((state) => ({ filters: { ...state.filters, ...update } })),
  data: [],
  setData: (data) => set({ data }),
}));
