import { useState } from "react";
import { Check, X, Clock, ExternalLink } from "lucide-react";
import { priorityStyle } from "../../lib/priority.js";
import { useApp } from "../../context/AppContext.jsx";
import { api } from "../../api/client.js";

export default function TodayTaskCard({ task, onChanged }) {
  const s = priorityStyle(task.priority);
  const { openEmail } = useApp();
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

  return (
    <div className={`rounded-xl border border-slate-200 border-l-4 bg-white p-3 ${s.border}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          {task.slot_time}
        </span>
        <span className={`text-[11px] font-semibold ${s.text}`}>{s.short}</span>
      </div>
      <p className="mt-1 text-sm font-medium text-slate-800">{task.title}</p>
      <p className="text-xs text-slate-500">{task.tenant_name}</p>

      <div className="mt-2 flex items-center gap-1.5">
        {accepted ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            <Check className="h-3 w-3" /> Accepted
          </span>
        ) : (
          <>
            <button
              disabled={busy}
              onClick={() => act("accept")}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <Check className="h-3 w-3" /> Accept
            </button>
            <button
              disabled={busy}
              onClick={() => act("reject")}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <X className="h-3 w-3" /> Reject
            </button>
          </>
        )}
        <button
          onClick={() => openEmail(task.email_id)}
          className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-brand-700 hover:bg-brand-50"
        >
          <ExternalLink className="h-3 w-3" /> Email
        </button>
      </div>
    </div>
  );
}
