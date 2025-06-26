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

  const [localFilters, setLocalFilters] = useState(filters);
  const [activeDate, setActiveDate] = useState<string>("");

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApplyFilters = async () => {
    setFilters(localFilters);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await refetch();
  };

  const { rangeList, dateList, bullMatrix, bearMatrix, priceByDate } =
    useCBBCMatrixData(activeDate);

  useEffect(() => {
    if (dateList.length > 0 && !activeDate) {
      setActiveDate(dateList[0]);
    }
  }, [dateList, activeDate]);

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
          setLocalFilters={(update: Partial<Filters>) =>
            setLocalFilters((prev) => ({ ...prev, ...update }))
          }
          onApply={handleApplyFilters}
          // onReset={handleFilterReset}
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
          dateList={dateList}
          activeDate={activeDate}
          onChangeActiveDate={setActiveDate}
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
