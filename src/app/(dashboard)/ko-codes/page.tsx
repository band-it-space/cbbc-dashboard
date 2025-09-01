"use client";

import { useState, useEffect } from "react";
import { useKOQuery, KOQueryParams } from "@/hooks/useKOQuery";
import { useUnderlyingsQuery } from "@/hooks/useUnderlyingsQuery";
import { getLastTradingDay } from "@/lib/dateUtils";
import KOFiltersPanel from "@/components/KOFiltersPanel";

import SmartKOTable from "@/components/SmartKOTable";
import KOTableSkeleton from "@/components/KOTableSkeleton";

export default function KOCodesPage() {
  const [filters, setFilters] = useState<KOQueryParams>({
    as_of: "",
    underlying: "HSI",
  });

  const { data: underlyings = [] } = useUnderlyingsQuery();
  const { data: koData = [], isLoading, error, refetch } = useKOQuery(filters);

  // Set default date to last trading day on component mount
  useEffect(() => {
    if (!filters.as_of) {
      setFilters((prev) => ({
        ...prev,
        as_of: getLastTradingDay(),
      }));
    }
  }, [filters.as_of, setFilters]);

  // Auto-fetch data when date is set
  useEffect(() => {
    if (filters.as_of && filters.underlying) {
      refetch();
    }
  }, [filters.as_of, filters.underlying, refetch]);

  const handleApplyFilters = async (newFilters: KOQueryParams) => {
    setFilters(newFilters);
    await refetch();
  };

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Knocked-Out Codes</h1>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Knocked-Out Codes</h1>

      <div className="mb-4">
        <KOFiltersPanel
          filters={filters}
          underlyings={underlyings}
          onApply={handleApplyFilters}
          isFetching={isLoading}
        />
      </div>

      {isLoading ? (
        <KOTableSkeleton />
      ) : koData.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No knocked-out codes found.
        </div>
      ) : (
        <SmartKOTable data={koData} />
      )}
    </div>
  );
}
