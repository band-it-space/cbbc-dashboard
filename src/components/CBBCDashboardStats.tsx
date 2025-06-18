import { useMemo } from "react";
import { useCBBCStore } from "@/store/cbbc";

export default function CBBCDashboardStats({ rows }: { rows: any[] }) {
  const { filters } = useCBBCStore();

  const totalNotional = useMemo(
    () => rows.reduce((sum, row) => sum + row.notional, 0),
    [rows]
  );
  const totalContracts = useMemo(
    () => rows.reduce((sum, row) => sum + row.quantity, 0),
    [rows]
  );

  const topIssuer = useMemo(() => {
    const count: Record<string, number> = {};
    rows.forEach((r: any) => {
      count[r.issuer] = (count[r.issuer] || 0) + 1;
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  }, [rows]);

  return (
    <div className="bg-white border rounded shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-800 mb-4">
        <div>
          🧾 Total Items: <strong>{rows.length}</strong>
        </div>
        <div>
          💰 Notional: <strong>{totalNotional.toLocaleString()}</strong>
        </div>
        <div>
          📄 Contracts: <strong>{totalContracts.toLocaleString()}</strong>
        </div>
        <div>
          🏢 Top Issuer: <strong>{topIssuer}</strong>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-2">
        Showing data from <strong>{filters.from}</strong> to{" "}
        <strong>{filters.to}</strong>
        {filters.groupBy ? (
          <>
            {" "}
            | Group step: <strong>{filters.groupBy} pts</strong>
          </>
        ) : null}
      </div>
    </div>
  );
}
