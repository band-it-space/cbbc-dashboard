"use client";

import { Fragment } from "react";
import { getNotionalColor } from "./NotionalLegend";
import {
  toAbbreviatedNumber,
  formatDiff,
  formatCurrencyPair,
} from "@/lib/utils";
import Link from "next/link";

type Item = {
  code: string;
  call_level: number;
  ul_price: number;
  quantity: number;
  notional: number;
  shares_number: number | null;
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
  prevDate?: string;
  isExpanded: boolean;
  onToggle: (range: string) => void;
  maxNotional: number;
  maxShares: number; // Это теперь maxShares
  underlyingCode: string;
};

export default function CBBCMatrixRow({
  range,
  dateList,
  matrix,
  activeDate,
  prevDate,
  isExpanded,
  onToggle,
  maxNotional,
  maxShares,
  underlyingCode,
}: Props) {
  const cellForDate = (date: string) => matrix[range]?.[date];
  console.log("matrix", matrix);
  console.log("range", range, "dateList", dateList);
  console.log("activeDate", activeDate);

  // Проверяем, есть ли данные хотя бы за одну дату
  const hasAnyData = dateList.some((date) => {
    const cell = cellForDate(date);
    return cell && cell.notional > 0;
  });

  console.log(`Диапазон ${range} имеет данные:`, hasAnyData);

  // Если нет данных ни за одну дату, не показываем строку
  if (!hasAnyData) {
    return null;
  }

  return (
    <Fragment>
      <tr
        className="border-t cursor-pointer hover:bg-blue-50"
        onClick={() => onToggle(range)}
      >
        <td className="p-2 font-semibold bg-white text-center border border-gray-300 whitespace-nowrap">
          {range}
        </td>

        {dateList.map((date, idx) => {
          const cell = cellForDate(date);

          if (idx === 0) {
            // Для активной даты (первой даты)
            if (!cell || cell.notional === 0) {
              // Если нет данных в активной дате, показываем прочерки
              return (
                <Fragment key={`${range}-${date}-empty-active`}>
                  <td className="p-1 text-center bg-white border border-gray-300">
                    –
                  </td>
                  <td className="p-1 text-center bg-white border border-gray-300">
                    –
                  </td>
                  <td className="p-1 text-center bg-white border border-gray-300">
                    –
                  </td>
                </Fragment>
              );
            } else {
              // Если есть данные в активной дате, показываем их
              const bearFirst = cell.items.find((i) => i.bull_bear === "Bear");
              const { hkd, usd } = formatCurrencyPair(
                cell.notional,
                underlyingCode
              );

              return (
                <Fragment key={`${range}-${date}-active`}>
                  <td className="relative p-1 border border-gray-300 min-w-[100px] text-center bg-white">
                    <div
                      className={`h-8 ${
                        bearFirst ? "bg-red-400" : "bg-green-400"
                      }`}
                      style={{
                        width: `${(cell.notional / maxNotional) * 100}%`,
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center px-1 text-xs text-black font-semibold">
                      <div className="flex items-center gap-1">
                        <div className="flex flex-col">
                          <span>{hkd} HKD</span>
                          <span className="text-gray-600">{usd} USD</span>
                        </div>
                        {prevDate && matrix[range]?.[prevDate]
                          ? (() => {
                              const prevNotional =
                                matrix[range][prevDate].notional;
                              const diff = cell.notional - prevNotional;
                              if (diff === 0) return null;
                              return (
                                <span className="text-xs font-normal text-gray-500">
                                  [{formatDiff(diff)}]
                                </span>
                              );
                            })()
                          : null}
                      </div>
                    </div>
                  </td>
                  <td className="relative p-1 border border-gray-300 min-w-[100px] text-center bg-white">
                    <div
                      className={`h-8 bg-gray-300`}
                      style={{
                        width: `${(cell.quantity / maxShares) * 100}%`,
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center px-1 text-xs text-black font-semibold">
                      {toAbbreviatedNumber(cell.quantity)}
                    </div>
                  </td>
                  <td className="p-1 text-center border border-gray-300 max-w-[200px] truncate bg-white">
                    {cell.codes.join(", ")}
                  </td>
                </Fragment>
              );
            }
          } else if (idx > 0 && idx < 4) {
            // Для остальных дат показываем данные, если они есть
            const { hkd, usd } = formatCurrencyPair(
              cell?.notional || 0,
              underlyingCode
            );

            return (
              <td
                key={`${range}-${date}-total`}
                className={`p-1 text-center text-gray-800 border border-gray-300 bg-gray-50`}
                style={{
                  backgroundColor: getNotionalColor(cell?.notional || 0),
                }}
              >
                {cell && cell.notional > 0 ? (
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">{hkd}</span>
                    <span className="text-xs text-gray-600">{usd}</span>
                  </div>
                ) : (
                  "–"
                )}
              </td>
            );
          }
          return null;
        })}
      </tr>

      {isExpanded && matrix[range]?.[activeDate]?.items?.length > 0 && (
        <tr className="border-t bg-gray-100">
          <td colSpan={1 + 3 + (dateList.length - 1)} className="p-2">
            <div className="flex flex-col gap-1">
              <div className="flex justify-start">
                <button
                  onClick={() => onToggle(range)}
                  className="text-xs text-gray-500 hover:text-red-600 px-2 py-1"
                  title="Collapse"
                >
                  ✕
                </button>
              </div>

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
