import { X, Plus } from "lucide-react";
import CalendarTaskBlock from "./CalendarTaskBlock.jsx";
import EmptyState from "../common/EmptyState.jsx";
import { CalendarClock } from "lucide-react";
import { comparePriority } from "../../lib/priority.js";
import { fmtDayLong } from "../../lib/dateUtils.js";

export default function DayDetailPanel({ date, tasks, onClose, onEdit, onAdd }) {
  const ordered = [...tasks].sort(comparePriority);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 p-4 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex max-h-[80vh] w-full max-w-md flex-col rounded-2xl bg-white shadow-lift">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">Day detail</p>
            <h3 className="text-base font-bold text-slate-900">{fmtDayLong(date)}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="scroll-area flex-1 space-y-2 overflow-y-auto p-4">
          {ordered.length === 0 ? (
            <EmptyState icon={CalendarClock} title="No tasks planned for this day" />
          ) : (
            ordered.map((t) => <CalendarTaskBlock key={t.id} task={t} onEdit={onEdit} />)
          )}
        </div>

        <div className="border-t border-slate-200 p-3">
          <button
            onClick={onAdd}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 py-2 text-xs font-semibold text-white hover:bg-brand-700"
          >
            <Plus className="h-3.5 w-3.5" /> Add task for this day
          </button>
        </div>
      </div>
    </div>
  );
}
