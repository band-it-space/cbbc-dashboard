import React from "react";

interface Props {
  bullTotal: number;
  bearTotal: number;
  currentPrice: number;
}

export default function CBBCMidSummary({
  bullTotal,
  bearTotal,
  currentPrice,
}: Props) {
  const total = bullTotal + bearTotal;
  const bullPercent = total ? ((bullTotal / total) * 100).toFixed(1) : "0";
  const bearPercent = total ? ((bearTotal / total) * 100).toFixed(1) : "0";
  const ratio = bearTotal === 0 ? "∞" : (bullTotal / bearTotal).toFixed(1);

  return (
    <div className="flex items-center justify-center gap-6 bg-yellow-100 text-sm font-semibold py-2 rounded border border-yellow-300 col-span-full">
      <span className="text-gray-800">Price: {currentPrice.toFixed(2)}</span>
      <span className="text-green-700">
        Bull Total: {bullTotal.toLocaleString()} ({bullPercent}%)
      </span>
      <span className="text-red-700">
        Bear Total: {bearTotal.toLocaleString()} ({bearPercent}%)
      </span>
      <span className="text-gray-600">Ratio: {ratio} : 1</span>
    </div>
  );
}
