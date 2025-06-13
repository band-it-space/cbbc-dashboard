import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCBBCStore } from "@/store/cbbc";

async function fetchCBBC(filters: any) {
  const { from, to, range, issuer, code, price } = filters;
  const params = new URLSearchParams();

  if (from) params.append("from_date", from);
  if (to) params.append("to_date", to);
  if (range) params.append("range", range.toString());
  if (issuer && issuer !== "All") params.append("issuer", issuer);
  if (code) params.append("code", code);
  if (price) params.append("price", price.toString());

  const res = await fetch(`/api/cbbc?${params.toString()}`);

  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

export const useCBBCQuery = () => {
  const { filters, setData } = useCBBCStore();

  const query = useQuery({
    queryKey: ["cbbc-data", filters],
    queryFn: () => fetchCBBC(filters),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.data) setData(query.data);
  }, [query.data, setData]);

  return {
    ...query,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};
