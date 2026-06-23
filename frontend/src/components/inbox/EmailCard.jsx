import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight, PenLine, Trash2, UserSquare } from "lucide-react";
import { priorityStyle, formatDateTime } from "../../lib/priority.js";
import { useApp } from "../../context/AppContext.jsx";
import PrioritySelector from "../common/PrioritySelector.jsx";

export default function EmailCard({ email, highlighted }) {
  const [expanded, setExpanded] = useState(false);
  const { requestDraft, deleteEmail, setEmailPriority, openTenantCase } = useApp();
  const s = priorityStyle(email.priority);

  return (
    <div
      className={`rounded-2xl border border-l-4 border-slate-200 bg-white shadow-card transition-all ${
        s.border
      } ${highlighted ? "ring-2 ring-brand-400 ring-offset-2" : ""}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold text-slate-900">{email.tenant_name}</p>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                  email.contact_role === "Tenant"
                    ? "bg-slate-100 text-slate-500"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {email.contact_role}
              </span>
              <span className="text-xs text-slate-400">
                ·{" "}
                {email.contact_role === "Tenant"
                  ? `Unit ${email.unit}, ${email.building}`
                  : email.building}
              </span>
            </div>
            <p className="mt-0.5 truncate text-sm font-medium text-slate-700">{email.subject}</p>
          </div>

          <div className="flex shrink-0 items-start gap-2">
            <span className="text-[11px] text-slate-400">{formatDateTime(email.received_at)}</span>
            <button
              onClick={() => deleteEmail(email)}
              title="Delete email"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 rounded-lg bg-slate-50 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">AI Summary</p>
          <p className="mt-0.5 text-sm text-slate-600">{email.summary}</p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <PrioritySelector
            value={email.priority}
            aiValue={email.aiPriority}
            overridden={email.priorityOverridden}
            onChange={(p) => setEmailPriority(email.id, p)}
          />
          <span className="text-sm">
            <span className={`font-medium ${s.text}`}>Suggested: </span>
            <span className="text-slate-600">{email.suggested_action}</span>
          </span>
        </div>

        {email.reasons?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {email.reasons.slice(0, 4).map((r) => (
              <span
                key={r}
                className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500"
              >
                {r}
              </span>
            ))}
          </div>
        )}

        {expanded && (
          <p className="mt-3 whitespace-pre-line border-t border-slate-100 pt-3 text-sm text-slate-600">
            {email.body}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" /> Hide email
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" /> Read full email
              </>
            )}
          </button>
          {email.tenantId && (
            <button
              onClick={() => openTenantCase(email.tenantId)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
            >
              <UserSquare className="h-3.5 w-3.5" /> Open case
            </button>
          )}
          <button
            onClick={() => requestDraft(email.id)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
          >
            <PenLine className="h-3.5 w-3.5" /> Draft AI reply
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
