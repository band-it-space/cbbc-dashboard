import { Filters } from "@/store/types";
import { useMemo, useState } from "react";

export type Underlying = {
  code: string;
  name: string;
  type: string;
};

const PRIORITY_CODES = ["HSI", "HSCEI", "HSTEC", "700", "9988"];

export default function FiltersPanel({
  filters,
  underlyings,
  setLocalFilters,
  onApply,
}: {
  filters: Filters;
  underlyings: Underlying[];
  setLocalFilters: (update: Filters) => void;
  onApply: () => void;
}) {
  const [localFilters, updateLocalFilters] = useState(filters);

  const handleChange = (field: keyof Filters, value: any) => {
    const updated = { ...localFilters, [field]: value };
    updateLocalFilters(updated);
    if (field === "date") {
      setLocalFilters(updated);
    }
  };

  const sortedUnderlyings = useMemo(() => {
    return [...underlyings].sort((a, b) => {
      const indexA = PRIORITY_CODES.indexOf(a.code);
      const indexB = PRIORITY_CODES.indexOf(b.code);

      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [underlyings]);

  return (
    <div className="bg-white border border-gray-200 shadow rounded p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
        {/* Single Date */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Date</label>
          <input
            type="date"
            value={localFilters.date || ""}
            onChange={(e) => handleChange("date", e.target.value)}
            className="w-full px-3 py-2 border border-blue-800 rounded text-gray-800"
          />
        </div>

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
              setLocalFilters(localFilters);
              onApply();
            }}
            disabled={!localFilters.date}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
