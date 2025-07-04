"use client";

import { NotionalLegend } from "./CBBCTable/NotionalLegend";
import IssuerSelect from "./IssuerSelect";

type SelectOption = { label: string; value: string };

export default function CBBCDashboardStats({
  from,
  to,
  issuerOptions,
  selectedIssuers,
  onIssuerChange,
}: {
  from?: string;
  to?: string;
  issuerOptions: SelectOption[];
  selectedIssuers: string[];
  onIssuerChange: (values: string[]) => void;
}) {
  return (
    <div className="bg-white border rounded shadow p-6 mb-6">
      <div className="text-sm text-gray-500 mb-6">
        Showing data from <strong>{from}</strong> to <strong>{to}</strong>
      </div>

      <div className="grid grid-cols-1 md:flex md:items-end md:justify-between gap-4 ">
        <div className="" style={{ minWidth: "300px" }}>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Issuers
          </label>
          <IssuerSelect
            issuerOptions={issuerOptions}
            selectedIssuers={selectedIssuers}
            onChange={onIssuerChange}
          />
        </div>

        <div className="md:ml-4">
          <NotionalLegend />
        </div>
      </div>
    </div>
  );
}
