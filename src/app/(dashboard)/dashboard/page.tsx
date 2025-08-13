"use client";

import { useEffect, useMemo } from "react";
import FiltersPanel from "@/components/FiltersPanel";
import CBBCDashboardStats from "@/components/CBBCDashboardStats";
import { useGroupedCBBCStore } from "@/store/groupedCBBCStore";
import { useGroupedCBBCQuery } from "@/hooks/useGroupedCBBCQuery";
import CBBCMatrixTable from "@/components/CBBCTable/GroupedCBBCMetricsMatrix";
import { useCBBCMatrixData } from "@/hooks/useCBBCMatrixData";
import { useUnderlyingsQuery } from "@/hooks/useUnderlyingsQuery";

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

  useEffect(() => {
    if (!date) {
      const yesterday = getYesterday();
      setDate(yesterday);
      setTimeout(() => refetch(), 0);
    }
  }, [date, setDate, refetch]);

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
        issuerOptions={issuerOptions}
        selectedIssuers={filters.issuers || []}
        onIssuerChange={handleIssuerChange}
      />

      {isFetching ? (
        <div className="mt-6">
          {/* Loading Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <h3 className="text-lg font-medium text-gray-900">
                Loading CBBC Matrix Data...
              </h3>
            </div>
            <p className="text-center text-gray-600 mb-4">
              This may take a few moments as we're processing a large amount of
              data
            </p>
            <div className="flex justify-center space-x-2">
              <div className="animate-pulse bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Fetching data...
              </div>
              <div className="animate-pulse bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Processing matrix...
              </div>
              <div className="animate-pulse bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                Building table...
              </div>
            </div>
          </div>

          {/* Matrix Skeleton */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[...Array(8)].map((_, i) => (
                      <th key={i} className="px-6 py-3 text-left">
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(6)].map((_, rowIndex) => (
                    <tr key={rowIndex} className="animate-pulse">
                      {[...Array(8)].map((_, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-6 py-4 whitespace-nowrap"
                        >
                          <div
                            className={`h-4 bg-gray-200 rounded ${
                              colIndex === 0
                                ? "w-16"
                                : colIndex === 1
                                ? "w-12"
                                : colIndex === 2
                                ? "w-20"
                                : colIndex === 3
                                ? "w-24"
                                : colIndex === 4
                                ? "w-20"
                                : colIndex === 5
                                ? "w-16"
                                : colIndex === 6
                                ? "w-20"
                                : "w-16"
                            }`}
                          ></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Loading progress</span>
                <span>Please wait...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full animate-pulse"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
            <div className="text-center text-sm text-gray-500">
              <div className="animate-bounce inline-block mr-2">⏳</div>
              Data is being prepared for display
            </div>
          </div>
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
          underlyingCode={filters.underlying || ulCode}
        />
      ) : (
        <div className="mt-6 text-center text-gray-500">
          No data found for the selected criteria.
        </div>
      )}
    </div>
  );
}
