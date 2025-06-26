"use client";

import { Fragment } from "react";
import { getNotionalColor } from "./NotionalLegend";
import { toAbbreviatedNumber } from "@/lib/utils";
import Link from "next/link";

type Item = {
  code: string;
  call_level: number;
  ul_price: number;
  quantity: number;
  notional: number;
  shares_number: number;
  bull_bear: "Bull" | "Bear";
  issuer: string;
  date: string;
};

type AggregatedCell = {
  notional: number;
  quantity: number;
  codes: string[];
  items: Item[];
};

type Props = {
  range: string;
  dateList: string[];
  matrix: Record<string, Record<string, AggregatedCell>>;
  activeDate: string;
  isExpanded: boolean;
  onToggle: (range: string) => void;
  maxNotional: number;
  maxQuantity: number;
};

export default function CBBCMatrixRow({
  range,
  dateList,
  matrix,
  activeDate,
  isExpanded,
  onToggle,
  maxNotional,
  maxQuantity,
}: Props) {
  const cellForDate = (date: string) => matrix[range]?.[date];

  return (
    <Fragment>
      <tr
        className="border-t cursor-pointer hover:bg-blue-50"
        onClick={() => onToggle(range)}
      >
        <td className="p-2 font-semibold bg-gray-50 whitespace-nowrap border-r border-gray-300">
          {range}
        </td>

        {dateList.map((date, idx) => {
          const cell = cellForDate(date);
          const isActive = activeDate === date;

          const isEmpty =
            !cell ||
            (cell.notional === 0 &&
              cell.quantity === 0 &&
              cell.codes.length === 0);

          const borderRight =
            idx !== dateList.length - 1 ? "border-r border-gray-300" : "";

          if (isEmpty) {
            return isActive ? (
              <Fragment key={`${range}-${date}-empty-active`}>
                <td
                  className={`p-1 text-center bg-blue-50 border border-blue-400 ${borderRight}`}
                >
                  –
                </td>
                <td
                  className={`p-1 text-center bg-blue-50 border border-blue-400 ${borderRight}`}
                >
                  –
                </td>
                <td
                  className={`p-1 text-center bg-blue-50 border border-blue-400 ${borderRight}`}
                >
                  –
                </td>
              </Fragment>
            ) : (
              <td
                key={`${range}-${date}-empty`}
                className={`p-1 text-center text-gray-400 ${borderRight}`}
              >
                –
              </td>
            );
          }

          if (isActive) {
            const bullFirst = cell.items.find((i) => i.bull_bear === "Bull");
            const bearFirst = cell.items.find((i) => i.bull_bear === "Bear");

            return (
              <Fragment key={`${range}-${date}-active`}>
                <td className="relative p-1  border-1 border-blue-600 min-w-[100px] text-center bg-blue-50">
                  <div
                    className={`h-4 ${
                      bearFirst ? "bg-green-600" : "bg-gray-300"
                    }`}
                    style={{
                      width: `${(cell.notional / maxNotional) * 100}%`,
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center px-1 text-xs text-black font-semibold">
                    {toAbbreviatedNumber(cell.notional)}
                  </div>
                </td>
                <td className="relative p-1  border-1 border-blue-600 min-w-[100px] text-center bg-blue-50">
                  <div
                    className={`h-4 ${
                      bullFirst ? "bg-red-600" : "bg-gray-300"
                    }`}
                    style={{
                      width: `${(cell.quantity / maxQuantity) * 100}%`,
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center px-1 text-xs text-black font-semibold">
                    {toAbbreviatedNumber(cell.quantity)}
                  </div>
                </td>
                <td className="p-1 text-center  border-1 border-blue-600 max-w-[200px] truncate bg-blue-50">
                  {cell.codes.join(", ")}
                </td>
              </Fragment>
            );
          } else {
            return (
              <td
                key={`${range}-${date}-collapsed`}
                className={`p-1 text-center text-gray-800 ${borderRight}`}
                style={{ backgroundColor: getNotionalColor(cell.notional) }}
              >
                {toAbbreviatedNumber(cell.notional)}
              </td>
            );
          }
        })}
      </tr>

      {isExpanded && matrix[range]?.[activeDate]?.items?.length > 0 && (
        <tr className="border-t bg-gray-100">
          <td colSpan={1 + dateList.length * 3} className="p-2">
            <div className="flex flex-col gap-1">
              {matrix[range][activeDate].items.map((item) => (
                <Link
                  key={item.code}
                  href={`/dashboard/${item.code}`}
                  className="text-sm px-3 py-1 rounded bg-white border hover:bg-blue-50 flex items-center justify-between shadow-sm transition"
                >
                  <span className="font-semibold text-blue-700 underline">
                    {item.code} ({item.bull_bear})
                  </span>
                  <span>
                    Call Level: {item.call_level}
                    {" · "}
                    Gearing:{" "}
                    {item.ul_price && item.call_level
                      ? (item.ul_price / item.call_level).toFixed(2) + "x"
                      : "—"}
                    {" · "}
                    Conversion Ratio:{" "}
                    {item.shares_number
                      ? (item.quantity / item.shares_number).toLocaleString()
                      : "—"}
                  </span>
                </Link>
              ))}
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  );
}
