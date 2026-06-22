import { useState } from "react";
import { Check, X, Pencil, ExternalLink, Clock, Save } from "lucide-react";
import PriorityBadge from "../common/PriorityBadge.jsx";
import { priorityStyle } from "../../lib/priority.js";
import { useApp } from "../../context/AppContext.jsx";
import { api } from "../../api/client.js";

export default function TaskCard({ task, slotLabel, onChanged }) {
  const { openEmail } = useApp();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [busy, setBusy] = useState(false);
  const s = priorityStyle(task.priority);

  const accepted = task.status === "accepted";

  async function act(action) {
    setBusy(true);
    try {
      await api.taskAction(task.id, action);
      onChanged?.();
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit() {
    setBusy(true);
    try {
      await api.editTask(task.id, { title });
      setEditing(false);
      onChanged?.();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={`rounded-xl border border-l-4 bg-white p-4 shadow-card ${s.border} ${
        accepted ? "opacity-90" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          {slotLabel}
        </div>
        <PriorityBadge level={task.priority} />
      </div>

      {editing ? (
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
        />
      ) : (
        <p className="mt-2 text-sm font-semibold text-slate-800">{task.title}</p>
      )}

      <p className="mt-1 text-xs text-slate-500">
        {task.tenant_name} — “{task.subject}”
      </p>

      {accepted && (
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
          <Check className="h-3 w-3" /> Accepted
        </span>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {editing ? (
          <button
            disabled={busy}
            onClick={saveEdit}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" /> Save
          </button>
        ) : (
          <>
            <button
              disabled={busy || accepted}
              onClick={() => act("accept")}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" /> Accept
            </button>
            <button
              disabled={busy}
              onClick={() => act("reject")}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" /> Reject
            </button>
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
          </>
        )}
        <button
          onClick={() => openEmail(task.email_id)}
          className="ml-auto inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Open email
        </button>
      </div>
    </div>
  );
}
