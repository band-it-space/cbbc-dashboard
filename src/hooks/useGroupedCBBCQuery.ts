import { useGroupedCBBCStore } from "@/store/groupedCBBCStore";
import type { GroupedBackendCBBC } from "@/store/groupedCBBCTypes";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { formatUnderlyingCode } from "@/lib/utils";

async function fetchGroupedCBBC(
  filters: any,
  date: string
): Promise<GroupedBackendCBBC[]> {
  const { underlying, range, issuer } = filters;
  const params = new URLSearchParams();

  if (underlying) {
    const formattedUnderlying = formatUnderlyingCode(underlying);
    params.append("ul", formattedUnderlying);
  }
  if (range) params.append("call_level_step", range.toString());
  if (date) params.append("start_date", date);
  if (issuer) params.append("issuer", issuer);

  const res = await fetch(`/api/cbbc/aggregate?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch aggregated CBBC data");

  return res.json();
}

export const useGroupedCBBCQuery = () => {
  const { filters, date, setGroupedRawData, setLastFetchedFilters } =
    useGroupedCBBCStore();
  const queryKey = useMemo(
    () => ["grouped-cbbc", date, filters.underlying, filters.range],
    [date, filters.underlying, filters.range]
  );
  const query = useQuery<GroupedBackendCBBC[], Error>({
    queryKey,
    queryFn: () => fetchGroupedCBBC(filters, date || ""),
    enabled: false,
    retry: false, // Не повторяем запросы при ошибках
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.data && Array.isArray(query.data)) {
      // Определяем диапазон дат из ответа
      const dates = query.data.map((row) => row.date).sort();
      if (dates.length > 0) {
        const from = dates[0];
        const to = dates[dates.length - 1];
        const { filters, setFilters } = useGroupedCBBCStore.getState();
        if (filters.from !== from || filters.to !== to) {
          setFilters({ from, to });
        }
      }
      setGroupedRawData([...query.data]);
      setLastFetchedFilters(filters);

      // ⬇️ Собираем всех эмитентов из ответа
      const allIssuers = new Set<string>();
      for (const row of query.data) {
        if (Array.isArray(row.cbcc_list)) {
          for (const item of row.cbcc_list) {
            allIssuers.add(item.issuer);
          }
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
