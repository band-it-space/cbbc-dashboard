"use client";

import { useState } from "react";
import { useCBBCStore } from "@/store/cbbc";
import { useCBBCQuery } from "@/hooks/useCBBCQuery";

export default function FiltersPanel() {
  const { filters, setFilters } = useCBBCStore();
  const { isFetching, refetch } = useCBBCQuery();

  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (field: keyof typeof filters, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setFilters(localFilters);
    refetch();
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 rounded shadow"
      style={{
        backgroundColor: "#f9fafb", // светло-серый фон
        border: "1px solid #d1d5db", // сероватая рамка
        color: "#111827", // основной текст
      }}
    >
      <input
        type="date"
        value={localFilters.from || ""}
        onChange={(e) => handleChange("from", e.target.value)}
        className="px-3 py-2 rounded"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid rgb(29 58 138)",
          color: "#1f2937",
        }}
      />

      <input
        type="date"
        value={localFilters.to || ""}
        onChange={(e) => handleChange("to", e.target.value)}
        className="px-3 py-2 rounded"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid rgb(29 58 138)",
          color: "#1f2937",
        }}
      />

      <select
        value={localFilters.range || 200}
        onChange={(e) => handleChange("range", parseInt(e.target.value))}
        className="px-3 py-2 rounded"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid rgb(29 58 138)",
          color: "#1f2937",
        }}
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
        value={localFilters.code || ""}
        onChange={(e) => handleChange("code", e.target.value)}
        className="px-3 py-2 rounded"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid rgb(29 58 138)",
          color: "#1f2937",
        }}
      />

      <input
        type="number"
        placeholder="Price"
        value={localFilters.price ?? ""}
        onChange={(e) => handleChange("price", parseFloat(e.target.value))}
        className="px-3 py-2 rounded"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid rgb(29 58 138)",
          color: "#1f2937",
        }}
      />

      <button
        onClick={handleSearch}
        disabled={isFetching}
        className="col-span-full md:col-span-1 font-semibold px-4 py-2 rounded transition flex items-center justify-center"
        style={{
          backgroundColor: isFetching ? "#93C5FD" : "#1E3A8A", // более глубокий синий
          color: "#ffffff",
          cursor: isFetching ? "not-allowed" : "pointer",
          opacity: isFetching ? 0.7 : 1,
        }}
      >
        {isFetching ? (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        ) : null}
        Search
      </button>
    </div>
  );
}
