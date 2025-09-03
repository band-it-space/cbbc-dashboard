import { useMemo } from "react";
import { SingleDateCBBCItem } from "./useSingleDateCBBCQuery";
import { GroupedBackendCBBC, GroupedCBBCEntry } from "@/store/groupedCBBCTypes";

/**
 * Преобразует single-date данные в формат, совместимый с группированными компонентами
 */
export function useSingleDateMatrixData(
  singleDateData: SingleDateCBBCItem[] | undefined
) {
  const result = useMemo(() => {
    if (!singleDateData || !Array.isArray(singleDateData)) {
      return {
        dateList: [],
        displayDateList: [],
        prevDate: undefined,
        rangeList: [],
        bullMatrix: {},
        bearMatrix: {},
        priceByDate: {},
      };
    }

    console.log("🔍 [useSingleDateMatrixData] Starting processing:", {
      dataLength: singleDateData.length,
      data: singleDateData,
    });

    // Преобразуем single-date данные в формат GroupedBackendCBBC
    const groupedData: GroupedBackendCBBC[] = singleDateData.map((item) => {
      // Преобразуем cbcc_list в формат GroupedCBBCEntry
      const cbccEntries: GroupedCBBCEntry[] = item.cbcc_list.map((entry) => ({
        code: entry.code.toString(),
        call_level: parseFloat(entry.range),
        quantity: entry.outstanding_quantity,
        notional: entry.calculated_notional,
        shares_number: entry.shares,
        ul_price: entry.ul_price,
        issuer: entry.issuer,
        bull_bear: entry.bull_bear,
        date: item.date,
        os_percent: parseFloat(entry.os_percent),
        last_price: parseFloat(entry.last_price),
        divisor: parseFloat(entry.divisor),
        type: "index", // По умолчанию, можно определить по underlying
      }));

      return {
        date: item.date,
        range: item.call_level, // Используем call_level как range
        outstanding_quantity: item.outstanding_quantity,
        calculated_notional: item.calculated_notional,
        cbcc_list: cbccEntries,
      };
    });

    // Теперь используем ту же логику, что и в useCBBCMatrixData
    const dates: string[] = [];
    const ranges = new Set<string>();
    const priceByDate: Record<string, number> = {};

    // Собираем уникальные даты и диапазоны
    for (const row of groupedData) {
      const { date, range, cbcc_list } = row;

      ranges.add(range);
      if (!dates.includes(date)) dates.push(date);

      // Получаем цену андерлайна, если есть данные
      if (
        !priceByDate[date] &&
        Array.isArray(cbcc_list) &&
        cbcc_list.length > 0
      ) {
        priceByDate[date] = cbcc_list[0].ul_price;
      }
    }

    const sortedDates = dates.sort((a, b) => b.localeCompare(a));

    // Сортируем диапазоны как в группированной таблице
    const allRanges = Array.from(ranges);
    const parsed = allRanges
      .map((r) => {
        const callLevel = parseFloat(r);
        return { key: r, from: callLevel };
      })
      .sort((a, b) => a.from - b.from);

    // Используем цену первой даты как референсную
    const refPrice =
      sortedDates.length > 0 ? priceByDate[sortedDates[0]] ?? 30 : 30;

    console.log("💰 [useSingleDateMatrixData] Price analysis:", {
      refPrice,
      priceByDate,
      sortedDates,
      allRanges: parsed.map((r) => ({ range: r.key, value: r.from })),
    });

    const bear = parsed
      .filter((r) => r.from >= refPrice)
      .map((r) => r.key)
      .reverse();
    const bull = parsed
      .filter((r) => r.from < refPrice)
      .map((r) => r.key)
      .reverse();

    const sortedRanges = [...bear, ...bull];

    console.log("📊 [useSingleDateMatrixData] Range categorization:", {
      bear: bear.map((r) => ({ range: r, value: parseFloat(r) })),
      bull: bull.map((r) => ({ range: r, value: parseFloat(r) })),
      sortedRanges,
    });

    // Создаем матрицы
    const bullMatrix: Record<string, Record<string, any>> = {};
    const bearMatrix: Record<string, Record<string, any>> = {};

    // Инициализируем матрицы
    for (const range of sortedRanges) {
      bullMatrix[range] = {};
      bearMatrix[range] = {};
      for (const date of sortedDates) {
        bullMatrix[range][date] = {
          notional: 0,
          quantity: 0,
          shares: 0,
          codes: [],
          items: [],
        };
        bearMatrix[range][date] = {
          notional: 0,
          quantity: 0,
          shares: 0,
          codes: [],
          items: [],
        };
      }
    }

    // Заполняем матрицы данными
    for (const row of groupedData) {
      const { date, range, cbcc_list } = row;

      // Обрабатываем случай, когда cbcc_list не является массивом или пустой
      if (!Array.isArray(cbcc_list) || cbcc_list.length === 0) {
        // Убеждаемся, что ячейки инициализированы с нулевыми значениями
        if (
          !bullMatrix[range][date].notional &&
          !bearMatrix[range][date].notional
        ) {
          bullMatrix[range][date] = {
            notional: 0,
            quantity: 0,
            shares: 0,
            codes: [],
            items: [],
          };
          bearMatrix[range][date] = {
            notional: 0,
            quantity: 0,
            shares: 0,
            codes: [],
            items: [],
          };
        }
        continue;
      }

      // Данные уже отфильтрованы в useDashboardData, используем cbcc_list как есть
      for (const cbcc of cbcc_list) {
        const type = cbcc.bull_bear?.trim();
        if (!type || (type !== "Bull" && type !== "Bear")) {
          console.log(
            "⚠️ [useSingleDateMatrixData] Skipping CBBC with invalid type:",
            {
              code: cbcc.code,
              type: cbcc.bull_bear,
              range,
              date,
            }
          );
          continue;
        }

        // Определяем, в какую секцию должен попасть этот диапазон
        const rangeValue = parseFloat(range);
        const isRangeAbovePrice = rangeValue >= refPrice;

        // Определяем, в какую секцию должен попасть этот CBBC
        const isCBBCBull = type === "Bull";

        // CBBC попадает в матрицу только если:
        // 1. Bull CBBC в диапазоне ниже цены (bull секция)
        // 2. Bear CBBC в диапазоне выше цены (bear секция)
        const shouldShowInBull = isCBBCBull && !isRangeAbovePrice;
        const shouldShowInBear = !isCBBCBull && isRangeAbovePrice;

        if (shouldShowInBull) {
          const cell = bullMatrix[range][date];
          cell.notional += cbcc.notional;
          cell.quantity += cbcc.quantity;
          cell.shares += Math.round(cbcc.shares_number * 100) / 100;
          cell.codes.push(cbcc.code.toString());
          cell.items.push({ ...cbcc, date });
        } else if (shouldShowInBear) {
          const cell = bearMatrix[range][date];
          cell.notional += cbcc.notional;
          cell.quantity += cbcc.quantity;
          cell.shares += Math.round(cbcc.shares_number * 100) / 100;
          cell.codes.push(cbcc.code.toString());
          cell.items.push({ ...cbcc, date });
        }
      }
    }

    // Создаем displayDateList как в группированной таблице
    let displayDateList: string[] = [];
    let prevDate: string | undefined = undefined;

    if (sortedDates.length === 0) {
      displayDateList = sortedDates;
    } else {
      const activeDate = sortedDates[0]; // Первая дата - активная
      const previousDates = sortedDates.slice(1); // Остальные даты
      displayDateList = [activeDate, activeDate, ...previousDates]; // Дублируем активную дату
    }

    if (sortedDates.length >= 2) {
      prevDate = sortedDates[1]; // Вторая дата - предыдущая
    }

    // Создаем список диапазонов только с данными
    const rangesWithData = new Set<string>();
    for (const range of sortedRanges) {
      for (const date of sortedDates) {
        const bullCell = bullMatrix[range]?.[date];
        const bearCell = bearMatrix[range]?.[date];

        if (
          bullCell &&
          (bullCell.notional > 0 ||
            bullCell.quantity > 0 ||
            bullCell.shares > 0)
        ) {
          rangesWithData.add(range);
        }
        if (
          bearCell &&
          (bearCell.notional > 0 ||
            bearCell.quantity > 0 ||
            bearCell.shares > 0)
        ) {
          rangesWithData.add(range);
        }
      }
    }

    // Фильтруем диапазоны, оставляя только те, в которых есть данные
    const filteredRanges = sortedRanges.filter((range) =>
      rangesWithData.has(range)
    );

    return {
      dateList: sortedDates,
      displayDateList,
      prevDate,
      rangeList: filteredRanges,
      bullMatrix,
      bearMatrix,
      priceByDate,
    };
  }, [singleDateData]);

  return result;
}
