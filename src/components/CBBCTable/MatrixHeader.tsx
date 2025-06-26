"use client";

import { Fragment } from "react";

type Props = {
  dateList: string[];
  activeDate: string;
  onChangeActiveDate: (date: string) => void;
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function CBBCMatrixHeader({
  dateList,
  activeDate,
  onChangeActiveDate,
}: Props) {
  return (
    <thead>
      <tr>
        <th className="p-2 border-b bg-gray-100 text-left">Call Range</th>
        {dateList.map((date) => {
          const isActive = activeDate === date;
          return (
            <th
              key={date}
              colSpan={isActive ? 3 : 1}
              className={`p-2 border-b text-center cursor-pointer whitespace-nowrap transition ${
                isActive
                  ? "bg-blue-500 text-white font-bold border-blue-600 border-2"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
              onClick={() => onChangeActiveDate(date)}
            >
              {formatDate(date)}
            </th>
          );
        })}
      </tr>
      <tr>
        <th className="p-1 border-b border-gray-200 bg-gray-50"></th>
        {dateList.map((date) =>
          activeDate === date ? (
            <Fragment key={date}>
              <th className="p-1 text-center border border-blue-400 bg-blue-50 text-blue-900 text-xs">
                Notional
              </th>
              <th className="p-1 text-center border border-blue-400 bg-blue-50 text-blue-900 text-xs">
                Quantity
              </th>
              <th className="p-1 text-center border border-blue-400 bg-blue-50 text-blue-900 text-xs">
                Codes
              </th>
            </Fragment>
          ) : (
            <th
              key={`${date}-total`}
              className="p-1 text-center text-xs border border-gray-200 bg-gray-50"
            >
              Total
            </th>
          )
        )}
      </tr>
    </thead>
  );
}
