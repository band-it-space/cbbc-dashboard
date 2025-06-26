import { useGroupedCBBCStore } from "@/store/groupedCBBCStore";
import type { GroupedBackendCBBC } from "@/store/groupedCBBCTypes";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

// async function fetchGroupedCBBC(filters: {
//   from: string;
//   to: string;
//   underlying?: string;
//   range: number;
//   issuer?: string;
// }): Promise<GroupedBackendCBBC[]> {
//   const { from, to, underlying, range, issuer } = filters;
//   const params = new URLSearchParams();

//   if (underlying) params.append("ul", underlying);
//   if (range) params.append("call_level_step", range.toString());
//   if (from) params.append("start_date", from);
//   if (to) params.append("end_date", to);
//   if (issuer) params.append("issuer", issuer);

//   const res = await fetch(
//     `http://51.20.215.176:8000/metrics/cbbc/metrics/cbbc/aggregate?${params.toString()}`
//   );
//   if (!res.ok) throw new Error("Failed to fetch aggregated CBBC data");

//   return res.json();
// }

async function fetchGroupedCBBC(filters: {
  from: string;
  to: string;
  underlying?: string;
  range: number;
  issuer?: string;
}): Promise<GroupedBackendCBBC[]> {
  const { from, to, underlying, range, issuer } = filters;
  const params = new URLSearchParams();

  if (underlying) params.append("ul", underlying);
  if (range) params.append("call_level_step", range.toString());
  if (from) params.append("start_date", from);
  if (to) params.append("end_date", to);
  if (issuer) params.append("issuer", issuer);

  const res = await fetch(`/api/cbbc/aggregate?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch aggregated CBBC data");

  return res.json();
}

export const useGroupedCBBCQuery = () => {
  const { filters, setGroupedRawData, setLastFetchedFilters } =
    useGroupedCBBCStore();

  const queryKey = useMemo(
    () => [
      "grouped-cbbc",
      filters.from,
      filters.to,
      filters.underlying,
      filters.range,
    ],
    [filters.from, filters.to, filters.underlying, filters.range]
  );

  const query = useQuery<GroupedBackendCBBC[], Error>({
    queryKey,
    queryFn: () => fetchGroupedCBBC(filters),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.data) {
      setGroupedRawData([...query.data]);
      setLastFetchedFilters(filters);

      // ⬇️ Собираем всех эмитентов из ответа
      const allIssuers = new Set<string>();
      for (const row of query.data) {
        for (const item of row.cbcc_list) {
          allIssuers.add(item.issuer);
        }
      }

      // ⬇️ Сохраняем в Zustand
      useGroupedCBBCStore
        .getState()
        .setMetaOptions(
          useGroupedCBBCStore.getState().underlyings,
          Array.from(allIssuers)
        );
    }
  }, [query.data, filters, setGroupedRawData, setLastFetchedFilters]);

  return query;
};
