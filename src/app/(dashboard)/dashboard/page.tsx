"use client";

import { useEffect, useMemo } from "react";
import FiltersPanel from "@/components/FiltersPanel";
import CBBCDashboardStats from "@/components/CBBCDashboardStats";
import { useGroupedCBBCStore } from "@/store/groupedCBBCStore";
import { useGroupedCBBCQuery } from "@/hooks/useGroupedCBBCQuery";
import CBBCMatrixTable from "@/components/CBBCTable/GroupedCBBCMetricsMatrix";
import { useCBBCMatrixData } from "@/hooks/useCBBCMatrixData";
import {
  useUnderlyingsQuery,
  useAvailableDatesQuery,
} from "@/hooks/useUnderlyingsQuery";

export default function DashboardPageV2() {
  const { filters, setFilters, setDate, date, groupedRawData, issuers } =
    useGroupedCBBCStore();
  const { data: underlyings = [] } = useUnderlyingsQuery();
  const { isFetching, refetch } = useGroupedCBBCQuery();

  function getYesterday() {
    const today = new Date();
    const y = new Date(today);
    y.setDate(today.getDate() - 1);
    return y.toISOString().slice(0, 10);
  }
  function getFrom(dateStr: string) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 2);
    return d.toISOString().slice(0, 10);
  }

  useEffect(() => {
    if (!filters.to) {
      const to = getYesterday();
      const from = getFrom(to);
      setFilters({ to, from });
    }
  }, [filters.to, setFilters]);

  const ulCode =
    filters.underlying || (underlyings[0]?.code.padStart(5, "0") ?? "");
  const { data: availableDatesRaw } = useAvailableDatesQuery(ulCode);
  const availableDates = useMemo(() => {
    return Array.isArray(availableDatesRaw) ? availableDatesRaw : [];
  }, [availableDatesRaw]);

  useEffect(() => {
    if (availableDates.length > 0 && !date) {
      const firstDate = availableDates[0];
      if (firstDate) {
        setDate(firstDate);
        setTimeout(() => refetch(), 0);
      }
    }
  }, [availableDates, date, setDate, refetch]);

  const handleApplyFilters = async () => {
    await refetch();
  };

  const {
    rangeList,
    dateList: allDates,
    bullMatrix,
    bearMatrix,
    priceByDate,
  } = useCBBCMatrixData(filters.from, filters.to, filters.issuers || []);

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

  const issuerOptions = useMemo(
    () =>
      issuers.map((issuer) => ({
        label: issuer,
        value: issuer,
      })),
    [issuers]
  );

  const handleIssuerChange = (newValues: string[]) => {
    setFilters({ issuers: newValues });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">CBBC Dashboard</h1>

      <div className="mb-4">
        <FiltersPanel
          filters={filters}
          underlyings={underlyings}
          onApply={handleApplyFilters}
          isFetching={isFetching}
        />
      </div>

      <CBBCDashboardStats
        from={filters.from ?? undefined}
        to={filters.to ?? undefined}
        issuerOptions={issuerOptions}
        selectedIssuers={filters.issuers || []}
        onIssuerChange={handleIssuerChange}
      />

      {isFetching ? (
        <div className="mt-6 animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-6 bg-gray-200 rounded w-full" />
          <div className="h-6 bg-gray-200 rounded w-5/6" />
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-6 bg-gray-200 rounded w-3/4" />
        </div>
      ) : !isFetching && groupedRawData.length > 0 && filters.to ? (
        <CBBCMatrixTable
          rangeList={rangeList}
          dateList={displayDateList}
          activeDate={filters.to}
          prevDate={prevDate}
          bullMatrix={bullMatrix}
          bearMatrix={bearMatrix}
          priceByDate={priceByDate}
        />
      ) : (
        <div className="mt-6 text-center text-gray-500">
          No data found for the selected criteria.
        </div>
      )}
    </div>
  );
}
