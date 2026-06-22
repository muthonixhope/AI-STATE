import { useState } from "react";
import { Check, X, Pencil, ExternalLink, Save } from "lucide-react";
import { priorityStyle } from "../../lib/priority.js";
import { useApp } from "../../context/AppContext.jsx";
import { api } from "../../api/client.js";

// Compact white task card for the weekly/monthly calendar grids.
export default function CalendarTaskBlock({ task, onChanged, showTime = true }) {
  const s = priorityStyle(task.priority);
  const { openEmail } = useApp();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [busy, setBusy] = useState(false);
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

  async function save() {
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
      className={`rounded-xl border border-l-4 bg-white p-2.5 shadow-sm ${s.border} ${
        accepted ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        {showTime && (
          <span className="text-[11px] font-semibold text-slate-500">{task.slot_time}</span>
        )}
        <span className={`text-[10px] font-bold ${s.text}`}>{s.short}</span>
      </div>

      {editing ? (
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded border border-slate-300 px-1.5 py-1 text-xs focus:border-brand-500 focus:outline-none"
        />
      ) : (
        <p className="mt-0.5 text-xs font-semibold leading-snug text-slate-800">
          {task.title}
        </p>
      )}
      <p className="truncate text-[11px] text-slate-400">{task.tenant_name}</p>

      {accepted && (
        <span className="mt-1 inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600">
          <Check className="h-2.5 w-2.5" /> Accepted
        </span>
      )}

      <div className="mt-1.5 flex items-center gap-1">
        {editing ? (
          <button
            disabled={busy}
            onClick={save}
            title="Save"
            className="rounded p-1 text-brand-600 hover:bg-brand-50 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
          </button>
        ) : (
          <>
            {!accepted && (
              <button
                disabled={busy}
                onClick={() => act("accept")}
                title="Accept"
                className="rounded p-1 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              disabled={busy}
              onClick={() => act("reject")}
              title="Reject"
              className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setEditing(true)}
              title="Edit"
              className="rounded p-1 text-slate-400 hover:bg-slate-100"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </>
        )}
        <button
          onClick={() => openEmail(task.email_id)}
          title="Open linked email"
          className="ml-auto rounded p-1 text-brand-600 hover:bg-brand-50"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
