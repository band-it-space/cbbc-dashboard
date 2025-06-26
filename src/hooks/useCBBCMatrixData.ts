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
      const center = parsed.findIndex((p) => p.from >= refPrice);
      const depth = 6;

      const bear = parsed
        .slice(center, center + depth)
        .map((r) => r.key)
        .reverse();
      const bull = parsed
        .slice(Math.max(center - depth, 0), center)
        .map((r) => r.key);
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

// import { useGroupedCBBCStore } from "@/store/groupedCBBCStore";
// import { AggregatedCell } from "@/store/groupedCBBCTypes";
// import { useMemo } from "react";

// export function useCBBCMatrixData(activeDate: string) {
//   const { groupedRawData } = useGroupedCBBCStore();
//   const { filters } = useGroupedCBBCStore();

//   const { rangeList, dateList, matrix, bullMatrix, bearMatrix, priceByDate } =
//     useMemo(() => {
//       const matrix: Record<
//         string,
//         Record<string, { Bull: AggregatedCell; Bear: AggregatedCell }>
//       > = {};
//       const ranges = new Set<string>();
//       const dates = new Set<string>();
//       const priceByDate: Record<string, number> = {};

//       for (const row of groupedRawData) {
//         const { date, range, cbcc_list } = row;

//         ranges.add(range);
//         dates.add(date);

//         if (!priceByDate[date] && cbcc_list.length > 0) {
//           priceByDate[date] = cbcc_list[0].ul_price;
//         }

//         if (!matrix[range]) matrix[range] = {};
//         if (!matrix[range][date]) {
//           matrix[range][date] = {
//             Bull: { notional: 0, quantity: 0, shares: 0, codes: [], items: [] },
//             Bear: { notional: 0, quantity: 0, shares: 0, codes: [], items: [] },
//           };
//         }

//         for (const cbcc of cbcc_list) {
//           const cell = matrix[range][date][cbcc.bull_bear as "Bull" | "Bear"];
//           cell.notional += cbcc.notional;
//           cell.quantity += cbcc.quantity;
//           cell.shares += cbcc.shares_number;
//           cell.codes.push(cbcc.code);
//           cell.items.push({ ...cbcc, date }); // важно сохранять дату
//         }
//       }

//       const sortedDates = Array.from(dates).sort();

//       // Центрирование относительно цены
//       const allRanges = Array.from(ranges);
//       const parsed = allRanges
//         .map((r) => {
//           const [from] = r.split(" - ").map(Number);
//           return { key: r, from };
//         })
//         .sort((a, b) => a.from - b.from);

//       const refPrice = priceByDate[activeDate] ?? 30;
//       const center = parsed.findIndex((p) => p.from >= refPrice);
//       const depth = 6;

//       const bear = parsed
//         .slice(center, center + depth)
//         .map((r) => r.key)
//         .reverse();
//       const bull = parsed
//         .slice(Math.max(center - depth, 0), center)
//         .map((r) => r.key);
//       const finalRangeList = [...bear, ...bull];

//       // Убедимся, что ячейки существуют
//       for (const range of finalRangeList) {
//         if (!matrix[range]) matrix[range] = {};
//         for (const date of sortedDates) {
//           if (!matrix[range][date]) {
//             matrix[range][date] = {
//               Bull: {
//                 notional: 0,
//                 quantity: 0,
//                 shares: 0,
//                 codes: [],
//                 items: [],
//               },
//               Bear: {
//                 notional: 0,
//                 quantity: 0,
//                 shares: 0,
//                 codes: [],
//                 items: [],
//               },
//             };
//           }
//         }
//       }

//       // ✅ Создаём новые ссылки на items при каждой итерации по дате
//       const bullMatrix: Record<string, Record<string, AggregatedCell>> = {};
//       const bearMatrix: Record<string, Record<string, AggregatedCell>> = {};

//       for (const range of finalRangeList) {
//         bullMatrix[range] = {};
//         bearMatrix[range] = {};

//         for (const date of sortedDates) {
//           const bullCell = matrix[range][date].Bull;
//           const bearCell = matrix[range][date].Bear;

//           bullMatrix[range][date] = {
//             ...bullCell,
//             items: [...bullCell.items],
//           };
//           bearMatrix[range][date] = {
//             ...bearCell,
//             items: [...bearCell.items],
//           };
//         }
//       }

//       return {
//         rangeList: finalRangeList,
//         dateList: sortedDates,
//         matrix,
//         bullMatrix,
//         bearMatrix,
//         priceByDate,
//       };
//     }, [groupedRawData, activeDate]);

//   return {
//     activeDate,
//     rangeList,
//     dateList,
//     matrix,
//     bullMatrix,
//     bearMatrix,
//     priceByDate,
//   };
// }

// // useCBBCMatrixData.ts
// import { useGroupedCBBCStore } from "@/store/groupedCBBCStore";
// import { AggregatedCell } from "@/store/groupedCBBCTypes";
// import { useMemo } from "react";

// export function useCBBCMatrixData(activeDate: string) {
//   const { groupedRawData } = useGroupedCBBCStore();

//   const { rangeList, dateList, matrix } = useMemo(() => {
//     const map: Record<string, Record<string, AggregatedCell>> = {};
//     const ranges = new Set<string>();
//     const dates = new Set<string>();

//     for (const row of groupedRawData) {
//       const {
//         date,
//         range,
//         calculated_notional,
//         outstanding_quantity,
//         cbcc_list,
//       } = row;

//       ranges.add(range);
//       dates.add(date);

//       if (!map[range]) map[range] = {};
//       if (!map[range][date]) {
//         map[range][date] = {
//           notional: 0,
//           quantity: 0,
//           shares: 0,
//           codes: [],
//           items: [],
//         };
//       }

//       const cell = map[range][date];
//       cell.notional += calculated_notional;
//       cell.quantity += outstanding_quantity;
//       cell.shares += cbcc_list.reduce((sum, i) => sum + i.shares_number, 0);
//       cell.codes.push(...cbcc_list.map((i) => i.code));
//       cell.items.push(...cbcc_list);
//     }

//     return {
//       rangeList: Array.from(ranges).sort((a, b) => {
//         const aStart = parseFloat(a.split(" - ")[0]);
//         const bStart = parseFloat(b.split(" - ")[0]);
//         return bStart - aStart;
//       }),
//       dateList: Array.from(dates).sort(),
//       matrix: map,
//     };
//   }, [groupedRawData]);

//   return { rangeList, dateList, matrix, activeDate };
// }
