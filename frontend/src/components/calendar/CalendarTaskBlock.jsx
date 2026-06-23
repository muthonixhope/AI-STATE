import { Check, GripVertical, Mail, Pencil, UserSquare } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { priorityStyle } from "../../lib/priority.js";

export default function CalendarTaskBlock({ task, onEdit, compact = false, canDrag = false }) {
  const { setTaskStatus, openEmail, openTenantCase } = useApp();
  const s = priorityStyle(task.priority);
  const done = task.status === "done";

  const sourceLabel = task.manuallyScheduled
    ? "Moved by manager"
    : task.source === "ai"
    ? "AI scheduled"
    : null;

  return (
    <div
      draggable={canDrag}
      onDragStart={
        canDrag
          ? (e) => {
              e.dataTransfer.setData("taskId", task.id);
              e.dataTransfer.effectAllowed = "move";
            }
          : undefined
      }
      className={`group rounded-xl border border-l-4 ${s.border} border-slate-200 bg-white p-2.5 shadow-sm transition ${
        canDrag ? "cursor-grab active:cursor-grabbing active:opacity-60" : ""
      } ${done ? "opacity-50" : ""}`}
    >
      <div className="flex items-start gap-2">
        {canDrag && (
          <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-200 transition group-hover:text-slate-400" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-xs font-semibold text-slate-800 ${done ? "line-through" : ""}`}>
              {task.title}
            </p>
            <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${s.badge}`}>
              {s.short}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {task.time && <span>{task.time}</span>}
            {task.tenant_name && <span> · {task.tenant_name}</span>}
          </p>
          {sourceLabel && (
            <p className="mt-0.5 text-[9px] italic text-slate-300">{sourceLabel}</p>
          )}
        </div>
      </div>

      {compact ? (
        <div className="mt-1.5 flex justify-end">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(task); }}
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 hover:bg-slate-100"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
        </div>
      ) : (
        <div className="mt-2 flex flex-wrap items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setTaskStatus(task.id, done ? "pending" : "done"); }}
            className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
              done
                ? "bg-slate-100 text-slate-500"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            }`}
          >
            <Check className="h-3 w-3" /> {done ? "Done" : "Complete"}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(task); }}
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 hover:bg-slate-100"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
          {task.linkedEmailId && (
            <button
              onClick={(e) => { e.stopPropagation(); openEmail(task.linkedEmailId); }}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-brand-600 hover:bg-brand-50"
            >
              <Mail className="h-3 w-3" /> Email
            </button>
          )}
          {task.tenantId && (
            <button
              onClick={(e) => { e.stopPropagation(); openTenantCase(task.tenantId); }}
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
