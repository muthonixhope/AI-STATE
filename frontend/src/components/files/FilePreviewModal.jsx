import { useEffect, useState } from "react";
import {
  X,
  FileText,
  FileSpreadsheet,
  Wrench,
  ReceiptText,
  Building,
  Loader2,
  CalendarClock,
  User,
  DollarSign,
  ClipboardList,
} from "lucide-react";
import { api } from "../../api/client.js";
import { formatDate } from "../../lib/priority.js";

const TYPE_ICONS = {
  "Tenant Contract": { icon: FileText, color: "text-brand-600 bg-brand-50" },
  Invoice: { icon: ReceiptText, color: "text-orange-600 bg-orange-50" },
  "Repair Document": { icon: Wrench, color: "text-amber-600 bg-amber-50" },
  "Payment Record": { icon: FileSpreadsheet, color: "text-emerald-600 bg-emerald-50" },
  "Building Document": { icon: Building, color: "text-slate-600 bg-slate-100" },
};

function Field({ label, value, icon: Icon }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="text-sm text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function FilePreviewModal({ fileId, onClose }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFile(fileId).then((d) => {
      setFile(d.file);
      setLoading(false);
    });
  }, [fileId]);

  // Close on backdrop click
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  const meta = file ? TYPE_ICONS[file.doc_type] || TYPE_ICONS["Tenant Contract"] : null;
  const Icon = meta?.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 p-5">
          {meta && (
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${meta.color}`}>
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-slate-900">
              {loading ? "Loading…" : file?.file_name}
            </p>
            {file && (
              <p className="text-xs text-slate-500">
                {file.doc_type}
                {file.tenant_name && ` · ${file.tenant_name}`}
                {` · Last opened: today`}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          </div>
        ) : (
          <div className="flex flex-1 gap-0 overflow-hidden">
            {/* Structured fields panel */}
            <div className="w-64 shrink-0 space-y-4 overflow-y-auto border-r border-slate-200 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Document Details
              </p>
              <Field label="Tenant" value={file.fields?.tenant_name} icon={User} />
              <Field label="Property" value={file.fields?.property} icon={Building} />
              <Field label="Monthly Rent" value={file.fields?.rent_amount} icon={DollarSign} />
              <Field label="Payment Status" value={file.fields?.payment_status} icon={ClipboardList} />
              <Field label="Outstanding Balance" value={file.fields?.outstanding_balance} icon={DollarSign} />
              <Field label="Lease Start" value={formatDate(file.fields?.contract_start)} icon={CalendarClock} />
              <Field label="Lease Expiry" value={formatDate(file.fields?.contract_expiration)} icon={CalendarClock} />
              <Field label="Uploaded" value={formatDate(file.uploaded_at)} icon={CalendarClock} />

              {file.fields?.clauses?.length > 0 && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Key Clauses
                  </p>
                  <ul className="space-y-2">
                    {file.fields.clauses.map((c, i) => (
                      <li
                        key={i}
                        className="rounded-lg border-l-2 border-brand-400 bg-brand-50 px-3 py-2 text-xs text-slate-700"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Full document text panel */}
            <div className="flex-1 overflow-y-auto p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                Full Document Content
              </p>
              <pre className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-700">
                {file.raw_text || file.summary || "No document content available."}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
