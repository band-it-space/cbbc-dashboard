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
import { SingleDateCBBCItem } from "@/hooks/useSingleDateCBBCQuery";

interface SmartSingleDateCBBCTableProps {
  data: SingleDateCBBCItem[];
  underlying: string;
}

export default function SmartSingleDateCBBCTable({
  data,
  underlying,
}: SmartSingleDateCBBCTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const formatNotional = useCallback(
    (notional: number) => {
      const hkdFormatted = toAbbreviatedNumber(notional);
      const usdAmount = convertHKDToUSD(notional, underlying);
      const usdFormatted = toAbbreviatedNumber(usdAmount);

      return (
        <div className="text-left">
          <div className="font-medium">HK$ {hkdFormatted}</div>
          <div className="text-xs text-gray-500">$ {usdFormatted}</div>
        </div>
      );
    },
    [underlying]
  );

  const columns: ColumnDef<SingleDateCBBCItem>[] = useMemo(
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
        accessorKey: "cbbc_name",
        header: "CBBC Name",
        cell: ({ row }) => (
          <div className="max-w-xs truncate" title={row.getValue("cbbc_name")}>
            {row.getValue("cbbc_name")}
          </div>
        ),
      },
      {
        accessorKey: "bull_bear",
        header: "Direction",
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
          <div className="text-right">
            {parseFloat(row.getValue("call_level")).toLocaleString()}
          </div>
        ),
      },
      {
        accessorKey: "strike_level",
        header: "Strike Level",
        cell: ({ row }) => (
          <div className="text-right">
            {parseFloat(row.getValue("strike_level")).toLocaleString()}
          </div>
        ),
      },
      {
        accessorKey: "underlying_price",
        header: "Underlying Price",
        cell: ({ row }) => (
          <div className="text-right">
            {parseFloat(row.getValue("underlying_price")).toLocaleString()}
          </div>
        ),
      },
      {
        accessorKey: "calculated_notional",
        header: "Notional",
        cell: ({ row }) => formatNotional(row.getValue("calculated_notional")),
      },
      {
        accessorKey: "number_outstanding",
        header: "Outstanding",
        cell: ({ row }) => (
          <div className="text-right">
            {(row.getValue("number_outstanding") as number).toLocaleString()}
          </div>
        ),
      },
      {
        accessorKey: "os_percent",
        header: "OS %",
        cell: ({ row }) => (
          <div className="text-right">
            {parseFloat(row.getValue("os_percent") as string).toFixed(2)}%
          </div>
        ),
      },
      {
        accessorKey: "total_issue_size",
        header: "Issue Size",
        cell: ({ row }) => (
          <div className="text-right">
            {toAbbreviatedNumber(row.getValue("total_issue_size") as number)}
          </div>
        ),
      },
      {
        accessorKey: "entitlement_ratio",
        header: "Entitlement Ratio",
        cell: ({ row }) => (
          <div className="text-right">
            {parseFloat(
              row.getValue("entitlement_ratio") as string
            ).toLocaleString()}
          </div>
        ),
      },
      {
        accessorKey: "trading_currency",
        header: "Currency",
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("trading_currency")}</div>
        ),
      },
      {
        accessorKey: "issuer",
        header: "Issuer",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.getValue("issuer")}
          </div>
        ),
      },
      {
        accessorKey: "listing_date",
        header: "Listing Date",
        cell: ({ row }) => (
          <div className="text-center">
            {new Date(row.getValue("listing_date")).toLocaleDateString()}
          </div>
        ),
      },
      {
        accessorKey: "maturity_date",
        header: "Maturity",
        cell: ({ row }) => (
          <div className="text-center">
            {new Date(row.getValue("maturity_date")).toLocaleDateString()}
          </div>
        ),
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
