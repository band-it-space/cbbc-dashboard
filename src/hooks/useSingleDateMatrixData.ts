import { useMemo } from "react";
import { SingleDateCBBCItem } from "./useSingleDateCBBCQuery";
import { GroupedBackendCBBC, GroupedCBBCEntry } from "@/store/groupedCBBCTypes";

/**
 * Преобразует single-date данные в формат, совместимый с группированными компонентами
 */
export function useSingleDateMatrixData(
  singleDateData: SingleDateCBBCItem[] | undefined,
  selectedIssuers: string[] = []
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

    const bear = parsed
      .filter((r) => r.from >= refPrice)
      .map((r) => r.key)
      .reverse();
    const bull = parsed
      .filter((r) => r.from < refPrice)
      .map((r) => r.key)
      .reverse();

    const sortedRanges = [...bear, ...bull];

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

      const filteredList: GroupedCBBCEntry[] =
        Array.isArray(selectedIssuers) && selectedIssuers.length > 0
          ? cbcc_list.filter((cbcc: GroupedCBBCEntry) =>
              selectedIssuers.includes(cbcc.issuer)
            )
          : cbcc_list;

      if (filteredList.length === 0) {
        // Если после фильтрации нет данных, оставляем ячейки с нулевыми значениями
        continue;
      }

      for (const cbcc of filteredList) {
        const type = cbcc.bull_bear?.trim();
        if (!type || (type !== "Bull" && type !== "Bear")) {
          continue;
        }

        const cell =
          type === "Bull" ? bullMatrix[range][date] : bearMatrix[range][date];
        cell.notional += cbcc.notional;
        cell.quantity += cbcc.quantity;
        // Используем shares_number как есть для всех типов
        cell.shares += Math.round(cbcc.shares_number * 100) / 100;

        cell.codes.push(cbcc.code.toString());
        cell.items.push({ ...cbcc, date });
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

    return {
      dateList: sortedDates,
      displayDateList,
      prevDate,
      rangeList: sortedRanges,
      bullMatrix,
      bearMatrix,
      priceByDate,
    };
  }, [singleDateData, selectedIssuers]);

  return result;
}
