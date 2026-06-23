import { Pencil, Check, Mail, UserSquare, Clock } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { priorityStyle } from "../../lib/priority.js";

export default function CalendarTaskBlock({ task, onEdit, compact = false }) {
  const { setTaskStatus, openEmail, openTenantCase } = useApp();
  const s = priorityStyle(task.priority);
  const done = task.status === "done";

  return (
    <div
      className={`rounded-xl border border-l-4 ${s.border} border-slate-200 bg-white p-2.5 shadow-sm transition ${
        done ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={`text-xs font-semibold text-slate-800 ${done ? "line-through" : ""}`}>
            {task.title}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="h-3 w-3" /> {task.time}
            {task.tenant_name && ` · ${task.tenant_name}`}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${s.badge}`}>
          {s.short}
        </span>
      </div>

      {!compact && (
        <div className="mt-2 flex flex-wrap items-center gap-1">
          <button
            onClick={() => setTaskStatus(task.id, done ? "pending" : "done")}
            className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
              done
                ? "bg-slate-100 text-slate-500"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            }`}
          >
            <Check className="h-3 w-3" /> {done ? "Done" : "Complete"}
          </button>
          <button
            onClick={() => onEdit?.(task)}
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 hover:bg-slate-100"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
          {task.linkedEmailId && (
            <button
              onClick={() => openEmail(task.linkedEmailId)}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-brand-600 hover:bg-brand-50"
            >
              <Mail className="h-3 w-3" /> Email
            </button>
          )}
          {task.tenantId && (
            <button
              onClick={() => openTenantCase(task.tenantId)}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-brand-600 hover:bg-brand-50"
            >
              <UserSquare className="h-3 w-3" /> Case
            </button>
          )}
        </div>
      )}
    </div>
  );
}
