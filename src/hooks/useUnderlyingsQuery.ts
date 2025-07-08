import { useQuery } from "@tanstack/react-query";
import { useGroupedCBBCStore } from "@/store/groupedCBBCStore";
import { Underlying } from "@/components/FiltersPanel";
import { formatUnderlyingCode } from "@/lib/utils";

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

export async function fetchAvailableDates(ul: string): Promise<string[]> {
  const formattedUnderlying = formatUnderlyingCode(ul);
  const res = await fetch(`/api/cbbc/last-dates?ul=${formattedUnderlying}`);
  if (!res.ok) throw new Error("Failed to fetch available dates");
  return res.json();
}

export function useAvailableDatesQuery(ul: string) {
  return useQuery({
    queryKey: ["available-dates", ul],
    queryFn: () => fetchAvailableDates(ul),
    enabled: !!ul,
  });
}
