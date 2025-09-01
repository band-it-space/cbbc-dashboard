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
    if (!to || !Array.isArray(groupedRawData)) {
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

      if (!Array.isArray(cbcc_list)) {
        console.warn("cbcc_list is not an array:", cbcc_list);
        continue;
      }

      ranges.add(range);
      if (!dates.includes(date)) dates.push(date);

      if (!priceByDate[date] && cbcc_list.length > 0) {
        priceByDate[date] = cbcc_list[0].ul_price;
      }
    }

    const sortedDates = dates.sort((a, b) => b.localeCompare(a));

    for (const range of ranges) {
      if (!matrix[range]) matrix[range] = {};
      for (const date of sortedDates) {
        if (!matrix[range][date]) {
          matrix[range][date] = {
            Bull: { notional: 0, quantity: 0, shares: 0, codes: [], items: [] },
            Bear: { notional: 0, quantity: 0, shares: 0, codes: [], items: [] },
          };
        }
      }
    }

    for (const row of groupedRawData) {
      const { date, range, cbcc_list } = row;

      const shouldIncludeDate = (!from || date >= from) && (!to || date <= to);

      if (!shouldIncludeDate) {
        continue;
      }

      const filteredList: GroupedCBBCEntry[] =
        Array.isArray(selectedIssuers) && selectedIssuers.length > 0
          ? cbcc_list.filter((cbcc: GroupedCBBCEntry) =>
              selectedIssuers.includes(cbcc.issuer)
            )
          : cbcc_list;

      if (filteredList.length === 0) {
        if (
          !matrix[range][date].Bull.notional &&
          !matrix[range][date].Bear.notional
        ) {
          matrix[range][date].Bull = {
            notional: 0,
            quantity: 0,
            shares: 0,
            codes: [],
            items: [],
          };
          matrix[range][date].Bear = {
            notional: 0,
            quantity: 0,
            shares: 0,
            codes: [],
            items: [],
          };
        }
        continue;
      }

      for (const cbcc of filteredList) {
        const type = cbcc.bull_bear?.trim();

        if (type !== "Bull" && type !== "Bear") {
          continue;
        }

        const cell = matrix[range][date][type as "Bull" | "Bear"];
        cell.notional += cbcc.notional;
        cell.quantity += cbcc.quantity;

        // Используем shares_number как есть для всех типов
        cell.shares += Math.round(cbcc.shares_number * 100) / 100;

        cell.codes.push(cbcc.code.toString());
        cell.items.push({ ...cbcc, date });
      }
    }

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
