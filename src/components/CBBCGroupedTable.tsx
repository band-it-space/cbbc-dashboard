"use client";

import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";

interface GroupedRow {
  groupKey: string;
  notional: number;
  shares: number;
  quantity: number;
}

interface Props {
  rows: GroupedRow[];
  isFetching: boolean;
}

const columnHelper = createColumnHelper<GroupedRow>();
const columns = [
  columnHelper.accessor("groupKey", {
    header: "KO Range",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("notional", {
    header: "Notional",
    cell: (info) => info.getValue().toLocaleString("en-US"),
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

export default function GroupedCBBCMetricsTable({ rows, isFetching }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isFetching) {
    return (
      <div className="flex justify-center items-center p-6 h-40">
        <div className="w-8 h-8 border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="shadow rounded p-4 overflow-x-auto bg-white border border-gray-200">
      <table className="min-w-full text-sm text-center">
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
            <tr
              key={row.id}
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => router.push(`/dashboard/${row.original.groupKey}`)}
            >
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
  );
}
