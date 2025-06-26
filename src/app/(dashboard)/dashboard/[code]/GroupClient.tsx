"use client";

import { useGroupedCBBCStore } from "@/store/groupedCBBCStore";
import BBCDetailTable from "@/components/BBCDetailTable";

export default function GroupClient({ groupKey }: { groupKey: string }) {
  const rawKey = decodeURIComponent(groupKey);
  const { groupedMap, rawData } = useGroupedCBBCStore();

  if (Object.keys(groupedMap).length === 0 && rawData.length === 0) {
    return <p className="text-gray-500 p-4">Loading data...</p>;
  }

  const groupData = groupedMap[rawKey];
  if (groupData) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Group: {rawKey}</h2>
        <BBCDetailTable items={groupData.items} />
      </div>
    );
  }

  const singleMatch = rawKey.match(/^([\d.]+) \((Bull|Bear)\)$/);
  if (singleMatch) {
    const [, levelStr, type] = singleMatch;
    const level = parseFloat(levelStr);
    const match = rawData.find(
      (item) =>
        item.call_level === level &&
        item.bull_bear.toLowerCase() === type.toLowerCase()
    );

    if (match) {
      return (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">
            Detail: {match.call_level} ({match.bull_bear})
          </h2>
          <BBCDetailTable items={[match]} />
        </div>
      );
    }
  }

  return (
    <p className="text-red-500 p-4">
      Invalid group key: <code>{rawKey}</code>
    </p>
  );
}
