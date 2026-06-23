import { useMemo, useState } from "react";
import {
  Check,
  X,
  RefreshCw,
  FileSearch,
  ShieldAlert,
  CheckCircle2,
  UserSquare,
} from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { applyVariation, VARIATION_LABELS } from "../../drafts/draftVariations.js";
import { generateDraftBody, SIGNATURE } from "../../lib/aiEngine.js";
import EmptyState from "../common/EmptyState.jsx";
import { Mail } from "lucide-react";

export default function DraftCard({ emailId, onRemove }) {
  const { emails, files, tenantsById, openTenantCase } = useApp();
  const email = useMemo(() => emails.find((e) => e.id === emailId), [emails, emailId]);
  const tenant = email?.tenantId ? tenantsById[email.tenantId] : null;

  const base = useMemo(() => {
    if (!email) return null;
    return generateDraftBody(email, tenant, files);
  }, [email, tenant, files]);

  const [variationIdx, setVariationIdx] = useState(0);
  const [status, setStatus] = useState("draft");
  const [draft, setDraft] = useState(() =>
    base ? `${base.body}\n\n${SIGNATURE}` : ""
  );

  if (!email || !base) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <EmptyState icon={Mail} title="Email not found" />
      </div>
    );
  }

  function regenerate() {
    const next = (variationIdx + 1) % VARIATION_LABELS.length;
    setVariationIdx(next);
    // tone changes the body; the signature stays identical every time
    setDraft(`${applyVariation(base.body, next)}\n\n${SIGNATURE}`);
    setStatus("draft");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">{email.tenant_name}</p>
          <p className="text-xs text-slate-500">Re: {email.subject}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
            {VARIATION_LABELS[variationIdx]}
          </span>
          {status === "approved" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
              <CheckCircle2 className="h-3 w-3" /> Approved — ready to send
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 rounded-lg border-l-2 border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
        <span className="font-semibold text-slate-400">Tenant asked: </span>
        {email.subject}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand-700">
          <FileSearch className="h-3 w-3" />
          {base.groundedOn ? `Grounded on ${base.groundedOn}` : "No matching document found"}
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-500">
          intent: {base.intent}
        </span>
        {email.tenantId && (
          <button
            onClick={() => openTenantCase(email.tenantId)}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 font-medium text-brand-600 hover:bg-brand-50"
          >
            <UserSquare className="h-3 w-3" /> Open case
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
        <ShieldAlert className="h-3.5 w-3.5" />
        Draft — review and approve before sending. Nothing is sent automatically.
      </div>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={10}
        disabled={status === "approved"}
        className="mt-3 w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          disabled={status === "approved"}
          onClick={() => setStatus("approved")}
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" /> Approve
        </button>
        <button
          onClick={() => onRemove?.(emailId)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          <X className="h-3.5 w-3.5" /> Reject
        </button>
        <button
          disabled={status === "approved"}
          onClick={regenerate}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          title={`Next: ${VARIATION_LABELS[(variationIdx + 1) % VARIATION_LABELS.length]}`}
        >
          <RefreshCw className="h-3.5 w-3.5" /> Regenerate
        </button>
        <p className="ml-1 text-[11px] text-slate-400">
          Next: {VARIATION_LABELS[(variationIdx + 1) % VARIATION_LABELS.length]} style
        </p>
      </div>
    </div>
  );
}
