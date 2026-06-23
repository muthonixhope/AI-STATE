import {
  X,
  FileText,
  FileSpreadsheet,
  Wrench,
  ReceiptText,
  Building,
  CalendarClock,
  User,
  DollarSign,
  ClipboardList,
  UserSquare,
} from "lucide-react";
import { formatDate } from "../../lib/priority.js";
import { useApp } from "../../context/AppContext.jsx";

const TYPE_ICONS = {
  "Tenant Contract": { icon: FileText, color: "text-brand-600 bg-brand-50" },
  Invoice: { icon: ReceiptText, color: "text-orange-600 bg-orange-50" },
  "Repair Document": { icon: Wrench, color: "text-amber-600 bg-amber-50" },
  "Payment Record": { icon: FileSpreadsheet, color: "text-emerald-600 bg-emerald-50" },
  "Building Document": { icon: Building, color: "text-slate-600 bg-slate-100" },
  Document: { icon: FileText, color: "text-slate-600 bg-slate-100" },
};

function Field({ label, value, icon: Icon }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-sm text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function PreviewBody({ file }) {
  // image preview
  if (file.blobUrl && (file.mime || "").startsWith("image/")) {
    return (
      <img
        src={file.blobUrl}
        alt={file.file_name}
        className="max-h-full w-full rounded-xl border border-slate-200 object-contain"
      />
    );
  }
  // PDF preview via object URL
  if (file.blobUrl && (file.mime === "application/pdf" || file.file_name.toLowerCase().endsWith(".pdf"))) {
    return (
      <iframe
        title={file.file_name}
        src={file.blobUrl}
        className="h-full min-h-[400px] w-full rounded-xl border border-slate-200"
      />
    );
  }
  // text content (seeded raw_text or uploaded text file)
  const text = file.raw_text || file.summary || "No inline preview available for this file type.";
  return (
    <pre className="h-full whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-700">
      {text}
    </pre>
  );
}

export default function FileFullPreviewModal({ file, onClose }) {
  const { openTenantCase, closeTenantCase } = useApp();
  if (!file) return null;
  const meta = TYPE_ICONS[file.doc_type] || TYPE_ICONS.Document;
  const Icon = meta.icon;

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 p-4 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdrop}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-lift">
        <div className="flex items-center gap-3 border-b border-slate-200 p-5">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${meta.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-slate-900">{file.file_name}</p>
            <p className="text-xs text-slate-500">
              {file.doc_type}
              {file.tenant_name && ` · ${file.tenant_name}`}
              {` · Last opened: ${formatDate(file.last_opened) }`}
            </p>
          </div>
          {file.tenantId && (
            <button
              onClick={() => {
                onClose();
                closeTenantCase();
                openTenantCase(file.tenantId);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100"
            >
              <UserSquare className="h-3.5 w-3.5" /> Open tenant case
            </button>
          )}
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 gap-0 overflow-hidden">
          <div className="scroll-area w-64 shrink-0 space-y-4 overflow-y-auto border-r border-slate-200 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Document Details</p>
            <Field label="Tenant" value={file.fields?.tenant_name || file.tenant_name} icon={User} />
            <Field label="Monthly Rent / Amount" value={file.fields?.rent_amount} icon={DollarSign} />
            <Field label="Payment Status" value={file.fields?.payment_status} icon={ClipboardList} />
            <Field label="Outstanding Balance" value={file.fields?.outstanding_balance} icon={DollarSign} />
            <Field label="Lease Start" value={formatDate(file.fields?.contract_start)} icon={CalendarClock} />
            <Field label="Lease Expiry" value={formatDate(file.fields?.contract_expiration)} icon={CalendarClock} />
            <Field label="Uploaded" value={formatDate(file.uploaded_at)} icon={CalendarClock} />

            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                AI Summary
              </p>
              <p className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600">{file.summary}</p>
            </div>

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

          <div className="scroll-area flex-1 overflow-y-auto p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
              Full Document Content
            </p>
            <PreviewBody file={file} />
          </div>
        </div>
      </div>
    </div>
  );
}
