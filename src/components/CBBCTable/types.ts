export type CBBCItem = {
  code: string;
  level: number;
  gearing: number;
  conversion_ratio: number;
};

export type AggregatedCell = {
  notional: number;
  quantity: number;
  shares: number;
  codes: string[];
  items: CBBCItem[];
};

export type MatrixData = Record<string, Record<string, AggregatedCell>>;
