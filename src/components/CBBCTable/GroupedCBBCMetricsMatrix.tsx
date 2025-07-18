"use client";

import { Fragment, useMemo, useState } from "react";
import CBBCMatrixRow from "./CBBCMatrixRow";
import CBBCMidSummary from "./CBBCMidSummary";
import CBBCMatrixHeader from "./MatrixHeader";
import { AggregatedCell } from "@/store/groupedCBBCTypes";

type Props = {
  rangeList: string[];
  dateList: string[];
  activeDate: string;
  prevDate?: string;
  bullMatrix: Record<string, Record<string, AggregatedCell>>;
  bearMatrix: Record<string, Record<string, AggregatedCell>>;
  priceByDate: Record<string, number>;
  underlyingCode: string;
};

export default function CBBCMatrixTable({
  rangeList,
  dateList,
  activeDate,
  prevDate,
  bullMatrix,
  bearMatrix,
  priceByDate,
  underlyingCode,
}: Props) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const currentPrice = priceByDate[activeDate] ?? 0;

  const toggleRow = (range: string, direction: "Bull" | "Bear") => {
    setExpandedRows((prev) => ({
      ...prev,
      [`${range}-${direction}`]: !prev[`${range}-${direction}`],
    }));
  };

  const maxNotional = useMemo(() => {
    return Math.max(
      ...rangeList.flatMap((range) => [
        ...dateList.map((date) => bullMatrix[range]?.[date]?.notional || 0),
        ...dateList.map((date) => bearMatrix[range]?.[date]?.notional || 0),
      ])
    );
  }, [rangeList, dateList, bullMatrix, bearMatrix]);

  const maxQuantity = useMemo(() => {
    return Math.max(
      ...rangeList.flatMap((range) => [
        ...dateList.map((date) => bullMatrix[range]?.[date]?.quantity || 0),
        ...dateList.map((date) => bearMatrix[range]?.[date]?.quantity || 0),
      ])
    );
  }, [rangeList, dateList, bullMatrix, bearMatrix]);

  const bearRanges = rangeList.filter((range) => {
    const [start] = range.split(" - ").map(Number);
    return start >= currentPrice;
  });

  const bullRanges = rangeList.filter((range) => {
    const [start] = range.split(" - ").map(Number);
    return start < currentPrice;
  });

  const bearTotal = useMemo(() => {
    return bearRanges.reduce((sum, range) => {
      const cell = bearMatrix[range]?.[activeDate];
      return sum + (cell?.notional ?? 0);
    }, 0);
  }, [bearRanges, bearMatrix, activeDate]);

  const bullTotal = useMemo(() => {
    return bullRanges.reduce((sum, range) => {
      const cell = bullMatrix[range]?.[activeDate];
      return sum + (cell?.notional ?? 0);
    }, 0);
  }, [bullRanges, bullMatrix, activeDate]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-gray-300">
        <CBBCMatrixHeader dateList={dateList} />
        <tbody>
          {/* Bear ranges (выше цены) */}
          {bearRanges.map((range) => (
            <Fragment key={`${range}-Bear-${activeDate}`}>
              <CBBCMatrixRow
                range={range}
                dateList={dateList}
                matrix={bearMatrix}
                activeDate={activeDate}
                prevDate={prevDate}
                isExpanded={expandedRows[`${range}-Bear`] || false}
                onToggle={() => toggleRow(range, "Bear")}
                maxNotional={maxNotional}
                maxQuantity={maxQuantity}
                underlyingCode={underlyingCode}
              />
            </Fragment>
          ))}

          {/* Divider */}
          <tr>
            <td colSpan={1 + dateList.length * 3}>
              <CBBCMidSummary
                bullTotal={bullTotal}
                bearTotal={bearTotal}
                currentPrice={currentPrice}
                underlyingCode={underlyingCode}
              />
            </td>
          </tr>

          {/* Bull ranges (ниже цены) */}
          {bullRanges.map((range) => (
            <Fragment key={`${range}-Bull-${activeDate}`}>
              <CBBCMatrixRow
                range={range}
                dateList={dateList}
                matrix={bullMatrix}
                activeDate={activeDate}
                prevDate={prevDate}
                isExpanded={expandedRows[`${range}-Bull`] || false}
                onToggle={() => toggleRow(range, "Bull")}
                maxNotional={maxNotional}
                maxQuantity={maxQuantity}
                underlyingCode={underlyingCode}
              />
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
