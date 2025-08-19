import { getLastTradingDay } from "@/lib/dateUtils";

interface EmptyStateProps {
  type: "ready" | "no-data" | "filtered-no-data" | "error";
  underlying?: string;
  date?: string;
  selectedIssuers?: string[];
  error?: string;
}

/**
 * Компонент для отображения пустых состояний
 */
export default function EmptyState({
  type,
  underlying = "HSI",
  date,
  selectedIssuers = [],
  error,
}: EmptyStateProps) {
  const displayDate = date || getLastTradingDay();

  switch (type) {
    case "ready":
      return (
        <div className="mt-6 text-center text-gray-500">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Ready to load data
            </h3>
            <p className="text-sm text-gray-600">
              Select your filters and click &quot;Apply&quot; to load CBBC data
            </p>
          </div>
        </div>
      );

    case "filtered-no-data":
      return (
        <div className="mt-6 text-center text-gray-500">
          <>
            No CBBC data found for selected issuers (
            {selectedIssuers.join(", ")}) for {underlying} on {displayDate}.
          </>
        </div>
      );

    case "no-data":
      return (
        <div className="mt-6 text-center text-gray-500">
          <>
            No CBBC data found for {underlying} on {displayDate}.
          </>
        </div>
      );

    case "error":
      return (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error loading CBBC data: {error}</p>
        </div>
      );

    default:
      return (
        <div className="mt-6 text-center text-gray-500">
          No data found for the selected criteria.
        </div>
      );
  }
}
