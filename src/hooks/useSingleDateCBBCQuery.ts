import { useQuery } from "@tanstack/react-query";

export interface SingleDateCBBCItem {
  date: string;
  call_level: string;
  count: number;
  outstanding_quantity: number;
  calculated_notional: number;
  shares: number;
  cbcc_list: SingleDateCBBCEntry[];
}

export interface SingleDateCBBCEntry {
  range: string;
  outstanding_quantity: number;
  calculated_notional: number;
  shares: number;
  code: number;
  os_percent: string;
  ul_price: number;
  last_price: string;
  bull_bear: "Bull" | "Bear";
  issuer: string;
  divisor: string;
  total_issue_size: number;
  cbbc_name: string;
  trading_currency: string;
  strike_level: string;
  maturity_date: string;
  listing_date: string;
}

export interface SingleDateCBBCParams {
  underlying: string;
  date: string;
}

export function useSingleDateCBBCQuery(
  params: SingleDateCBBCParams,
  enabled: boolean = true
) {
  const queryParams = new URLSearchParams();

  if (params.underlying) {
    queryParams.append("underlying", params.underlying);
  }

  if (params.date) {
    queryParams.append("target_date", params.date);
  }

  const queryString = queryParams.toString();
  const url = `/api/cbbc/single-date${queryString ? `?${queryString}` : ""}`;

  return useQuery({
    queryKey: ["single-date-cbbc", params],
    queryFn: async (): Promise<SingleDateCBBCItem[]> => {
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
    enabled: enabled && !!params.underlying && !!params.date,
    retry: false, // Не повторяем запросы при ошибках
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
