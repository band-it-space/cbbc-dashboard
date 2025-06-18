import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCBBCStore } from "@/store/cbbc";
import type { Filters } from "@/store/types";
import type { CBBCItem } from "@/store/types";

async function fetchCBBC(filters: Filters): Promise<CBBCItem[]> {
  const { from, to } = filters;
  const params = new URLSearchParams();

  if (from) params.append("from_date", from);
  if (to) params.append("to_date", to);

  const res = await fetch(`/api/cbbc?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch data");

  return res.json();
}

export const useCBBCQuery = () => {
  const { filters, setRawData, setMetaOptions } = useCBBCStore();
  const hasMounted = useRef(false);

  const query = useQuery<CBBCItem[], Error>({
    queryKey: ["cbbc-data", filters.from, filters.to],
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
