"use client";

import dynamic from "next/dynamic";
import type { Props as SelectProps } from "react-select";

const Select = dynamic<SelectProps<any, true>>(
  () => import("react-select") as any,
  { ssr: false }
);

type SelectOption = { label: string; value: string };

export default function IssuerSelect({
  issuerOptions,
  selectedIssuers,
  onChange,
}: {
  issuerOptions: SelectOption[];
  selectedIssuers: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <Select
      isMulti
      options={issuerOptions}
      value={issuerOptions.filter((opt) => selectedIssuers.includes(opt.value))}
      onChange={(selected) =>
        onChange((selected ?? []).map((opt) => opt.value))
      }
      className="react-select-container border border-blue-800 rounded"
      classNamePrefix="react-select"
    />
  );
}
