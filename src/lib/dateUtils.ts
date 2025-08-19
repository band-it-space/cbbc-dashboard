/**
 * Утилитарные функции для работы с датами в торговых системах
 */

/**
 * Возвращает последний торговый день (исключая выходные)
 * Если сегодня воскресенье -> возвращает пятницу
 * Если сегодня суббота -> возвращает пятницу
 * Если сегодня пятница -> возвращает четверг
 * Если сегодня будний день -> возвращает вчерашний день
 */
export function getLastTradingDay(): string {
  const today = new Date();
  const checkDate = new Date(today);

  // Начинаем с вчерашнего дня
  checkDate.setDate(today.getDate() - 1);

  // Продолжаем искать назад, пока не найдем рабочий день (понедельник-пятница)
  while (checkDate.getDay() === 0 || checkDate.getDay() === 6) {
    // 0 = воскресенье, 6 = суббота
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return checkDate.toISOString().slice(0, 10);
}

/**
 * Возвращает дату, которая на 2 дня раньше указанной даты
 * Используется для расчета диапазона дат (from - to)
 */
export function getFromDate(dateStr: string): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - 2);
  return date.toISOString().slice(0, 10);
}

/**
 * Проверяет, является ли день торговым (понедельник-пятница)
 */
export function isTradingDay(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek >= 1 && dayOfWeek <= 5; // 1 = понедельник, 5 = пятница
}

/**
 * Форматирует дату для отображения пользователю
 */
export function formatDisplayDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString();
}
