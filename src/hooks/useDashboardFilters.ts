import { useEffect } from "react";
import { useGroupedCBBCStore } from "@/store/groupedCBBCStore";
import { formatUnderlyingCode } from "@/lib/utils";
import { getLastTradingDay, getFromDate } from "@/lib/dateUtils";
import { Filters } from "@/store/types";
import type { Underlying } from "@/components/FiltersPanel";

interface UseDashboardFiltersProps {
  underlyings: Underlying[];
  singleDateQuery: any;
  refetch: () => Promise<any>;
  setHasFetchedSingleDate: (value: boolean) => void;
  setSingleDateSelectedIssuers: (issuers: string[]) => void;
  selectedIssuers: string[];
}

/**
 * Кастомный хук для управления логикой фильтров dashboard
 */
export function useDashboardFilters({
  underlyings,
  singleDateQuery,
  refetch,
  setHasFetchedSingleDate,
  setSingleDateSelectedIssuers,
  selectedIssuers,
}: UseDashboardFiltersProps) {
  const { filters, setFilters, date, setDate } = useGroupedCBBCStore();

  // Initialize default date and filters (don't auto-send requests)
  useEffect(() => {
    if (!date) {
      const lastTradingDay = getLastTradingDay();
      setDate(lastTradingDay);
    }
  }, [date, setDate]);

  // Initialize default filters: HSI with no grouping (range = 0)
  useEffect(() => {
    if (underlyings.length > 0 && !filters.underlying) {
      // Find HSI in underlyings or use first one
      const hsiUnderlying =
        underlyings.find((u) => u.code === "HSI") || underlyings[0];
      if (hsiUnderlying) {
        const formattedCode = formatUnderlyingCode(hsiUnderlying.code);

        // Set filters but DON'T set filters.to yet to prevent auto-requests
        setFilters({
          underlying: formattedCode,
          range: 0, // No grouping by default
          // Don't set 'to' and 'from' here to prevent auto-requests
        });
      }
    }
  }, [underlyings, filters.underlying, setFilters]);

  // Auto-load initial data when both date and underlying are set
  useEffect(() => {
    const shouldAutoLoad =
      date &&
      filters.underlying &&
      filters.range === 0 &&
      !filters.to && // Haven't made any requests yet
      underlyings.length > 0; // Underlyings are loaded

    if (shouldAutoLoad) {
      // Automatically load initial data
      const autoLoadData = async () => {
        const updatedFilters = {
          underlying: filters.underlying,
          range: 0,
          to: date || getLastTradingDay(),
          from: getFromDate(date || getLastTradingDay()),
        };

        setFilters(updatedFilters);

        // Wait for the state to update before refetching
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Single date mode - manually refetch single date query
        setHasFetchedSingleDate(false);
        await singleDateQuery.refetch();
      };

      // Use setTimeout to ensure this runs after all other effects
      setTimeout(autoLoadData, 100);
    }
  }, [
    date,
    filters.underlying,
    filters.range,
    filters.to,
    underlyings.length,
    setFilters,
    setHasFetchedSingleDate,
    singleDateQuery,
  ]);

  // Handle applying filters
  const handleApplyFilters = async (appliedFilters: Filters) => {
    // Update filters with current date and other selections
    const updatedFilters = {
      ...appliedFilters,
      to: date || getLastTradingDay(),
      from: getFromDate(date || getLastTradingDay()),
    };

    setFilters(updatedFilters);

    // Wait for the state to update before refetching
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Trigger appropriate data fetch based on applied range (not current filters.range)
    if (appliedFilters.range === 0) {
      // Single date mode - manually refetch single date query
      setHasFetchedSingleDate(false); // Reset fetch status before new request
      await singleDateQuery.refetch();
    } else {
      // Grouped mode - trigger grouped data fetch
      await refetch();
    }
  };

  // Handle issuer changes
  const handleIssuerChange = (newValues: string[]) => {
    if (filters.range === 0) {
      // Single date mode
      setSingleDateSelectedIssuers(newValues);
    } else {
      // Grouped mode
      setFilters({ issuers: newValues });
    }
  };

  return {
    filters,
    selectedIssuers,
    handleApplyFilters,
    handleIssuerChange,
  };
}
