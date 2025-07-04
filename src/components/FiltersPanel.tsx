import { Filters } from "@/store/types";
import { useMemo, useState, useEffect } from "react";
import { useAvailableDatesQuery } from "@/hooks/useUnderlyingsQuery";
import { useGroupedCBBCStore } from "@/store/groupedCBBCStore";
import { formatDateHuman, getSortedUnderlyings } from "@/lib/utils";

export type Underlying = {
  code: string;
  name: string;
  type: string;
};

const PRIORITY_CODES = ["HSI", "HSCEI", "HSTEC", "700", "9988"];

export default function FiltersPanel({
  filters,
  underlyings,
  onApply,
  isFetching,
}: {
  filters: Filters;
  underlyings: Underlying[];
  onApply: () => void;
  isFetching?: boolean;
}) {
  const [localFilters, updateLocalFilters] = useState(filters);
  const date = useGroupedCBBCStore((s) => s.date);
  const setDate = useGroupedCBBCStore((s) => s.setDate);
  const setFilters = useGroupedCBBCStore((s) => s.setFilters);

  const ul =
    localFilters.underlying || (underlyings[0]?.code.padStart(5, "0") ?? "");
  const { data: availableDatesRaw, isLoading: isDatesLoading } =
    useAvailableDatesQuery(ul);
  const availableDates: string[] = Array.isArray(availableDatesRaw)
    ? availableDatesRaw
    : [];

  useEffect(() => {
    if (availableDates.length > 0 && !localFilters.date) {
      const lastDate = availableDates[0];
      const updated = { ...localFilters, date: lastDate };
      updateLocalFilters(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableDates]);

  useEffect(() => {
    updateLocalFilters(filters);
  }, [filters]);

  const handleChange = (field: keyof Filters, value: any) => {
    const updated = { ...localFilters, [field]: value };
    updateLocalFilters(updated);
  };

  const sortedUnderlyings = useMemo(
    () => getSortedUnderlyings(underlyings, PRIORITY_CODES),
    [underlyings]
  );

  return (
    <div className="bg-white border border-gray-200 shadow rounded p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
        {/* Underlying */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Underlying</label>
          <select
            value={localFilters.underlying || ""}
            onChange={(e) => handleChange("underlying", e.target.value)}
            className="w-full px-3 py-2 border border-blue-800 rounded text-gray-800"
          >
            <option value="">Select Underlying</option>
            {sortedUnderlyings.map((u) => {
              const paddedCode = u.code.padStart(5, "0");
              return (
                <option key={paddedCode} value={paddedCode}>
                  {u.name} ({paddedCode})
                </option>
              );
            })}
          </select>
        </div>

        {/* Date Select */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Date</label>
          <select
            value={date || ""}
            onChange={(e) => setDate(e.target.value || null)}
            className="w-full px-3 py-2 border border-blue-800 rounded text-gray-800"
            disabled={isDatesLoading || availableDates.length === 0}
          >
            <option value="">Select Date</option>
            {availableDates.map((date: string) => (
              <option key={date} value={date}>
                {formatDateHuman(date)}
              </option>
            ))}
          </select>
        </div>

        {/* Group Step */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Group Step</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                handleChange("range", (localFilters.range || 0) - 1)
              }
              className="px-3 py-2 bg-gray-200 text-gray-800 rounded"
            >
              –
            </button>
            <input
              type="number"
              min={0}
              step="any"
              value={localFilters.range ?? 0}
              onChange={(e) =>
                handleChange("range", parseFloat(e.target.value) || 0)
              }
              className="w-full px-3 py-2 border border-blue-800 rounded text-gray-800"
            />
            <button
              type="button"
              onClick={() =>
                handleChange("range", (localFilters.range || 0) + 1)
              }
              className="px-3 py-2 bg-gray-200 text-gray-800 rounded"
            >
              +
            </button>
          </div>
        </div>

        {/* Apply Button */}
        <div className="flex">
          <button
            onClick={() => {
              setFilters({
                underlying: localFilters.underlying,
                range: localFilters.range,
              });
              setTimeout(() => onApply(), 0);
            }}
            disabled={!!isFetching}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
