"use client";

import { Filters } from "@/store/types";
import dynamic from "next/dynamic";
import type { Props as SelectProps } from "react-select";

const Select = dynamic<SelectProps<any, true>>(
  () => import("react-select") as any,
  { ssr: false }
);

type SelectOption = { value: string; label: string };

const groupOptions = [100, 200, 500]; // убираем null, чтобы не мешал типизации

export default function FiltersPanel({
  filters,
  issuers,
  underlyings,
  onChange,
}: {
  filters: Filters;
  issuers: string[];
  underlyings: string[];
  onChange: (field: keyof Filters, value: any) => void;
}) {
  const issuerOptions: SelectOption[] = issuers.map((issuer) => ({
    value: issuer,
    label: issuer,
  }));

  const handleNumberChange = (field: keyof Filters, value: string) => {
    const number = parseFloat(value);
    onChange(field, Number.isNaN(number) ? null : number);
  };

  return (
    <div className="bg-white border border-gray-200 shadow rounded p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Date</label>
          <input
            type="date"
            value={filters.date || ""}
            onChange={(e) => onChange("date", e.target.value)}
            className="w-full px-3 py-2 border border-blue-800 rounded text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Underlying Asset
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

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Range +/- (pts)
          </label>
          <input
            type="number"
            placeholder="e.g. 200"
            value={filters.range ?? ""}
            onChange={(e) => handleNumberChange("range", e.target.value)}
            className="w-full px-3 py-2 border border-blue-800 rounded text-gray-800"
            min={0}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Issuers</label>
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

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Group KO Level By
          </label>
          <select
            value={filters.groupBy?.toString() ?? ""}
            onChange={(e) => {
              const value =
                e.target.value === "" ? null : parseInt(e.target.value);
              onChange("groupBy", value);
            }}
            className="w-full px-3 py-2 border border-blue-800 rounded text-gray-800"
          >
            <option value="">No Grouping</option>
            {groupOptions.map((val) => (
              <option key={val} value={val}>
                Group by {val}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end"></div>
      </div>
    </div>
  );
}
