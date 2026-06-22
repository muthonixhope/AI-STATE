import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  PenLine,
  Send,
  Trash2,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { api } from "../../api/client.js";
import { useApp } from "../../context/AppContext.jsx";
import PriorityBadge from "../common/PriorityBadge.jsx";
import PriorityFilter from "../inbox/PriorityFilter.jsx";
import Spinner from "../common/Spinner.jsx";
import EmptyState from "../common/EmptyState.jsx";
import { formatDateTime } from "../../lib/priority.js";
import { Mail } from "lucide-react";

function ReplyComposer({ email }) {
  const { requestDraft } = useApp();
  const [text, setText] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleAIDraft() {
    setDrafting(true);
    try {
      const d = await api.generateDraft(email.id);
      setText(d.draft);
    } finally {
      setDrafting(false);
    }
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
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your reply here, or use the AI Draft button to generate one..."
        className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={handleAIDraft}
          disabled={drafting}
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100 disabled:opacity-60"
        >
          {drafting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <PenLine className="h-3.5 w-3.5" />
          )}
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
  const { deleteEmail } = useApp();

  return (
    <div className="rounded-xl border border-slate-200 border-l-4 bg-white shadow-card transition-all"
      style={{ borderLeftColor: email.priority === "p1" ? "#ef4444" : email.priority === "p2" ? "#f59e0b" : "#38bdf8" }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">
                {email.tenant_name || email.contact_name}
              </p>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                  email.contact_role === "Tenant"
                    ? "bg-slate-100 text-slate-500"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {email.contact_role}
              </span>
              {email.unit && (
                <span className="text-xs text-slate-400">
                  · Unit {email.unit}, {email.building}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm font-medium text-slate-700">
              {email.subject}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="flex flex-col items-end gap-1">
              <PriorityBadge level={email.priority} />
              <span className="text-[11px] text-slate-400">
                {formatDateTime(email.received_at)}
              </span>
            </div>
            <button
              onClick={() => deleteEmail(email)}
              title="Delete email"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* AI summary */}
        <div className="mt-3 rounded-lg bg-slate-50 p-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            AI Summary
          </p>
          <p className="mt-0.5 text-sm text-slate-600 line-clamp-2">
            {email.summary}
          </p>
        </div>

        {expanded && (
          <>
            <p className="mt-3 whitespace-pre-line border-t border-slate-100 pt-3 text-sm text-slate-600">
              {email.body}
            </p>
            <ReplyComposer email={email} />
          </>
        )}

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50"
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
      </div>
    </div>
  );
}

export default function EmailTab() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { binEmails } = useApp();

  useEffect(() => {
    api
      .getInbox()
      .then((d) => setEmails(d.emails))
      .finally(() => setLoading(false));
  }, []);

  const deletedIds = useMemo(
    () => new Set(binEmails.map((e) => e.id)),
    [binEmails]
  );

  const counts = useMemo(() => {
    return emails
      .filter((e) => !deletedIds.has(e.id))
      .reduce((acc, e) => {
        acc[e.priority] = (acc[e.priority] || 0) + 1;
        return acc;
      }, {});
  }, [emails, deletedIds]);

  const visible = useMemo(() => {
    return emails
      .filter((e) => !deletedIds.has(e.id))
      .filter((e) => filter === "all" || e.priority === filter);
  }, [emails, deletedIds, filter]);

  if (loading) {
    return (
      <div className="p-6">
        <Spinner label="Loading emails..." />
      </div>
    );
  }

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
