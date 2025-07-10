"use client";

import { formatDateHuman } from "@/lib/utils";

export default function CBBCMatrixHeader({ dateList }: { dateList: string[] }) {
  return (
    <thead>
      <tr>
        <th
          className="p-2 border border-gray-300 bg-gray-50 text-center font-bold"
          rowSpan={1}
        >
          Call Range
        </th>
        {/* Активная дата (первая) с 3 колонками */}
        <th
          className="p-2 border border-gray-300 bg-gray-50 text-center font-bold"
          style={{ minWidth: 80 }}
        >
          {formatDateHuman(dateList[0])} - Notional
        </th>
        <th
          className="p-2 border border-gray-300 bg-gray-50 text-center font-bold"
          style={{ minWidth: 80 }}
        >
          {formatDateHuman(dateList[0])} - Quantity
        </th>
        <th
          className="p-2 border border-gray-300 bg-gray-50 text-center font-bold"
          style={{ minWidth: 80 }}
        >
          {formatDateHuman(dateList[0])} - Codes
        </th>
        {/* Остальные даты по 1 колонке */}
        {dateList.slice(1, 4).map((date) => (
          <th
            key={date}
            className="p-2 border border-gray-300 bg-gray-50 text-center font-bold"
          >
            {formatDateHuman(date)}
          </th>
        ))}
      </tr>
    </thead>
  );
}
