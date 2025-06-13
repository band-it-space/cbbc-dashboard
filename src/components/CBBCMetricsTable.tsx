"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
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
    cell: (info) => (
      <span style={{ fontFamily: "monospace" }}>{info.getValue()}</span>
    ),
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
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div
      className="shadow rounded p-4 overflow-x-auto"
      style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }} // white bg + gray-200 border
    >
      <table
        className="min-w-full text-sm text-center"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead
          style={{
            backgroundColor: "rgb(30, 58, 138)", // light hover background
            color: "white", // heading color
            fontWeight: 600,
            textTransform: "uppercase",
            fontSize: "0.75rem",
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{
                    padding: "0.5rem 0.75rem",
                    borderBottom: "1px solid #e5e7eb",
                    cursor: "pointer",
                  }}
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
        <tbody style={{ color: "#1f2937" }}>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#9ca3af", // muted
                }}
              >
                No data found
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                style={{
                  backgroundColor: "white",
                  borderBottom: "1px solid #b3b3b3", // один бордер на всю строку
                  transition: "background-color 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "#e5e7eb"; // gray-200
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "white";
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      padding: "0.5rem 0.75rem",
                    }}
                  >
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
