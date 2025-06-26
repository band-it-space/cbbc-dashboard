// "use client";

// import { Filters } from "@/store/types";
// import { useState } from "react";

// type Underlying = {
//   code: string;
//   name: string;
//   type: string;
// };

// export default function FiltersPanel({
//   filters,
//   underlyings,
//   setLocalFilters,
//   onApply,
// }: {
//   filters: Filters;
//   underlyings: Underlying[];
//   setLocalFilters: (update: Filters) => void;
//   onApply: () => void;
// }) {
//   const [localFilters, updateLocalFilters] = useState(filters);

//   const handleChange = (field: keyof Filters, value: any) => {
//     const updated = { ...localFilters, [field]: value };
//     updateLocalFilters(updated);
//     setLocalFilters(updated);
//   };

//   return (
//     <div className="bg-white border border-gray-200 shadow rounded p-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//         {/* From Date */}
//         <div>
//           <label className="block text-sm text-gray-600 mb-1 flex items-center">
//             From Date
//             <span
//               title="Start of the date range"
//               className="ml-1 text-blue-500 cursor-help"
//             >
//               ℹ
//             </span>
//           </label>
//           <input
//             type="date"
//             value={localFilters.from || ""}
//             onChange={(e) => handleChange("from", e.target.value)}
//             className="w-full px-3 py-2 border border-blue-800 rounded text-gray-800"
//           />
//         </div>

//         {/* To Date */}
//         <div>
//           <label className="block text-sm text-gray-600 mb-1 flex items-center">
//             To Date
//             <span
//               title="End of the date range"
//               className="ml-1 text-blue-500 cursor-help"
//             >
//               ℹ
//             </span>
//           </label>
//           <input
//             type="date"
//             value={localFilters.to || ""}
//             onChange={(e) => handleChange("to", e.target.value)}
//             className="w-full px-3 py-2 border border-blue-800 rounded text-gray-800"
//           />
//         </div>

//         {/* Apply Button */}
//         <div className="flex items-end">
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//             onClick={onApply}
//             disabled={!localFilters.from || !localFilters.to}
//           >
//             Apply Date Range
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//         {/* Underlying Asset */}
//         <div>
//           <label className="block text-sm text-gray-600 mb-1 flex items-center">
//             Underlying Asset
//             <span
//               title="Filter by underlying stock code"
//               className="ml-1 text-blue-500 cursor-help"
//             >
//               ℹ
//             </span>
//           </label>
//           <select
//             value={localFilters.underlying || ""}
//             onChange={(e) => handleChange("underlying", e.target.value)}
//             className="w-full px-3 py-2 border border-blue-800 rounded text-gray-800"
//           >
//             <option value="">Select Underlying</option>
//             {underlyings.map((u) => {
//               const paddedCode = u.code.padStart(5, "0");
//               return (
//                 <option key={paddedCode} value={paddedCode}>
//                   {u.name}
//                 </option>
//               );
//             })}
//           </select>
//         </div>

//         {/* Group Step */}
//         <div>
//           <label className="block text-sm text-gray-600 mb-1 flex items-center">
//             Group Step
//             <span
//               title="Set custom grouping step for KO levels"
//               className="ml-1 text-blue-500 cursor-help"
//             >
//               ℹ
//             </span>
//           </label>
//           <div className="flex items-center gap-2">
//             <button
//               className="px-2 py-1 bg-gray-200 rounded"
//               onClick={() =>
//                 handleChange("range", (localFilters.range || 0) - 1)
//               }
//             >
//               -
//             </button>
//             <input
//               type="number"
//               min={0}
//               value={localFilters.range ?? 0}
//               onChange={(e) =>
//                 handleChange("range", parseFloat(e.target.value) || 0)
//               }
//               className="w-full px-3 py-2 border border-blue-800 rounded text-gray-800"
//             />
//             <button
//               className="px-2 py-1 bg-gray-200 rounded"
//               onClick={() =>
//                 handleChange("range", (localFilters.range || 0) + 1)
//               }
//             >
//               +
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }"use client";

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
    setLocalFilters(updated);
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
        {/* From Date */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">From</label>
          <input
            type="date"
            value={localFilters.from || ""}
            onChange={(e) => handleChange("from", e.target.value)}
            className="w-full px-3 py-2 border border-blue-800 rounded text-gray-800"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">To</label>
          <input
            type="date"
            value={localFilters.to || ""}
            onChange={(e) => handleChange("to", e.target.value)}
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
            onClick={onApply}
            disabled={!localFilters.from || !localFilters.to}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
