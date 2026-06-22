import { useEffect, useRef, useState } from "react";
import {
  Check,
  X,
  RefreshCw,
  FileSearch,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { api } from "../../api/client.js";
import { applyVariation, VARIATION_LABELS } from "../../drafts/draftVariations.js";
import Spinner from "../common/Spinner.jsx";

export default function DraftCard({ emailId, onRemove }) {
  const [data, setData] = useState(null);
  const [baseDraft, setBaseDraft] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("draft"); // draft | approved
  const [variationIdx, setVariationIdx] = useState(0);
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    setLoading(true);
    api
      .generateDraft(emailId)
      .then((d) => {
        setData(d);
        setBaseDraft(d.draft);
        setDraft(d.draft);
        setVariationIdx(0);
        setStatus("draft");
      })
      .finally(() => setLoading(false));
  }, [emailId]);

  function regenerate() {
    const next = (variationIdx + 1) % VARIATION_LABELS.length;
    setVariationIdx(next);
    setDraft(applyVariation(baseDraft, next));
    setStatus("draft");
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        <Spinner label="AI is drafting a reply from your documents..." />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {data.tenant_name}
          </p>
          <p className="text-xs text-slate-500">Re: {data.subject}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Variation style badge */}
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

      {/* Tenant's original question */}
      <div className="mt-3 rounded-lg border-l-2 border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
        <span className="font-semibold text-slate-400">Tenant asked: </span>
        {data.question}
      </div>

      {/* Grounding note */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand-700">
          <FileSearch className="h-3 w-3" />
          {data.grounded_on
            ? `Grounded on ${data.grounded_on}`
            : "No matching document found"}
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-500">
          intent: {data.intent}
        </span>
      </div>

      {/* Human-in-the-loop banner */}
      <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
        <ShieldAlert className="h-3.5 w-3.5" />
        Draft — review and approve before sending. Nothing is sent automatically.
      </div>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={8}
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
