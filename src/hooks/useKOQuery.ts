import { useQuery } from "@tanstack/react-query";

export interface KOCertificate {
  cbbc_code: number;
  underlying: string;
  bull_bear: "Bull" | "Bear";
  call_level: string;
  os_percent: string;
  quantity: number;
  ul_open: string | null;
  ul_high: string;
  ul_low: string;
  ul_close: string;
}

export interface KOQueryParams {
  as_of?: string;
  underlying?: string;
}

export function useKOQuery(params?: KOQueryParams) {
  const queryParams = new URLSearchParams();

  if (params?.as_of) {
    queryParams.append("as_of", params.as_of);
  }

  // Always include underlying, default to HSI if not provided
  const underlying = params?.underlying || "HSI";
  queryParams.append("underlying", underlying);

  const queryString = queryParams.toString();
  const url = `/api/cbbc/ko${queryString ? `?${queryString}` : ""}`;

  return useQuery({
    queryKey: ["ko-codes", params],
    queryFn: async (): Promise<KOCertificate[]> => {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          // 404 means no data found, return empty array
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
