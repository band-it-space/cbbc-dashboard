"use client";

import { useEffect, useMemo, useState } from "react";
import FiltersPanel from "@/components/FiltersPanel";
import CBBCDashboardStats from "@/components/CBBCDashboardStats";
import { useGroupedCBBCStore } from "@/store/groupedCBBCStore";
import { useGroupedCBBCQuery } from "@/hooks/useGroupedCBBCQuery";
import CBBCMatrixTable from "@/components/CBBCTable/GroupedCBBCMetricsMatrix";
import { useCBBCMatrixData } from "@/hooks/useCBBCMatrixData";
import { useUnderlyingsQuery } from "@/hooks/useUnderlyingsQuery";
import { Filters } from "@/store/groupedCBBCTypes";

export default function DashboardPageV2() {
  const { filters, setFilters, groupedRawData, issuers } =
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

  const [localFilters, setLocalFilters] = useState<Filters>({
    ...filters,
    date: filters.to,
  });
  const [activeDate, setActiveDate] = useState<string>("");
  const [hasInitializedDate, setHasInitializedDate] = useState(false);

  useEffect(() => {
    setLocalFilters((prev) => ({ ...prev, ...filters, date: filters.to }));
    setHasInitializedDate(false);
  }, [filters]);

  const handleApplyFilters = async () => {
    const newFilters = { ...localFilters };
    let to = localFilters.date;
    let from = localFilters.date;
    if (localFilters.date) {
      const end = new Date(localFilters.date);
      const start = new Date(end);
      start.setDate(end.getDate() - 2);
      from = start.toISOString().slice(0, 10);
      to = end.toISOString().slice(0, 10);
    }
    newFilters.to = to;
    newFilters.from = from;
    setFilters(newFilters);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await refetch();
  };

  const {
    rangeList,
    dateList: allDates,
    bullMatrix,
    bearMatrix,
    priceByDate,
  } = useCBBCMatrixData(activeDate);

  const displayDateList = useMemo(() => {
    if (!activeDate) return [];
    const idx = allDates.indexOf(activeDate);
    if (idx === -1) return [];
    const prevDates = allDates.slice(Math.max(0, idx - 2), idx + 1).reverse();
    return [activeDate, ...prevDates];
  }, [activeDate, allDates]);

  useEffect(() => {
    if (!hasInitializedDate && allDates.length > 0) {
      setActiveDate(allDates[0]);
      setHasInitializedDate(true);
    }
  }, [allDates, hasInitializedDate]);

  useEffect(() => {
    if (localFilters.date && allDates.includes(localFilters.date)) {
      setActiveDate(localFilters.date);
    } else if (localFilters.date && allDates.length > 0) {
      setActiveDate("");
    }
  }, [localFilters.date, allDates]);

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
          filters={localFilters}
          underlyings={underlyings}
          setLocalFilters={(update: Filters) => setLocalFilters(update)}
          onApply={handleApplyFilters}
        />
      </div>

      <CBBCDashboardStats
        from={filters.from}
        to={filters.to}
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
      ) : !isFetching && groupedRawData.length > 0 && activeDate ? (
        <CBBCMatrixTable
          rangeList={rangeList}
          dateList={displayDateList}
          activeDate={activeDate}
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
