"use client";

import CBBCMetricsTable from "@/components/CBBCMetricsTable";
import FiltersPanel from "@/components/FiltersPanel";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">CBBC Dashboard</h1>

      <div className="mb-4">
        <FiltersPanel />
      </div>

      <CBBCMetricsTable />
    </div>
  );
}
