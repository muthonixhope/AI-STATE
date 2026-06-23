import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  PenLine,
  Send,
  Trash2,
  CheckCircle2,
  Mail,
  UserSquare,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import PriorityFilter from "../inbox/PriorityFilter.jsx";
import PrioritySelector from "../common/PrioritySelector.jsx";
import EmptyState from "../common/EmptyState.jsx";
import { priorityStyle, formatDateTime } from "../../lib/priority.js";
import { generateDraftBody, SIGNATURE } from "../../lib/aiEngine.js";

function ReplyComposer({ email }) {
  const { files, tenantsById } = useApp();
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  function handleAIDraft() {
    const tenant = email.tenantId ? tenantsById[email.tenantId] : null;
    const { body } = generateDraftBody(email, tenant, files);
    setText(`${body}\n\n${SIGNATURE}`);
  }

  function handleSend() {
    setSent(true);
    setText("");
    setTimeout(() => setSent(false), 3000);
  }

  if (sent) {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
        <CheckCircle2 className="h-4 w-4" />
        Reply sent successfully!
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold text-slate-500">Your reply</p>
      <textarea
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your reply, or use AI Draft to generate one…"
        className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={handleAIDraft}
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100"
        >
          <PenLine className="h-3.5 w-3.5" />
          AI Draft
        </button>
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
          Send Reply
        </button>
      </div>
    </div>
  );
}

function EmailRow({ email }) {
  const [expanded, setExpanded] = useState(false);
  const { deleteEmail, setEmailPriority, openTenantCase, requestDraft } = useApp();
  const s = priorityStyle(email.priority);

  return (
    <div
      className={`rounded-2xl border border-l-4 border-slate-200 bg-white shadow-card transition-all ${s.border}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">{email.tenant_name}</p>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                  email.contact_role === "Tenant"
                    ? "bg-slate-100 text-slate-500"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {email.contact_role}
              </span>
              {email.unit !== "—" && (
                <span className="text-xs text-slate-400">
                  · Unit {email.unit}, {email.building}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm font-medium text-slate-700">{email.subject}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="text-[11px] text-slate-400">{formatDateTime(email.received_at)}</span>
            <button
              onClick={() => deleteEmail(email)}
              title="Delete email"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 rounded-lg bg-slate-50 p-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">AI Summary</p>
          <p className="mt-0.5 text-sm text-slate-600">{email.summary}</p>
          <p className="mt-1.5 text-sm">
            <span className={`font-medium ${s.text}`}>Suggested: </span>
            <span className="text-slate-600">{email.suggested_action}</span>
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <PrioritySelector
            value={email.priority}
            aiValue={email.aiPriority}
            overridden={email.priorityOverridden}
            onChange={(p) => setEmailPriority(email.id, p)}
          />
          {email.tenantId && (
            <button
              onClick={() => openTenantCase(email.tenantId)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
            >
              <UserSquare className="h-3.5 w-3.5" /> Open tenant case
            </button>
          )}
        </div>

        {expanded && (
          <>
            <p className="mt-3 whitespace-pre-line border-t border-slate-100 pt-3 text-sm text-slate-600">
              {email.body}
            </p>
            <ReplyComposer email={email} />
          </>
        )}

        <div className="mt-3 flex items-center gap-2">
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
                <ChevronDown className="h-3.5 w-3.5" /> Read &amp; reply
              </>
            )}
          </button>
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

export default function EmailTab() {
  const { activeEmails, emailFilter, setEmailFilter } = useApp();
  const [filter, setFilter] = useState(emailFilter || "all");

  // honor a deep-link from the dashboard summary boxes
  useEffect(() => {
    if (emailFilter) {
      setFilter(emailFilter);
      setEmailFilter(null);
    }
  }, [emailFilter, setEmailFilter]);

  const counts = useMemo(() => {
    return activeEmails.reduce((acc, e) => {
      acc[e.priority] = (acc[e.priority] || 0) + 1;
      return acc;
    }, {});
  }, [activeEmails]);

  const visible = useMemo(() => {
    const list =
      filter === "all" ? activeEmails : activeEmails.filter((e) => e.priority === filter);
    // "All" behaves like a real inbox: newest first. Filtered views too.
    return [...list].sort((a, b) => b.received_at.localeCompare(a.received_at));
  }, [activeEmails, filter]);

  return (
    <div className="space-y-5 p-6">
      <PriorityFilter active={filter} onChange={setFilter} counts={counts} />
      {visible.length === 0 ? (
        <EmptyState icon={Mail} title="No emails in this category" />
      ) : (
        <div className="space-y-3">
          {visible.map((email) => (
            <EmailRow key={email.id} email={email} />
          ))}
        </div>
      )}
    </div>
  );
}
