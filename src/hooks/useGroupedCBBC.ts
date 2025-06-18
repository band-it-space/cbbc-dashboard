// export function useGroupedCBBC() {
//   const { rawData, filters } = useCBBCStore();
//   const { grouping = true, range = 200, price, issuer, underlying } = filters;

//   const grouped = useMemo(() => {
//     const filtered = rawData.filter((item) => {
//       const matchIssuer = !issuer?.length || issuer.includes(item.issuer);
//       const matchUnderlying = !underlying || item.underlying === underlying;
//       const matchRange =
//         price == null || Math.abs(item.call_level - price) <= range;
//       return matchIssuer && matchUnderlying && matchRange;
//     });

//     const round = (val: number, group: number) =>
//       Math.floor(val / group) * group;

//     const createGroupMap = (direction: "Bull" | "Bear") => {
//       const map = new Map<string, GroupedCBBC>();
//       filtered
//         .filter((item) => item.bull_bear === direction)
//         .forEach((item) => {
//           const base = round(item.call_level, range);
//           const groupStart = direction === "Bear" ? base : base - range + 1;
//           const key = `${direction}-${groupStart}`;
//           if (!map.has(key)) {
//             map.set(key, {
//               rangeStart: groupStart,
//               rangeEnd: groupStart + range - 1,
//               notional: 0,
//               contracts: 0,
//               shares: 0,
//               direction,
//             });
//           }
//           const group = map.get(key)!;
//           group.notional += item.calculated_notional;
//           group.contracts += item.outstanding_quantity;
//           group.shares += item.shares_number;
//         });
//       return Array.from(map.values()).sort((a, b) =>
//         direction === "Bull"
//           ? b.rangeStart - a.rangeStart
//           : a.rangeStart - b.rangeStart
//       );
//     };

//     const bull = createGroupMap("Bull");
//     const bear = createGroupMap("Bear");
//     return {
//       bullGroups: bull,
//       bearGroups: bear,
//     };
//   }, [rawData, issuer, underlying, price, range]);

//   return grouped;
// }

// export function useGroupedCBBC() {
//   const { rawData, filters, setGroupedData, setGroupedMap } = useCBBCStore();
//   const { grouping = true, range = 200, price, issuer, underlying } = filters;

//   const grouped = useMemo(() => {
//     const filtered = rawData.filter((item) => {
//       const matchIssuer = !issuer?.length || issuer.includes(item.issuer);
//       const matchUnderlying = !underlying || item.underlying === underlying;
//       const matchRange =
//         price == null || Math.abs(item.call_level - price) <= range;
//       return matchIssuer && matchUnderlying && matchRange;
//     });

//     const round = (val: number, group: number) =>
//       Math.floor(val / group) * group;

//     const groupedMap: Record<string, { group: GroupedCBBC; items: any[] }> = {};

//     const createGroupMap = (direction: "Bull" | "Bear") => {
//       const map = new Map<string, GroupedCBBC & { items: any[] }>();

//       filtered
//         .filter((item) => item.bull_bear === direction)
//         .forEach((item) => {
//           const base = round(item.call_level, range);
//           const groupStart = direction === "Bear" ? base : base - range + 1;
//           const groupEnd = groupStart + range - 1; // 💡 объявить до key
//           const key = `${direction}-${groupStart}–${groupEnd}`;

//           if (!map.has(key)) {
//             map.set(key, {
//               rangeStart: groupStart,
//               rangeEnd: groupEnd,
//               notional: 0,
//               contracts: 0,
//               shares: 0,
//               direction,
//               items: [],
//             });
//           }

//           const group = map.get(key)!;
//           group.notional += item.calculated_notional;
//           group.contracts += item.outstanding_quantity;
//           group.shares += item.shares_number;
//           group.items.push(item);
//         });

//       // Заполнение groupedMap по финальному ключу
//       for (const [key, group] of map.entries()) {
//         groupedMap[key] = {
//           group: {
//             rangeStart: group.rangeStart,
//             rangeEnd: group.rangeEnd,
//             notional: group.notional,
//             contracts: group.contracts,
//             shares: group.shares,
//             direction: group.direction,
//           },
//           items: group.items,
//         };
//       }

//       return Array.from(map.values()).sort((a, b) =>
//         direction === "Bull"
//           ? b.rangeStart - a.rangeStart
//           : a.rangeStart - b.rangeStart
//       );
//     };

//     const bullGroups = createGroupMap("Bull");
//     const bearGroups = createGroupMap("Bear");

//     return { bullGroups, bearGroups, groupedMap };
//   }, [rawData, issuer, underlying, price, range]);

//   useEffect(() => {
//     setGroupedData(grouped.bullGroups, grouped.bearGroups);
//     setGroupedMap(grouped.groupedMap);
//   }, [grouped, setGroupedData, setGroupedMap]);

//   return {
//     bullGroups: grouped.bullGroups,
//     bearGroups: grouped.bearGroups,
//   };
// }

import { useCBBCStore } from "@/store/cbbc";
import { GroupedCBBC } from "@/store/types";
import { useEffect, useMemo } from "react";

export function useGroupedCBBC() {
  const { rawData, filters, setGroupedData, setGroupedMap } = useCBBCStore();
  const { groupBy, price, issuer, underlying } = filters;

  const range = groupBy ?? 0;

  const { bullGroups, bearGroups, groupedMap } = useMemo(() => {
    if (!groupBy) {
      return {
        bullGroups: [],
        bearGroups: [],
        groupedMap: {},
      };
    }

    const filtered = rawData.filter((item) => {
      const matchIssuer = !issuer?.length || issuer.includes(item.issuer);
      const matchUnderlying = !underlying || item.underlying === underlying;
      const matchRange =
        price == null || Math.abs(item.call_level - price) <= range;
      return matchIssuer && matchUnderlying && matchRange;
    });

    const round = (val: number, group: number) =>
      Math.floor(val / group) * group;

    const groupedMap: Record<string, { group: GroupedCBBC; items: any[] }> = {};

    const createGroupMap = (direction: "Bull" | "Bear") => {
      const map = new Map<string, GroupedCBBC & { items: any[] }>();

      filtered
        .filter((item) => item.bull_bear === direction)
        .forEach((item) => {
          const base = round(item.call_level, range);
          const groupStart = direction === "Bear" ? base : base - range + 1;
          const groupEnd = groupStart + range - 1;
          const key = `${direction}-${groupStart}–${groupEnd}`; // en dash

          if (!map.has(key)) {
            map.set(key, {
              rangeStart: groupStart,
              rangeEnd: groupEnd,
              notional: 0,
              contracts: 0,
              shares: 0,
              direction,
              issuer: item.issuer ?? "N/A",
              items: [],
            });
          }
          const group = map.get(key)!;
          group.notional += item.calculated_notional;
          group.contracts += item.outstanding_quantity;
          group.shares += item.shares_number;
          group.items.push(item);
        });

      for (const [key, group] of map.entries()) {
        groupedMap[key] = {
          group: {
            rangeStart: group.rangeStart,
            rangeEnd: group.rangeEnd,
            notional: group.notional,
            contracts: group.contracts,
            shares: group.shares,
            direction: group.direction,
          },
          items: group.items,
        };
      }

      return Array.from(map.values()).sort((a, b) =>
        direction === "Bull"
          ? b.rangeStart - a.rangeStart
          : a.rangeStart - b.rangeStart
      );
    };

    const bullGroups = createGroupMap("Bull");
    const bearGroups = createGroupMap("Bear");

    return { bullGroups, bearGroups, groupedMap };
  }, [rawData, issuer, underlying, price, range, groupBy]);

  useEffect(() => {
    if (!groupBy) {
      setGroupedData([], []);
      setGroupedMap({});
    } else {
      setGroupedData(bullGroups, bearGroups);
      setGroupedMap(groupedMap);
    }
  }, [
    groupBy,
    bullGroups,
    bearGroups,
    groupedMap,
    setGroupedData,
    setGroupedMap,
  ]);

  return { bullGroups, bearGroups };
}
