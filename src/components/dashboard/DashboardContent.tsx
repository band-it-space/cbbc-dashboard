import CBBCMatrixTable from "@/components/CBBCTable/GroupedCBBCMetricsMatrix";
import SmartSingleDateCBBCTable from "@/components/SmartSingleDateCBBCTable";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import { formatDisplayDate } from "@/lib/dateUtils";
import { useErrorNotification } from "@/hooks/useErrorNotification";

interface DashboardContentProps {
  // Data
  filteredSingleDateData: any[];
  groupedRawData: any[];
  rangeList: any[];
  displayDateList: any[];
  prevDate?: any;
  bullMatrix: any;
  bearMatrix: any;
  priceByDate: any;

  // State
  filters: any;
  date?: string;
  hasFetchedSingleDate: boolean;
  singleDateSelectedIssuers: string[];

  // Loading states
  isFetching: boolean;
  isLoadingSingleDate: boolean;

  // Query state
  singleDateQueryError?: any;
  singleDateQuery: any;

  // Computed
  ulCode: string;
}

/**
 * Главный компонент для рендеринга контента dashboard
 */
export default function DashboardContent({
  filteredSingleDateData,
  groupedRawData,
  rangeList,
  displayDateList,
  prevDate,
  bullMatrix,
  bearMatrix,
  priceByDate,
  filters,
  date,
  hasFetchedSingleDate,

  isFetching,
  isLoadingSingleDate,
  singleDateQueryError,
  singleDateQuery,
  ulCode,
}: DashboardContentProps) {
  const { sendErrorNotification } = useErrorNotification();

  // Show loading state
  if ((isFetching && filters.range !== 0) || isLoadingSingleDate) {
    return <LoadingState isGroupedMode={filters.range !== 0} />;
  }

  // Single date mode (range = 0)
  if (filters.range === 0) {
    // Show single date table with data
    if (filteredSingleDateData.length > 0) {
      return (
        <div className="mt-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              CBBC Data for {filters.underlying || "HSI"} on{" "}
              {formatDisplayDate(date || filters.to || "")}
            </h2>
            <p className="text-sm text-gray-600">
              Showing {filteredSingleDateData.length} CBBC contracts
              <span className="ml-2 text-blue-600">
                (use search to filter data)
              </span>
            </p>
          </div>

          <SmartSingleDateCBBCTable
            data={filteredSingleDateData}
            underlying={filters.underlying || "HSI"}
          />
        </div>
      );
    }

    // Show error state
    if (singleDateQueryError) {
      sendErrorNotification(
        "/api/cbbc/single-date",
        singleDateQueryError.message,
        "Single date CBBC query failed"
      );

      return (
        <EmptyState
          type="error"
          error={singleDateQueryError.message}
          underlying={filters.underlying || "HSI"}
          date={date || filters.to}
        />
      );
    }

    // Show no data state (after fetch with no data)
    if (filteredSingleDateData.length === 0 && !singleDateQuery.isLoading) {
      return (
        <EmptyState
          type="no-data"
          underlying={filters.underlying || "HSI"}
          date={filters.to || date}
        />
      );
    }

    // Show ready state (before first fetch)
    if (!hasFetchedSingleDate) {
      return <EmptyState type="ready" />;
    }
  }

  // Grouped mode (range !== 0)
  if (
    filters.range !== 0 &&
    !isFetching &&
    groupedRawData.length > 0 &&
    filters.to
  ) {
    return (
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
    );
  }

  // Default empty state
  return <EmptyState type="no-data" />;
}
