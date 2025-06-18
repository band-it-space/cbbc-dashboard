"use client";

import { useEffect, useMemo, useState } from "react";
import GroupedCBBCMetricsTable from "@/components/CBBCGroupedTable";
import FiltersPanel from "@/components/FiltersPanel";
import { useCBBCQuery } from "@/hooks/useCBBCQuery";
import { useCBBCStore } from "@/store/cbbc";
import { useGroupedCBBC } from "@/hooks/useGroupedCBBC";
import CBBCDashboardStats from "@/components/CBBCDashboardStats";

export default function DashboardPage() {
  const { isFetching, refetch } = useCBBCQuery();
  const { filters, setFilters, underlyings, issuers, rawData, setGroupedData } =
    useCBBCStore();

  const grouped = useGroupedCBBC();

  const bullGroups = useMemo(
    () => grouped?.bullGroups ?? [],
    [grouped?.bullGroups]
  );
  const bearGroups = useMemo(
    () => grouped?.bearGroups ?? [],
    [grouped?.bearGroups]
  );

  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (bullGroups.length > 0 || bearGroups.length > 0) {
      setGroupedData(bullGroups, bearGroups);
    }
  }, [bullGroups, bearGroups, setGroupedData]);

  const handleRefresh = () => {
    const resetFilters = {
      from: localFilters.from,
      to: localFilters.to,
      underlying: undefined,
      range: undefined,
      issuer: [],
      groupBy: null,
    };

    setLocalFilters(resetFilters); // для UI
    setFilters(resetFilters); // для store
    setGroupedData([], []);
    refetch();
  };

  const handleFilterReset = () => {
    const resetFilters = {
      from: localFilters.from,
      to: localFilters.to,
      underlying: undefined,
      range: undefined,
      issuer: [],
      groupBy: null,
    };

    setLocalFilters(resetFilters); // для UI
    setFilters(resetFilters); // для store
    setGroupedData([], []);
  };

  const handleFilterChange = (field: string, value: any) => {
    const updated = {
      ...localFilters,
      [field]: value,
    };

    setLocalFilters(updated);

    if (field !== "date") {
      setFilters(updated);
    }
  };

  const isGrouped = localFilters.groupBy != null;

  const rows = useMemo(() => {
    if (isGrouped) {
      return [
        ...grouped.bearGroups.map((g) => ({
          groupKey: `Bear-${g.rangeStart}–${g.rangeEnd}`,
          callLevel: g.rangeStart,
          issuer: g.issuer ?? "N/A", // 👈 обязательно
          notional: g.notional,
          shares: g.shares,
          quantity: g.contracts,
          direction: "Bear" as const,
          sortKey: g.rangeStart,
          rangeStart: g.rangeStart,
          rangeEnd: g.rangeEnd,
        })),
        ...grouped.bullGroups.map((g) => ({
          groupKey: `Bull-${g.rangeStart}–${g.rangeEnd}`,
          callLevel: g.rangeStart,
          issuer: g.issuer ?? "N/A", // 👈 обязательно
          notional: g.notional,
          shares: g.shares,
          quantity: g.contracts,
          direction: "Bull" as const,
          sortKey: g.rangeStart,
          rangeStart: g.rangeStart,
          rangeEnd: g.rangeEnd,
        })),
      ];
    }

    return rawData
      .filter((item) => {
        const matchIssuer =
          !localFilters.issuer?.length ||
          localFilters.issuer.includes(item.issuer);
        const matchUnderlying =
          !localFilters.underlying ||
          item.underlying === localFilters.underlying;
        const matchRange =
          localFilters.price == null ||
          Math.abs(item.call_level - localFilters.price) <=
            (localFilters.range || 200);
        return matchIssuer && matchUnderlying && matchRange;
      })
      .map((item) => ({
        groupKey: `${item.call_level} ${
          item.bull_bear === "Bull" ? "(Bull)" : "(Bear)"
        }`,
        callLevel: parseFloat(item.call_level),

        notional: item.calculated_notional,
        shares: item.shares_number,
        quantity: item.outstanding_quantity,
        issuer: item.issuer,
        direction: item.bull_bear as "Bull" | "Bear",
        rangeStart: item.rangeStart, // 👈 добавлено
        rangeEnd: item.rangeEnd, // 👈 добавлено
      }));
  }, [isGrouped, grouped, rawData, localFilters]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">CBBC Dashboard</h1>
      <div className="mb-4">
        <FiltersPanel
          filters={localFilters}
          issuers={issuers}
          underlyings={underlyings}
          setLocalFilters={setLocalFilters}
          onChange={handleFilterChange}
          handleRefresh={handleRefresh}
          handleFilterReset={handleFilterReset}
        />
      </div>
      <CBBCDashboardStats rows={rows} />
      <GroupedCBBCMetricsTable rows={rows} isFetching={isFetching} />
    </div>
  );
}
