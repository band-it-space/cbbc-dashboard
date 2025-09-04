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
  isIndexUnderlying?: boolean;
};

export default function CBBCMatrixTable({
  rangeList,
  dateList,
  activeDate,
  prevDate,
  bullMatrix,
  bearMatrix,
  priceByDate,
  isIndexUnderlying = false,
}: Props) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [showAllBearRanges, setShowAllBearRanges] = useState(false);
  const [showAllBullRanges, setShowAllBullRanges] = useState(false);
  const currentPrice = priceByDate[activeDate] ?? 0;

  const toggleRow = (range: string, direction: "Bull" | "Bear") => {
    setExpandedRows((prev) => ({
      ...prev,
      [`${range}-${direction}`]: !prev[`${range}-${direction}`],
    }));
  };

  const bearRanges = rangeList.filter((range) => {
    const [start] = range.split(" - ").map(Number);
    return start >= currentPrice;
  });

  const bullRanges = rangeList.filter((range) => {
    const [start] = range.split(" - ").map(Number);
    return start < currentPrice;
  });

  // Limit displayed ranges to 15 if there are more
  const maxDisplayedRanges = 15;
  const shouldLimitBearRanges = bearRanges.length > maxDisplayedRanges;
  const shouldLimitBullRanges = bullRanges.length > maxDisplayedRanges;

  // Get displayed ranges (first 15 or all if showAll is true)
  // For Bear ranges: show last 15 (closer to price), hide topmost extreme ranges
  // For Bull ranges: show first 15 (closer to price), hide bottommost extreme ranges
  const displayedBearRanges = showAllBearRanges
    ? bearRanges
    : bearRanges.slice(-maxDisplayedRanges);

  const displayedBullRanges = showAllBullRanges
    ? bullRanges
    : bullRanges.slice(0, maxDisplayedRanges);

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
          {/* Show More button for Bear ranges */}
          {shouldLimitBearRanges && !showAllBearRanges && (
            <tr>
              <td
                colSpan={1 + 4 + (dateList.length - 1)}
                className="text-center p-2"
              >
                <button
                  onClick={() => setShowAllBearRanges(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Show More Bear Ranges (
                  {bearRanges.length - maxDisplayedRanges} more)
                </button>
              </td>
            </tr>
          )}

          {/* Show Less button for Bear ranges */}
          {shouldLimitBearRanges && showAllBearRanges && (
            <tr>
              <td
                colSpan={1 + 4 + (dateList.length - 1)}
                className="text-center p-2"
              >
                <button
                  onClick={() => setShowAllBearRanges(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Show Less Bear Ranges
                </button>
              </td>
            </tr>
          )}

          {/* Bear ranges (выше цены) */}
          {displayedBearRanges.map((range) => (
            <Fragment key={`${range}-Bear-${activeDate}`}>
              <CBBCMatrixRow
                range={range}
                dateList={dateList}
                matrix={bearMatrix}
                activeDate={activeDate}
                prevDate={prevDate}
                isExpanded={expandedRows[`${range}-Bear`] || false}
                onToggle={() => toggleRow(range, "Bear")}
                isIndexUnderlying={isIndexUnderlying}
              />
            </Fragment>
          ))}

          {/* Divider */}
          <tr>
            <td colSpan={1 + 4 + (dateList.length - 1)}>
              <CBBCMidSummary
                bullTotal={bullTotal}
                bearTotal={bearTotal}
                currentPrice={currentPrice}
                hiddenBearRanges={
                  shouldLimitBearRanges && !showAllBearRanges
                    ? bearRanges.length - maxDisplayedRanges
                    : 0
                }
                hiddenBullRanges={
                  shouldLimitBullRanges && !showAllBullRanges
                    ? bullRanges.length - maxDisplayedRanges
                    : 0
                }
              />
            </td>
          </tr>

          {/* Bull ranges (ниже цены) */}
          {displayedBullRanges.map((range) => (
            <Fragment key={`${range}-Bull-${activeDate}`}>
              <CBBCMatrixRow
                range={range}
                dateList={dateList}
                matrix={bullMatrix}
                activeDate={activeDate}
                prevDate={prevDate}
                isExpanded={expandedRows[`${range}-Bull`] || false}
                onToggle={() => toggleRow(range, "Bull")}
                isIndexUnderlying={isIndexUnderlying}
              />
            </Fragment>
          ))}

          {/* Show More button for Bull ranges */}
          {shouldLimitBullRanges && !showAllBullRanges && (
            <tr>
              <td
                colSpan={1 + 4 + (dateList.length - 1)}
                className="text-center p-2"
              >
                <button
                  onClick={() => setShowAllBullRanges(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Show More Bull Ranges (
                  {bullRanges.length - maxDisplayedRanges} more)
                </button>
              </td>
            </tr>
          )}

          {/* Show Less button for Bull ranges */}
          {shouldLimitBullRanges && showAllBullRanges && (
            <tr>
              <td
                colSpan={1 + 4 + (dateList.length - 1)}
                className="text-center p-2"
              >
                <button
                  onClick={() => setShowAllBullRanges(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Show Less Bull Ranges
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
