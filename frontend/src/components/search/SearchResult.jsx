import { FileText } from "lucide-react";

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}

export default function SearchResult({ result }) {
  const f = result.fields || {};
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-brand-600" />
          <p className="text-sm font-semibold text-slate-800">{result.file_name}</p>
        </div>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
          {result.doc_type}
        </span>
      </div>

      <p className="mt-2 text-sm text-slate-600">
        <span className="font-semibold text-slate-400">Summary: </span>
        {result.summary}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3 sm:grid-cols-3">
        <Field label="Tenant" value={f.tenant_name} />
        <Field label="Contract start" value={f.contract_start} />
        <Field label="Expiration" value={f.contract_expiration} />
        <Field label="Rent" value={f.rent_amount} />
        <Field label="Payment status" value={f.payment_status} />
        <Field label="Outstanding" value={f.outstanding_balance} />
      </div>

      {f.clauses?.length > 0 && (
        <div className="mt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Important clauses
          </p>
          <ul className="mt-1 list-inside list-disc space-y-0.5 text-xs text-slate-600">
            {f.clauses.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {result.snippet && (
        <p className="mt-3 border-t border-slate-100 pt-2 text-xs italic text-slate-400">
          …{result.snippet}…
        </p>
      )}
    </div>
  );
}
