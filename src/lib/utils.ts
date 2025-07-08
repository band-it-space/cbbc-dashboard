export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function toAbbreviatedNumber(value: number): string {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return value.toString();
}

export function formatDiff(diff: number): string {
  const abs = Math.abs(diff);
  let formatted: string;
  if (abs >= 1_000_000) {
    formatted = (abs / 1_000_000).toFixed(1) + "M";
  } else if (abs >= 1_000) {
    formatted = (abs / 1_000).toFixed(1) + "K";
  } else {
    formatted = abs.toFixed(1);
  }
  return (diff > 0 ? "+" : diff < 0 ? "-" : "") + formatted;
}

export function formatDateHuman(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getSortedUnderlyings(
  underlyings: { code: string; name: string }[],
  priorityCodes: string[]
): typeof underlyings {
  return [...underlyings].sort((a, b) => {
    const indexA = priorityCodes.indexOf(a.code);
    const indexB = priorityCodes.indexOf(b.code);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.name.localeCompare(b.name);
  });
}

export function formatUnderlyingCode(code: string): string {
  // Если код содержит буквы (HSI, HSCEI, HSTEC), возвращаем как есть
  if (/[A-Z]/.test(code)) {
    return code;
  }
  // Для цифровых кодов добавляем нули до 5 символов
  return code.padStart(5, "0");
}
