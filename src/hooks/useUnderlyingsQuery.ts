import { useQuery } from "@tanstack/react-query";
import { useGroupedCBBCStore } from "@/store/groupedCBBCStore";
import { Underlying } from "@/components/FiltersPanel";

// async function fetchUnderlyings(): Promise<Underlying[]> {
//   const res = await fetch("http://51.20.215.176:8000/metrics/underlyings");
//   if (!res.ok) throw new Error("Failed to fetch underlyings list");
//   return res.json(); // это уже Underlying[]
// }

async function fetchUnderlyings(): Promise<Underlying[]> {
  const res = await fetch("/api/cbbc/underlyings");
  if (!res.ok) throw new Error("Failed to fetch underlyings list");
  return res.json();
}

export function useUnderlyingsQuery() {
  const setUnderlyings = useGroupedCBBCStore((s) => s.setUnderlyings);

  const query = useQuery({
    queryKey: ["underlyings"] as const,
    queryFn: () =>
      fetchUnderlyings().then((data) => {
        setUnderlyings(data);
        return data;
      }),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return query;
}
