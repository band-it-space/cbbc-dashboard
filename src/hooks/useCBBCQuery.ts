import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCBBCStore } from "@/store/cbbc";
import type { Filters } from "@/store/types";
import type { CBBCItem } from "@/store/types";

// Исправляем сигнатуру и типизацию фильтров
async function fetchCBBC(filters: Filters): Promise<CBBCItem[]> {
  const { date: from, range, issuer, code, price } = filters;
  const params = new URLSearchParams();

  if (from) params.append("from_date", from);
  if (range !== undefined) params.append("range", range.toString());

  if (issuer && issuer.length > 0) {
    params.append("issuer", issuer.join(",")); // 🧠 массив -> строка
  }

  if (code) params.append("code", code);
  if (price !== undefined) params.append("price", price.toString());

  const res = await fetch(`/api/cbbc?${params.toString()}`);

  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

export const useCBBCQuery = () => {
  const { filters, setRawData, setMetaOptions } = useCBBCStore();
  const hasMounted = useRef(false);

  const query = useQuery<CBBCItem[], Error>({
    queryKey: ["cbbc-data", filters],
    queryFn: () => fetchCBBC(filters),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.data && hasMounted.current) {
      setRawData(query.data);

      const uniqueIssuers = [...new Set(query.data.map((item) => item.issuer))];
      const uniqueUnderlyings = [
        ...new Set(query.data.map((item) => item.underlying)),
      ];

      setMetaOptions(uniqueUnderlyings, uniqueIssuers);
    }
  }, [query.data, setRawData, setMetaOptions]);

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  return {
    ...query,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};
