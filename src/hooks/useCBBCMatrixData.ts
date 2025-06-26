import { useGroupedCBBCStore } from "@/store/groupedCBBCStore";
import { AggregatedCell, GroupedCBBCEntry } from "@/store/groupedCBBCTypes";
import { useMemo } from "react";

export function useCBBCMatrixData(activeDate: string) {
  const { groupedRawData, filters } = useGroupedCBBCStore();

  const { rangeList, dateList, matrix, bullMatrix, bearMatrix, priceByDate } =
    useMemo(() => {
      const matrix: Record<
        string,
        Record<string, { Bull: AggregatedCell; Bear: AggregatedCell }>
      > = {};
      const ranges = new Set<string>();
      const dates = new Set<string>();
      const priceByDate: Record<string, number> = {};

      const selectedIssuers = filters.issuers?.length
        ? new Set(filters.issuers)
        : null; // null = показать всех

      for (const row of groupedRawData) {
        const { date, range, cbcc_list } = row;

        ranges.add(range);
        dates.add(date);

        if (!priceByDate[date] && cbcc_list.length > 0) {
          priceByDate[date] = cbcc_list[0].ul_price;
        }

        if (!matrix[range]) matrix[range] = {};
        if (!matrix[range][date]) {
          matrix[range][date] = {
            Bull: { notional: 0, quantity: 0, shares: 0, codes: [], items: [] },
            Bear: { notional: 0, quantity: 0, shares: 0, codes: [], items: [] },
          };
        }

        const filteredList: GroupedCBBCEntry[] = selectedIssuers
          ? cbcc_list.filter((cbcc: GroupedCBBCEntry) =>
              selectedIssuers.has(cbcc.issuer)
            )
          : cbcc_list;

        for (const cbcc of filteredList) {
          const cell = matrix[range][date][cbcc.bull_bear as "Bull" | "Bear"];
          cell.notional += cbcc.notional;
          cell.quantity += cbcc.quantity;
          cell.shares += cbcc.shares_number;
          cell.codes.push(cbcc.code);
          cell.items.push({ ...cbcc, date });
        }
      }

      const sortedDates = Array.from(dates).sort();

      // Центрируем относительно цены
      const allRanges = Array.from(ranges);
      const parsed = allRanges
        .map((r) => {
          const [from] = r.split(" - ").map(Number);
          return { key: r, from };
        })
        .sort((a, b) => a.from - b.from);

      const refPrice = priceByDate[activeDate] ?? 30;
      // const center = parsed.findIndex((p) => p.from >= refPrice);
      // const depth = 6;

      //   const bear = parsed
      //   .filter((r) => r.from >= refPrice)
      //   .map((r) => r.key)
      //   .reverse(); // верхние диапазоны — сверху вниз
      // const bull = parsed
      //   .filter((r) => r.from < refPrice)
      //   .map((r) => r.key); // нижние диапазоны — снизу вверх

      const bear = parsed
        .filter((r) => r.from >= refPrice)
        .map((r) => r.key)
        .reverse();
      const bull = parsed
        .filter((r) => r.from < refPrice)
        .map((r) => r.key)
        .reverse();

      const finalRangeList = [...bear, ...bull];

      // Обеспечим наличие пустых ячеек
      for (const range of finalRangeList) {
        if (!matrix[range]) matrix[range] = {};
        for (const date of sortedDates) {
          if (!matrix[range][date]) {
            matrix[range][date] = {
              Bull: {
                notional: 0,
                quantity: 0,
                shares: 0,
                codes: [],
                items: [],
              },
              Bear: {
                notional: 0,
                quantity: 0,
                shares: 0,
                codes: [],
                items: [],
              },
            };
          }
        }
      }

      const bullMatrix: Record<string, Record<string, AggregatedCell>> = {};
      const bearMatrix: Record<string, Record<string, AggregatedCell>> = {};

      for (const range of finalRangeList) {
        bullMatrix[range] = {};
        bearMatrix[range] = {};

        for (const date of sortedDates) {
          const bullCell = matrix[range][date].Bull;
          const bearCell = matrix[range][date].Bear;

          bullMatrix[range][date] = {
            ...bullCell,
            items: [...bullCell.items],
          };
          bearMatrix[range][date] = {
            ...bearCell,
            items: [...bearCell.items],
          };
        }
      }

      return {
        rangeList: finalRangeList,
        dateList: sortedDates,
        matrix,
        bullMatrix,
        bearMatrix,
        priceByDate,
      };
    }, [groupedRawData, activeDate, filters.issuers]);

  return {
    activeDate,
    rangeList,
    dateList,
    matrix,
    bullMatrix,
    bearMatrix,
    priceByDate,
  };
}
