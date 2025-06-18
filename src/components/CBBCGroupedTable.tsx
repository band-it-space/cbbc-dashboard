"use client";
import type { Table } from "@tanstack/react-table";

import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";

interface GroupedRow {
  groupKey: string;
  callLevel: number;
  notional: number;
  shares: number;
  quantity: number;
  direction: "Bull" | "Bear";
  rangeStart: number;
  rangeEnd: number;
}

interface Props {
  rows: GroupedRow[];
  isFetching: boolean;
}

const columnHelper = createColumnHelper<GroupedRow>();

export default function GroupedCBBCMetricsTable({ rows, isFetching }: Props) {
  const [sortingBear, setSortingBear] = useState<SortingState>([
    { id: "callLevel", desc: true },
  ]);
  const [sortingBull, setSortingBull] = useState<SortingState>([
    { id: "callLevel", desc: true },
  ]);
  const router = useRouter();

  const bullRows = useMemo(
    () => rows.filter((r) => r.direction === "Bull"),
    [rows]
  );
  const bearRows = useMemo(
    () => rows.filter((r) => r.direction === "Bear"),
    [rows]
  );

  const maxBull = Math.max(...bullRows.map((r) => r.notional));
  const maxBear = Math.max(...bearRows.map((r) => r.notional));

  const getColumns = (color: string, max: number) => [
    columnHelper.accessor("callLevel", {
      header: "KO Range",
      cell: (info) => {
        const row = info.row.original;
        return row.rangeStart != null && row.rangeEnd != null
          ? `${row.rangeStart}–${row.rangeEnd}`
          : row.callLevel;
      },
    }),

    columnHelper.accessor("notional", {
      header: "Notional",
      cell: (info) => {
        const value = info.getValue();
        const width = Math.min((value / max) * 100, 100);
        return (
          <div className="flex items-center gap-2">
            <div
              className={`h-3 ${color} rounded-sm bg-opacity-80`}
              style={{ width: `${width}%` }}
            ></div>
            <span className={value === max ? "font-bold text-blue-700" : ""}>
              {value.toLocaleString("en-US")}
              {value === max ? " 🏆" : ""}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor("shares", {
      header: "Shares",
      cell: (info) => info.getValue().toLocaleString("en-US"),
    }),
    columnHelper.accessor("quantity", {
      header: "Contracts",
      cell: (info) => info.getValue().toLocaleString("en-US"),
    }),
  ];

  const bullTable = useReactTable({
    data: bullRows,
    columns: getColumns("bg-teal-700", maxBull),
    state: { sorting: sortingBull },
    onSortingChange: setSortingBull,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const bearTable = useReactTable({
    data: bearRows,
    columns: getColumns("bg-yellow-500", maxBear),
    state: { sorting: sortingBear },
    onSortingChange: setSortingBear,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const renderTable = (title: string, table: Table<GroupedRow>) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">
        {title} CBBCs
      </h3>
      <table className="min-w-full text-sm text-center border">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-3 py-2 border cursor-pointer"
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
        <tbody className="text-gray-800">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => router.push(`/dashboard/${row.original.groupKey}`)}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2 border">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (isFetching) {
    return (
      <div className="flex justify-center items-center p-6 h-40">
        <div className="w-8 h-8 border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="shadow rounded p-4 overflow-x-auto bg-white border border-gray-200">
      {renderTable("Bear", bearTable)}
      {renderTable("Bull", bullTable)}
    </div>
  );
}
