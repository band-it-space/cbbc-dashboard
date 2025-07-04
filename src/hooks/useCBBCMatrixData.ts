import { useGroupedCBBCStore } from "@/store/groupedCBBCStore";
import { AggregatedCell, GroupedCBBCEntry } from "@/store/groupedCBBCTypes";
import { useMemo } from "react";

export function useCBBCMatrixData(
  from: string | undefined,
  to: string | undefined,
  selectedIssuers: string[] = []
) {
  const { groupedRawData } = useGroupedCBBCStore();

  const result = useMemo(() => {
    if (!to) {
      return {
        activeDate: to,
        rangeList: [],
        dateList: [],
        matrix: {},
        bullMatrix: {},
        bearMatrix: {},
        priceByDate: {},
      };
    }

    const matrix: Record<
      string,
      Record<string, { Bull: AggregatedCell; Bear: AggregatedCell }>
    > = {};
    const ranges = new Set<string>();
    const dates: string[] = [];
    const priceByDate: Record<string, number> = {};

    for (const row of groupedRawData) {
      const { date, range, cbcc_list } = row;
      // Фильтрация по диапазону дат
      if (from && date < from) continue;
      if (to && date > to) continue;
      ranges.add(range);
      if (!dates.includes(date)) dates.push(date);

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

      // Фильтрация по выбранным эмитентам
      const filteredList: GroupedCBBCEntry[] =
        selectedIssuers.length > 0
          ? cbcc_list.filter((cbcc: GroupedCBBCEntry) =>
              selectedIssuers.includes(cbcc.issuer)
            )
          : cbcc_list;

      for (const cbcc of filteredList) {
        const type = cbcc.bull_bear?.trim();

        if (type !== "Bull" && type !== "Bear") {
          continue;
        }
        const cell = matrix[range][date][type as "Bull" | "Bear"];
        cell.notional += cbcc.notional;
        cell.quantity += cbcc.quantity;
        cell.shares += cbcc.shares_number;
        cell.codes.push(cbcc.code);
        cell.items.push({ ...cbcc, date });
      }
    }

    // Сортировка дат по убыванию (новые сверху)
    const sortedDates = dates.sort((a, b) => b.localeCompare(a));

    // Центрирование относительно цены
    const allRanges = Array.from(ranges);
    const parsed = allRanges
      .map((r) => {
        const [from] = r.split(" - ").map(Number);
        return { key: r, from };
      })
      .sort((a, b) => a.from - b.from);

    const refPrice = priceByDate[to] ?? 30;

    const bear = parsed
      .filter((r) => r.from >= refPrice)
      .map((r) => r.key)
      .reverse();
    const bull = parsed
      .filter((r) => r.from < refPrice)
      .map((r) => r.key)
      .reverse();

    const finalRangeList = [...bear, ...bull];

    // Обеспечиваем наличие пустых ячеек
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
      activeDate: to,
      rangeList: finalRangeList,
      dateList: sortedDates,
      matrix,
      bullMatrix,
      bearMatrix,
      priceByDate,
    };
  }, [groupedRawData, selectedIssuers, from, to]);

  return result;
}
