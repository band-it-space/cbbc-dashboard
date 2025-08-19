import React from "react";
import { formatCurrencyPair } from "@/lib/utils";

interface Props {
  bullTotal: number;
  bearTotal: number;
  currentPrice: number;
  underlyingCode: string;
  hiddenBearRanges?: number;
  hiddenBullRanges?: number;
}

export default function CBBCMidSummary({
  bullTotal,
  bearTotal,
  currentPrice,
  underlyingCode,
  hiddenBearRanges = 0,
  hiddenBullRanges = 0,
}: Props) {
  const total = bullTotal + bearTotal;
  const bullPercent = total ? ((bullTotal / total) * 100).toFixed(1) : "0";
  const bearPercent = total ? ((bearTotal / total) * 100).toFixed(1) : "0";
  const ratio = bearTotal === 0 ? "∞" : (bullTotal / bearTotal).toFixed(1);

  const bullCurrency = formatCurrencyPair(bullTotal, underlyingCode);
  const bearCurrency = formatCurrencyPair(bearTotal, underlyingCode);

  return (
    <div className="flex items-center justify-center gap-6 bg-yellow-100 text-sm font-semibold py-2 rounded border border-yellow-300 col-span-full">
      <span className="text-gray-800">Price: {currentPrice.toFixed(2)}</span>
      <span className="text-green-700">
        <div className="flex flex-col items-center">
          <span>
            Bull Total: {bullCurrency.hkd} ({bullPercent}%)
          </span>
          <span className="text-xs text-gray-600">{bullCurrency.usd}</span>
        </div>
      </span>
      <span className="text-red-700">
        <div className="flex flex-col items-center">
          <span>
            Bear Total: {bearCurrency.hkd} ({bearPercent}%)
          </span>
          <span className="text-xs text-gray-600">{bearCurrency.usd}</span>
        </div>
      </span>
      <span className="text-gray-600">Ratio: {ratio} : 1</span>
      {(hiddenBearRanges > 0 || hiddenBullRanges > 0) && (
        <span className="text-blue-600 text-xs">
          Hidden: {hiddenBearRanges} Bear, {hiddenBullRanges} Bull ranges
        </span>
      )}
    </div>
  );
}
