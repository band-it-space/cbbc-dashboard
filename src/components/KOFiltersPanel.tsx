import { useMemo, useState, useEffect } from "react";
import { getSortedUnderlyings, formatUnderlyingCode } from "@/lib/utils";
import { KOQueryParams } from "@/hooks/useKOQuery";

export type Underlying = {
  code: string;
  name: string;
  type: string;
};

const PRIORITY_CODES = ["HSI", "HSCEI", "HSTEC", "700", "9988"];

interface KOFiltersPanelProps {
  filters: KOQueryParams;
  underlyings: Underlying[];
  onApply: (filters: KOQueryParams) => void;
  isFetching?: boolean;
}

export default function KOFiltersPanel({
  filters,
  underlyings,
  onApply,
  isFetching,
}: KOFiltersPanelProps) {
  const [localFilters, updateLocalFilters] = useState<KOQueryParams>(filters);

  useEffect(() => {
    updateLocalFilters(filters);
  }, [filters]);

  const handleChange = (field: keyof KOQueryParams, value: any) => {
    const updated = { ...localFilters, [field]: value };
    updateLocalFilters(updated);
  };

  const sortedUnderlyings = useMemo(
    () => getSortedUnderlyings(underlyings, PRIORITY_CODES),
    [underlyings]
  );

  return (
    <div className="bg-white border border-gray-200 shadow rounded p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
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
          <label className="block text-sm text-gray-600 mb-1">As of Date</label>
          <input
            type="date"
            value={localFilters.as_of || ""}
            onChange={(e) => handleChange("as_of", e.target.value)}
            className="w-full px-3 py-2 border border-blue-800 rounded text-gray-800"
          />
        </div>

        {/* Apply Button */}
        <div className="flex">
          <button
            onClick={() => {
              onApply(localFilters);
            }}
            disabled={!!isFetching}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isFetching ? "Loading..." : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}
