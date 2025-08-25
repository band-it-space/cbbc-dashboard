"use client";

import FiltersPanel from "@/components/FiltersPanel";
import CBBCDashboardStats from "@/components/CBBCDashboardStats";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useDashboardFilters } from "@/hooks/useDashboardFilters";

export default function DashboardPageV2() {
  // Use custom hooks for data and filter management
  const dashboardData = useDashboardData();
  const {
    underlyings,
    filteredSingleDateData,
    singleDateQuery,
    hasFetchedSingleDate,
    setHasFetchedSingleDate,
    singleDateSelectedIssuers,
    setSingleDateSelectedIssuers,
    issuerOptions,
    selectedIssuers,
    hasData,
    isFetching,
    isLoadingSingleDate,
    refetch,
    filters,
    date,
    groupedRawData,
    rangeList,
    displayDateList,
    prevDate,
    bullMatrix,
    bearMatrix,
    priceByDate,
  } = dashboardData;

  const { handleApplyFilters, handleIssuerChange } = useDashboardFilters({
    underlyings,
    singleDateQuery,
    refetch,
    setHasFetchedSingleDate,
    setSingleDateSelectedIssuers,
    selectedIssuers,
  });

  const ulCode =
    filters.underlying || (underlyings[0]?.code.padStart(5, "0") ?? "");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">CBBC Dashboard</h1>

      <div className="mb-4">
        <FiltersPanel
          filters={filters}
          underlyings={underlyings}
          onApply={handleApplyFilters}
          isFetching={isFetching || isLoadingSingleDate}
        />
      </div>

      <CBBCDashboardStats
        issuerOptions={issuerOptions}
        selectedIssuers={selectedIssuers}
        onIssuerChange={handleIssuerChange}
        hasData={hasData}
      />

      <DashboardContent
        filteredSingleDateData={filteredSingleDateData}
        groupedRawData={groupedRawData}
        rangeList={rangeList}
        displayDateList={displayDateList}
        prevDate={prevDate}
        bullMatrix={bullMatrix}
        bearMatrix={bearMatrix}
        priceByDate={priceByDate}
        filters={filters}
        date={date || undefined}
        hasFetchedSingleDate={hasFetchedSingleDate}
        singleDateSelectedIssuers={singleDateSelectedIssuers}
        isFetching={isFetching}
        isLoadingSingleDate={isLoadingSingleDate}
        singleDateQueryError={singleDateQuery.error}
        singleDateQuery={singleDateQuery}
        ulCode={ulCode}
      />
    </div>
  );
}
