"use client";

import { Filters } from "@/store/types";
import dynamic from "next/dynamic";
import type { Props as SelectProps } from "react-select";

const Select = dynamic<SelectProps<any, true>>(
  () => import("react-select") as any,
  { ssr: false }
);

type SelectOption = { value: string; label: string };

export default function FiltersPanel({
  filters,
  issuers,
  underlyings,
  setLocalFilters,
  onChange,
  handleRefresh,
  handleFilterReset,
}: {
  filters: Filters;
  issuers: string[];
  underlyings: string[];
  setLocalFilters: (update: Filters) => void;
  onChange: (field: keyof Filters, value: any) => void;
  handleRefresh: () => void;
  handleFilterReset: () => void;
}) {
  const issuerOptions: SelectOption[] = issuers.map((issuer) => ({
    value: issuer,
    label: issuer,
  }));

  return (
    <div className="bg-white border border-gray-200 shadow rounded p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1 flex items-center">
            From Date
            <span
              title="Start of the date range"
              className="ml-1 text-blue-500 cursor-help"
            >
              ℹ
            </span>
          </label>
          <input
            type="date"
            value={filters.from || ""}
            onChange={(e) =>
              setLocalFilters({ ...filters, from: e.target.value })
            }
            className="w-full px-3 py-2 border border-blue-800 rounded text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1 flex items-center">
            To Date
            <span
              title="End of the date range"
              className="ml-1 text-blue-500 cursor-help"
            >
              ℹ
            </span>
          </label>
          <input
            type="date"
            value={filters.to || ""}
            onChange={(e) =>
              setLocalFilters({ ...filters, to: e.target.value })
            }
            className="w-full px-3 py-2 border border-blue-800 rounded text-gray-800"
          />
        </div>

        <div className="flex items-end">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleRefresh}
            disabled={!filters.from || !filters.to}
          >
            Apply Date Range
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Underlying */}
        <div>
          <label className="block text-sm text-gray-600 mb-1 flex items-center">
            Underlying Asset
            <span
              title="Filter by underlying stock code"
              className="ml-1 text-blue-500 cursor-help"
            >
              ℹ
            </span>
          </label>
          <select
            value={filters.underlying || ""}
            onChange={(e) => onChange("underlying", e.target.value)}
            className="w-full px-3 py-2 border border-blue-800 rounded text-gray-800"
          >
            <option value="">Select Underlying</option>
            {underlyings.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        {/* Group Step */}
        <div>
          <label className="block text-sm text-gray-600 mb-1 flex items-center">
            Group Step
            <span
              title="Set custom grouping step for KO levels"
              className="ml-1 text-blue-500 cursor-help"
            >
              ℹ
            </span>
          </label>
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 bg-gray-200 rounded"
              onClick={() => onChange("groupBy", (filters.groupBy || 0) - 1)}
            >
              -
            </button>
            <input
              type="number"
              min={0}
              value={filters.groupBy ?? 0}
              onChange={(e) =>
                onChange("groupBy", parseFloat(e.target.value) || 0)
              }
              className="w-full px-3 py-2 border border-blue-800 rounded text-gray-800"
            />
            <button
              className="px-2 py-1 bg-gray-200 rounded"
              onClick={() => onChange("groupBy", (filters.groupBy || 0) + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* Issuers */}
        <div>
          <label className="block text-sm text-gray-600 mb-1 flex items-center">
            Issuers
            <span
              title="Filter by issuer companies"
              className="ml-1 text-blue-500 cursor-help"
            >
              ℹ
            </span>
          </label>
          <Select
            isMulti
            options={issuerOptions}
            value={issuerOptions.filter((opt) =>
              (filters.issuer || []).includes(opt.value)
            )}
            onChange={(selected: readonly SelectOption[] | null) => {
              onChange(
                "issuer",
                (selected ?? []).map((opt) => opt.value)
              );
            }}
            className="react-select-container border border-blue-800 rounded"
            classNamePrefix="react-select"
          />
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={() => {
              handleFilterReset();
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
