"use client";

import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { type CBBCItem } from "@/store/types";

const columnHelper = createColumnHelper<CBBCItem>();

export default function BBCDetailTable({ items }: { items: CBBCItem[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();

  const table = useReactTable({
    data: items,
    columns: [
      columnHelper.accessor("code", { header: "Code" }),
      columnHelper.accessor("issuer", { header: "Issuer" }),
      columnHelper.accessor("underlying", { header: "Underlying" }),
      columnHelper.accessor("bull_bear", { header: "Type" }),
      columnHelper.accessor("cbbc_type", { header: "CBBC Type" }),
      columnHelper.accessor("cbbc_category", { header: "Category" }),
      columnHelper.accessor("call_level", { header: "KO Level" }),
      columnHelper.accessor("strike_level", { header: "Strike Level" }),
      columnHelper.accessor("currency", { header: "Currency" }),
      columnHelper.accessor("strike_call_currency", {
        header: "Strike Currency",
      }),
      columnHelper.accessor("ul_currency", { header: "UL Currency" }),
      columnHelper.accessor("ul_price", { header: "UL Price" }),
      columnHelper.accessor("day_high", { header: "High" }),
      columnHelper.accessor("day_low", { header: "Low" }),
      columnHelper.accessor("closing_price", { header: "Close" }),
      columnHelper.accessor("turnover_000", { header: "Turnover (k)" }),
      columnHelper.accessor("listing_date", { header: "Listing" }),
      columnHelper.accessor("maturity_date", { header: "Maturity" }),
      columnHelper.accessor("divisor", { header: "Divisor" }),
      columnHelper.accessor("outstanding_quantity", {
        header: "Contracts",
        cell: (info) => info.getValue().toLocaleString("en-US"),
      }),
      columnHelper.accessor("calculated_notional", {
        header: "Notional",
        cell: (info) => info.getValue().toLocaleString("en-US"),
      }),
      columnHelper.accessor("shares_number", {
        header: "Shares",
        cell: (info) => info.getValue().toLocaleString("en-US"),
      }),
    ],
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="shadow rounded p-4 overflow-x-auto bg-white border border-gray-200">
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-4 px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800"
      >
        ← Back to Dashboard
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-max text-sm text-center whitespace-nowrap">
          <thead className="bg-blue-900 text-white uppercase text-xs">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2 cursor-pointer border-b"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc"
                      ? " ↑"
                      : header.column.getIsSorted() === "desc"
                      ? " ↓"
                      : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="text-gray-900">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
