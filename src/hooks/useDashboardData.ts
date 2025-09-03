import { useState, useEffect, useMemo } from "react";
import { useGroupedCBBCStore } from "@/store/groupedCBBCStore";
import { useUnderlyingsQuery } from "@/hooks/useUnderlyingsQuery";
import { useGroupedCBBCQuery } from "@/hooks/useGroupedCBBCQuery";
import { useSingleDateCBBCQuery } from "@/hooks/useSingleDateCBBCQuery";
import { useCBBCMatrixData } from "@/hooks/useCBBCMatrixData";
import { getLastTradingDay } from "@/lib/dateUtils";

/**
 * Кастомный хук для управления всеми данными dashboard
 */
export function useDashboardData() {
  const { filters, date, groupedRawData, issuers } = useGroupedCBBCStore();

  // External data queries
  const { data: underlyings = [] } = useUnderlyingsQuery();
  const { isFetching, refetch } = useGroupedCBBCQuery();

  // Single date query for when range = 0
  // Use filters.to for the query, not the local date state
  const singleDateQuery = useSingleDateCBBCQuery(
    {
      underlying: filters.underlying || "HSI",
      date: filters.to || getLastTradingDay(),
    },
    filters.range === 0 && !!filters.to // Only enable when range = 0 AND filters.to is set
  );

  // Track whether single date data has been fetched at least once
  const [hasFetchedSingleDate, setHasFetchedSingleDate] = useState(false);

  // Single date issuer filtering state
  const [singleDateSelectedIssuers, setSingleDateSelectedIssuers] = useState<
    string[]
  >([]);

  // Reset issuer filters when switching between modes
  useEffect(() => {
    setSingleDateSelectedIssuers([]);
  }, [filters.range]);

  // Track when single date data has been successfully fetched
  useEffect(() => {
    if (
      singleDateQuery.data !== undefined &&
      !singleDateQuery.isLoading &&
      !singleDateQuery.error
    ) {
      setHasFetchedSingleDate(true);
    }
  }, [singleDateQuery.data, singleDateQuery.isLoading, singleDateQuery.error]);

  // Get issuers from single date data
  const singleDateIssuers = useMemo(() => {
    if (!singleDateQuery.data || !Array.isArray(singleDateQuery.data))
      return [];
    const uniqueIssuers = [
      ...new Set(
        singleDateQuery.data.flatMap((item) =>
          item.cbcc_list.map((entry) => entry.issuer)
        )
      ),
    ];
    return uniqueIssuers.sort();
  }, [singleDateQuery.data]);

  // For single date mode, we don't filter by issuers (use global search instead)
  const filteredSingleDateData = useMemo(() => {
    return Array.isArray(singleDateQuery.data) ? singleDateQuery.data : [];
  }, [singleDateQuery.data]);

  // Matrix data for grouped mode
  const {
    rangeList,
    dateList: allDates,
    bullMatrix,
    bearMatrix,
    priceByDate,
  } = useCBBCMatrixData(filters.from, filters.to, filters.issuers || []);

  // Computed display data
  const displayDateList = useMemo(() => {
    if (!filters.to || allDates.length === 0) return allDates;
    const idx = (allDates as string[]).indexOf(filters.to!);
    if (idx === -1) return allDates;
    const activeDate = allDates[idx];
    const previousDates = allDates.slice(idx + 1); // даты идут от новых к старым
    return [activeDate, activeDate, ...previousDates];
  }, [allDates, filters.to]);

  const prevDate = useMemo(() => {
    if (!filters.to || allDates.length === 0) return undefined;
    const idx = (allDates as string[]).indexOf(filters.to!);
    if (idx === -1 || idx + 1 >= allDates.length) return undefined;
    return allDates[idx + 1];
  }, [allDates, filters.to]);

  // Issuer options based on current mode
  const issuerOptions = useMemo(() => {
    if (filters.range === 0) {
      // Single date mode - use issuers from single date data
      return Array.isArray(singleDateIssuers)
        ? singleDateIssuers.map((issuer) => ({
            label: issuer,
            value: issuer,
          }))
        : [];
    } else {
      // Grouped mode - use issuers from grouped data
      return Array.isArray(issuers)
        ? issuers.map((issuer) => ({
            label: issuer,
            value: issuer,
          }))
        : [];
    }
  }, [filters.range, singleDateIssuers, issuers]);

  // Selected issuers based on current mode
  const selectedIssuers =
    filters.range === 0 ? singleDateSelectedIssuers : filters.issuers || [];

  // Loading states
  const isLoadingSingleDate = filters.range === 0 && singleDateQuery.isLoading;

  // Determine if we have data to show issuer selector
  // Only show for grouped mode, not for single date (which has global search)
  const hasData = useMemo(() => {
    if (filters.range === 0) {
      // Single date mode - don't show issuer selector (has global search instead)
      return false;
    } else {
      // Grouped mode - check if we have grouped data
      return groupedRawData.length > 0;
    }
  }, [filters.range, groupedRawData]);

  return {
    // Data
    underlyings,
    filteredSingleDateData,
    singleDateIssuers,
    groupedRawData,
    rangeList,
    displayDateList,
    prevDate,
    bullMatrix,
    bearMatrix,
    priceByDate,

    // Query objects
    singleDateQuery,

    // States
    hasFetchedSingleDate,
    setHasFetchedSingleDate,
    singleDateSelectedIssuers,
    setSingleDateSelectedIssuers,

    // Computed
    issuerOptions,
    selectedIssuers,
    hasData,

    // Loading states
    isFetching,
    isLoadingSingleDate,

    // Actions
    refetch,

    // Store data
    filters,
    date,
  };
}
