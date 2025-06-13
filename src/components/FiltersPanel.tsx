"use client";

import { useEffect, useMemo } from "react";
import { useCBBCStore } from "@/store/cbbc";
import debounce from "lodash/debounce";

export default function FiltersPanel() {
  const { filters, setFilters } = useCBBCStore();

  const debouncedSetFilters = useMemo(
    () => debounce(setFilters, 500),
    [setFilters]
  );

  // 💡 На unmount очищаем debounce
  useEffect(() => {
    return () => debouncedSetFilters.cancel();
  }, [debouncedSetFilters]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white shadow rounded">
      <input
        type="date"
        value={filters.from || ""}
        onChange={(e) => setFilters({ from: e.target.value })}
        className="border px-2 py-1 rounded"
      />

      <input
        type="date"
        value={filters.to || ""}
        onChange={(e) => setFilters({ to: e.target.value })}
        className="border px-2 py-1 rounded"
      />

      <select
        value={filters.range || 200}
        onChange={(e) => setFilters({ range: parseInt(e.target.value) })}
        className="border px-2 py-1 rounded"
      >
        {[50, 100, 200, 500].map((r) => (
          <option key={r} value={r}>
            {r} pts
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Code"
        defaultValue={filters.code || ""}
        onChange={(e) => debouncedSetFilters({ code: e.target.value })}
        className="border px-2 py-1 rounded"
      />

      <input
        type="number"
        placeholder="Price"
        defaultValue={filters.price || ""}
        onChange={(e) =>
          debouncedSetFilters({ price: parseFloat(e.target.value) })
        }
        className="border px-2 py-1 rounded"
      />
    </div>
  );
}
