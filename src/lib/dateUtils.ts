/**
 * Утилитарные функции для работы с датами в торговых системах
 *
 * Особенности логики:
 * - Выходные дни (суббота, воскресенье) автоматически отключаются
 * - В понедельник автоматически загружаются данные за пятницу предыдущей недели
 * - Все функции учитывают рабочие дни и исключают выходные
 */

/**
 * Возвращает последний торговый день (исключая выходные)
 * Логика:
 * - Если сегодня понедельник -> возвращает пятницу предыдущей недели
 * - Если сегодня выходной (суббота/воскресенье) -> возвращает пятницу
 * - Если сегодня будний день -> возвращает вчерашний день (но не выходной)
 */
export function getLastTradingDay(): string {
  const today = new Date();
  const currentDate = new Date(today);

  // Если сегодня понедельник (1), возвращаем пятницу предыдущей недели
  if (currentDate.getDay() === 1) {
    // Идем назад до пятницы (5)
    while (currentDate.getDay() !== 5) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return currentDate.toISOString().split("T")[0];
  }

  // Если сегодня выходной (суббота/воскресенье), возвращаем пятницу
  if (isWeekend(currentDate)) {
    // Идем назад до пятницы (5)
    while (currentDate.getDay() !== 5) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return currentDate.toISOString().split("T")[0];
  }

  // Если сегодня будний день, возвращаем вчерашний день
  currentDate.setDate(currentDate.getDate() - 1);

  // Если вчера был выходной, идем дальше назад до пятницы
  while (isWeekend(currentDate)) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return currentDate.toISOString().split("T")[0];
}

/**
 * Возвращает дату, которая на 2 дня раньше указанной даты
 * Используется для расчета диапазона дат (from - to)
 * Учитывает рабочие дни (исключает выходные)
 */
export function getFromDate(dateStr: string): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - 2);

  // Убеждаемся, что полученная дата не является выходным днем
  while (isWeekend(date)) {
    date.setDate(date.getDate() - 1);
  }

  // Если получилась дата понедельника, идем назад до пятницы предыдущей недели
  if (date.getDay() === 1) {
    while (date.getDay() !== 5) {
      date.setDate(date.getDate() - 1);
    }
  }

  return date.toISOString().slice(0, 10);
}

/**
 * Проверяет, является ли день торговым (понедельник-пятница)
 */
export function isTradingDay(date: Date): boolean {
  return !isWeekend(date);
}

/**
 * Форматирует дату для отображения пользователю
 */
export function formatDisplayDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString();
}

/**
 * Проверяет, является ли дата выходным днем (суббота или воскресенье)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = воскресенье, 6 = суббота
}

/**
 * Проверяет, является ли дата выходным днем по строке
 */
export function isWeekendString(dateString: string): boolean {
  return isWeekend(new Date(dateString));
}

/**
 * Получает следующий рабочий день
 */
export function getNextWorkday(date: Date): Date {
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);

  while (isWeekend(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }

  return nextDay;
}

/**
 * Получает предыдущий рабочий день
 */
export function getPreviousWorkday(date: Date): Date {
  const prevDay = new Date(date);
  prevDay.setDate(date.getDate() - 1);

  while (isWeekend(prevDay)) {
    prevDay.setDate(prevDay.getDate() - 1);
  }

  return prevDay;
}

/**
 * Получает последний рабочий день (сегодня или предыдущий рабочий день)
 * Если сегодня понедельник -> возвращает пятницу предыдущей недели
 * Если сегодня выходной -> возвращает предыдущий рабочий день
 */
export function getLastWorkday(): string {
  const today = new Date();
  const currentDate = new Date(today);

  // Если сегодня понедельник (1), возвращаем пятницу предыдущей недели
  if (currentDate.getDay() === 1) {
    // Идем назад до пятницы (5)
    while (currentDate.getDay() !== 5) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return currentDate.toISOString().split("T")[0];
  }

  // Если сегодня выходной, ищем предыдущий рабочий день
  while (isWeekend(currentDate)) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return currentDate.toISOString().split("T")[0];
}

/**
 * Проверяет, является ли сегодня понедельником
 */
export function isMonday(): boolean {
  const today = new Date();
  return today.getDay() === 1; // 1 = понедельник
}

/**
 * Проверяет, является ли дата понедельником
 */
export function isMondayDate(date: Date): boolean {
  return date.getDay() === 1; // 1 = понедельник
}

/**
 * Проверяет, можно ли выбрать дату (не выходной)
 */
export function shouldDisableDate(date: Date): boolean {
  return isWeekend(date);
}
