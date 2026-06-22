import { ChevronDown } from "lucide-react";

// type filters map labels -> the doc_type values in the mock data
export const TYPE_FILTERS = [
  { key: "all", label: "All files", types: null },
  { key: "contracts", label: "Lease / Contracts", types: ["Tenant Contract"] },
  { key: "invoices", label: "Invoices", types: ["Invoice"] },
  { key: "repairs", label: "Repair docs", types: ["Repair Document"] },
  { key: "payments", label: "Payment records", types: ["Payment Record"] },
  { key: "building", label: "Building docs", types: ["Building Document"] },
];

export const SORT_OPTIONS = [
  { key: "uploaded", label: "Recently uploaded" },
  { key: "opened", label: "Recently opened" },
  { key: "expiration", label: "Contract expiration" },
  { key: "alpha", label: "Alphabetical (A–Z)" },
];

export default function FileFilters({ typeFilter, onTypeChange, sort, onSortChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        {TYPE_FILTERS.map((f) => {
          const active = typeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => onTypeChange(f.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? "bg-brand-600 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-slate-600 focus:border-brand-500 focus:outline-none"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              Sort: {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}
