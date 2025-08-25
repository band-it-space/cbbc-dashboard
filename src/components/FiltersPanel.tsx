import { Filters } from "@/store/types";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useGroupedCBBCStore } from "@/store/groupedCBBCStore";
import { getSortedUnderlyings, formatUnderlyingCode } from "@/lib/utils";
import DatePicker from "./DatePicker";

export type Underlying = {
  code: string;
  name: string;
  type: string;
  ranges: number[];
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
  onApply: (appliedFilters: Filters) => void;
  isFetching?: boolean;
}) {
  const [localFilters, updateLocalFilters] = useState(filters);
  const date = useGroupedCBBCStore((s) => s.date);
  const setDate = useGroupedCBBCStore((s) => s.setDate);

  useEffect(() => {
    updateLocalFilters(filters);
  }, [filters]);

  const handleChange = useCallback(
    (field: keyof Filters, value: any) => {
      const updated = { ...localFilters, [field]: value };
      updateLocalFilters(updated);
      // No auto-apply - wait for user to click Apply button
    },
    [localFilters]
  );

  // Set default range to 0 (no grouping) when component mounts
  useEffect(() => {
    if (localFilters.range === undefined) {
      handleChange("range", 0);
    }
  }, [localFilters.range, handleChange]);

  // Set default underlying to HSI if not set
  useEffect(() => {
    if (!localFilters.underlying && underlyings.length > 0) {
      const hsiUnderlying =
        underlyings.find((u) => u.code === "HSI") || underlyings[0];
      if (hsiUnderlying) {
        const formattedCode = formatUnderlyingCode(hsiUnderlying.code);
        handleChange("underlying", formattedCode);
      }
    }
  }, [underlyings, localFilters.underlying, handleChange]);

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
              const formattedCode = formatUnderlyingCode(u.code);
              return (
                <option key={formattedCode} value={formattedCode}>
                  {u.name} ({formattedCode})
                </option>
              );
            })}
          </select>
        </div>

        {/* Date Select */}
        <div>
          <DatePicker
            value={date}
            onChange={setDate}
            label="Date"
            disabled={isFetching}
          />
        </div>

        {/* Group Step */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Call Level Range
          </label>
          <div className="flex flex-wrap gap-3">
            {/* No Grouping Option */}
            <label className="flex items-center">
              <input
                type="radio"
                name="range"
                value={0}
                checked={localFilters.range === 0}
                onChange={(e) =>
                  handleChange("range", parseInt(e.target.value))
                }
                className="mr-2 text-blue-600"
              />
              <span className="text-sm text-gray-700">No grouping</span>
            </label>

            {/* Available Ranges */}
            {localFilters.underlying &&
              (() => {
                const selectedUnderlying = underlyings.find(
                  (u) =>
                    formatUnderlyingCode(u.code) === localFilters.underlying
                );
                return selectedUnderlying?.ranges?.map((range) => (
                  <label key={range} className="flex items-center">
                    <input
                      type="radio"
                      name="range"
                      value={range}
                      checked={localFilters.range === range}
                      onChange={(e) =>
                        handleChange("range", parseFloat(e.target.value))
                      }
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{range}</span>
                  </label>
                ));
              })()}
          </div>
        </div>

        {/* Apply Button */}
        <div className="flex">
          <button
            onClick={() => {
              // Apply all filters including date
              const appliedFilters = {
                underlying: localFilters.underlying,
                range: localFilters.range,
              };
              // Pass applied filters to onApply to trigger correct data fetch
              onApply(appliedFilters);
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
