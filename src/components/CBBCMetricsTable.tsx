"use client";

import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { useState } from "react";
import { useCBBCQuery } from "@/hooks/useCBBCQuery";
import { useCBBCStore } from "@/store/cbbc";

interface CBBCRow {
  code: string;
  issuer: string;
  underlying: string;
  ul_price: number;
  call_level: number;
  calculated_notional: number;
  outstanding_quantity: number;
  shares_number: number;
  divisor: number;
  listing: string;
}

const columnHelper = createColumnHelper<CBBCRow>();

const columns = [
  columnHelper.accessor("code", {
    header: () => "Code",
    cell: (info) => <span className="font-mono">{info.getValue()}</span>,
  }),
  columnHelper.accessor("issuer", {
    header: () => "Issuer",
  }),
  columnHelper.accessor("underlying", {
    header: () => "UL",
  }),
  columnHelper.accessor("ul_price", {
    header: () => "UL Price",
  }),
  columnHelper.accessor("call_level", {
    header: () => "KO Level",
  }),
  columnHelper.accessor("calculated_notional", {
    header: () => "Notional",
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor("outstanding_quantity", {
    header: () => "O/S Qty",
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor("shares_number", {
    header: () => "Shares",
    cell: (info) => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor("divisor", {
    header: () => "Divisor",
  }),
  columnHelper.accessor("listing", {
    header: () => "Listing",
    cell: (info) => info.getValue().split(" ")[0],
  }),
];

export default function CBBCMetricsTable() {
  useCBBCQuery();
  const { data } = useCBBCStore();
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-white shadow rounded p-4 overflow-x-auto">
      <table className="min-w-full text-sm text-center border border-gray-200">
        <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-3 py-2 border-b cursor-pointer select-none"
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
        <tbody className="divide-y divide-gray-100 text-gray-800">
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-400"
              >
                No data found
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
