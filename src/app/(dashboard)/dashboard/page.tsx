"use client";

import { useEffect, useMemo, useState } from "react";
import GroupedCBBCMetricsTable from "@/components/CBBCGroupedTable";
import FiltersPanel from "@/components/FiltersPanel";
import { useCBBCQuery } from "@/hooks/useCBBCQuery";
import { useCBBCStore } from "@/store/cbbc";
import { useGroupedCBBC } from "@/hooks/useGroupedCBBC";

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

  useEffect(() => {
    if (localFilters.date !== filters.date) {
      const resetFilters = {
        date: localFilters.date,
        underlying: undefined,
        range: undefined,
        issuer: [],
        groupBy: null,
      };

      setLocalFilters(resetFilters);
      setFilters(resetFilters);

      setGroupedData([], []);
      refetch();
    }
  }, [filters.date, localFilters.date, refetch, setFilters, setGroupedData]);

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

  const rows = isGrouped
    ? [
        ...bearGroups.map((g) => ({
          groupKey: `Bear-${g.rangeStart}–${g.rangeEnd}`,
          notional: g.notional,
          shares: g.shares,
          quantity: g.contracts,
        })),
        ...bullGroups.map((g) => ({
          groupKey: `Bull-${g.rangeStart}–${g.rangeEnd}`,
          notional: g.notional,
          shares: g.shares,
          quantity: g.contracts,
        })),
      ]
    : rawData
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
          notional: item.calculated_notional,
          shares: item.shares_number,
          quantity: item.outstanding_quantity,
        }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">CBBC Dashboard</h1>
      <div className="mb-4">
        <FiltersPanel
          filters={localFilters}
          issuers={issuers}
          underlyings={underlyings}
          onChange={handleFilterChange}
        />
      </div>
      <GroupedCBBCMetricsTable rows={rows} isFetching={isFetching} />
    </div>
  );
}
