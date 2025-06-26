const buckets = [
  { label: "1 - 1M", color: "#ffffff", min: 1, max: 1_000_000 },
  { label: "1M - 50M", color: "#feedd9", min: 1_000_000, max: 50_000_000 },
  { label: "50M - 100M", color: "#fdd9b5", min: 50_000_000, max: 100_000_000 },
  { label: ">100M", color: "#fdc181", min: 100_000_000, max: Infinity },
];

export function NotionalLegend() {
  return (
    <div className="flex items-center gap-2 text-sm my-2">
      <span className="font-semibold">Outstanding Notional (USD):</span>
      {buckets.map((b, i) => (
        <span key={i} className="flex items-center gap-1">
          <span
            className="inline-block w-4 h-4 border"
            style={{ backgroundColor: b.color }}
          />
          {b.label}
        </span>
      ))}
    </div>
  );
}

export function getNotionalColor(value: number) {
  for (const b of buckets) {
    if (value >= b.min && value < b.max) return b.color;
  }
  return "#ffffff";
}
