"use client";

export default function CBBCMatrixHeader({ dateList }: { dateList: string[] }) {
  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <thead>
      <tr>
        <th
          className="p-2 border border-gray-300 bg-gray-50 text-center font-bold"
          rowSpan={1}
        >
          Call Range
        </th>
        <th
          className="p-2 border border-gray-300 bg-gray-50 text-center font-bold"
          style={{ minWidth: 80 }}
        >
          Notional
        </th>
        <th
          className="p-2 border border-gray-300 bg-gray-50 text-center font-bold"
          style={{ minWidth: 80 }}
        >
          Quantity
        </th>
        <th
          className="p-2 border border-gray-300 bg-gray-50 text-center font-bold"
          style={{ minWidth: 80 }}
        >
          Codes
        </th>
        {dateList.slice(1, 4).map((date) => (
          <th
            key={date}
            className="p-2 border border-gray-300 bg-gray-50 text-center font-bold"
          >
            {formatDate(date)}
          </th>
        ))}
      </tr>
    </thead>
  );
}
