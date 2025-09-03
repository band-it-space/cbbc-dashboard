"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
} from "@tanstack/react-table";
import { useState, useMemo, useCallback } from "react";
import { toAbbreviatedNumber, convertHKDToUSD } from "@/lib/utils";
import { KOCertificate } from "@/hooks/useKOQuery";

interface SmartKOTableProps {
  data: KOCertificate[];
}

export default function SmartKOTable({ data }: SmartKOTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const formatNotional = useCallback((notional: number) => {
    const hkdFormatted = toAbbreviatedNumber(notional);
    const usdAmount = convertHKDToUSD(notional);
    const usdFormatted = toAbbreviatedNumber(usdAmount);

    return (
      <div className="text-left">
        <div className="font-medium">HK$ {hkdFormatted}</div>
        <div className="text-xs text-gray-500">$ {usdFormatted}</div>
      </div>
    );
  }, []);

  const columns: ColumnDef<KOCertificate>[] = useMemo(
    () => [
      {
        accessorKey: "cbbc_code",
        header: "CBBC Code",
        cell: ({ row }) => (
          <div className="font-medium text-gray-900">
            {row.getValue("cbbc_code")}
          </div>
        ),
      },
      {
        accessorKey: "underlying",
        header: "Underlying",
        cell: ({ row }) => (
          <div className="text-gray-500">{row.getValue("underlying")}</div>
        ),
      },
      {
        accessorKey: "bull_bear",
        header: "Type",
        cell: ({ row }) => {
          const value = row.getValue("bull_bear") as string;
          return (
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                value === "Bull"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {value}
            </span>
          );
        },
      },
      {
        accessorKey: "call_level",
        header: "Call Level",
        cell: ({ row }) => (
          <div className="text-gray-500">{row.getValue("call_level")}</div>
        ),
      },
      {
        accessorKey: "os_percent",
        header: "OS Percent",
        cell: ({ row }) => (
          <div className="text-right text-gray-500">
            {row.getValue("os_percent")}%
          </div>
        ),
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => {
          const value = row.getValue("quantity") as number;
          return (
            <div className="text-right text-gray-500">
              {value ? value.toLocaleString() : "—"}
            </div>
          );
        },
      },
      {
        accessorKey: "notional",
        header: "Notional",
        cell: ({ row }) => formatNotional(row.getValue("notional")),
      },
      {
        accessorKey: "ul_close",
        header: "UL Close",
        cell: ({ row }) => {
          const value = row.getValue("ul_close");
          return (
            <div className="text-right text-gray-500">
              {value ? parseFloat(value as string).toLocaleString() : "—"}
            </div>
          );
        },
      },
    ],
    [formatNotional]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Global Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search across all columns..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-500">
            {table.getFilteredRowModel().rows.length} of {data.length} rows
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-1">
                      <span>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </span>
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Page</span>
              <span className="text-sm font-medium">
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Show</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="px-2 py-1 text-sm border border-gray-300 rounded"
              >
                {[10, 25, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-700">rows</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
