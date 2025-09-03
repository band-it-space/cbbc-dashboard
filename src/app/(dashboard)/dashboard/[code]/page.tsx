"use client";

import { useGroupedCBBCStore } from "@/store/groupedCBBCStore";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSingleDateCBBCQuery } from "@/hooks/useSingleDateCBBCQuery";

type CBBCItem = {
  code: string;
  call_level: number;
  quantity: number;
  notional: number;
  shares_number: number | null;
  ul_price: number;
  bull_bear: "Bull" | "Bear";
  issuer: string;
  date?: string;
  conversion_ratio?: number;
  os_percent: number;
  last_price: number;
};

export default function CBBCCodePage() {
  const { code } = useParams();
  const { groupedRawData, filters } = useGroupedCBBCStore();

  const router = useRouter();

  // Получаем single-date данные для текущей даты
  const singleDateQuery = useSingleDateCBBCQuery(
    {
      underlying: filters.underlying || "HSI",
      date: filters.to || "",
    },
    !!filters.to
  );

  const results = useMemo(() => {
    if (!code) return [];

    // Сначала пробуем найти в grouped данных
    if (groupedRawData.length > 0) {
      return groupedRawData.flatMap((row) =>
        row.cbcc_list
          ?.filter((item: CBBCItem) => String(item.code) === String(code))
          .map((item: CBBCItem) => ({
            ...item,
            date: row.date,
          }))
      );
    }

    // Если нет grouped данных, ищем в single-date данных
    if (singleDateQuery.data && singleDateQuery.data.length > 0) {
      return singleDateQuery.data.flatMap((item) =>
        item.cbcc_list
          .filter((entry) => String(entry.code) === String(code))
          .map((entry) => ({
            code: entry.code.toString(),
            call_level: parseFloat(entry.range),
            quantity: entry.outstanding_quantity,
            notional: entry.calculated_notional,
            shares_number: entry.shares,
            ul_price: entry.ul_price,
            bull_bear: entry.bull_bear,
            issuer: entry.issuer,
            date: item.date,
            os_percent: parseFloat(entry.os_percent),
            last_price: parseFloat(entry.last_price),
          }))
      );
    }

    return [];
  }, [groupedRawData, singleDateQuery.data, code]);

  const isLoading = groupedRawData.length === 0 && singleDateQuery.isLoading;

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  if (results.length === 0) {
    return (
      <div className="p-6 text-gray-500">
        No data found for code: <strong>{code}</strong>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        ← Back
      </button>

      <h1 className="text-xl font-bold mb-4">
        CBBC Code: <span className="text-blue-700">{code}</span>
      </h1>

      <table className="min-w-full text-sm border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Call Level</th>
            <th className="p-2 border">UL Price</th>
            <th className="p-2 border">Last Price</th>
            <th className="p-2 border">OS Percent</th>
            <th className="p-2 border">Notional</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Shares</th>
            <th className="p-2 border">Gearing</th>
            <th className="p-2 border">Conversion Ratio</th>
            <th className="p-2 border">Direction</th>
            <th className="p-2 border">Issuer</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item, idx) => (
            <tr key={idx} className="text-center">
              <td className="p-2 border">{item.date}</td>
              <td className="p-2 border">{item.call_level}</td>
              <td className="p-2 border">{item.ul_price}</td>
              <td className="p-2 border">{item.last_price}</td>
              <td className="p-2 border">{item.os_percent}%</td>
              <td className="p-2 border">
                {item.notional ? item.notional.toLocaleString() : "—"}
              </td>
              <td className="p-2 border">
                {item.quantity ? item.quantity.toLocaleString() : "—"}
              </td>
              <td className="p-2 border">
                {item.shares_number ? item.shares_number.toLocaleString() : "—"}
              </td>
              <td className="p-2 border">
                {item.ul_price && item.call_level
                  ? (item.ul_price / item.call_level).toFixed(2) + "x"
                  : "—"}
              </td>
              <td className="p-2 border">
                {item.shares_number && item.quantity
                  ? (item.quantity / item.shares_number).toLocaleString()
                  : "—"}
              </td>
              <td className="p-2 border">{item.bull_bear}</td>
              <td className="p-2 border">{item.issuer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
