import { CalendarClock, Plus } from "lucide-react";
import CalendarTaskBlock from "./CalendarTaskBlock.jsx";
import EmptyState from "../common/EmptyState.jsx";
import { comparePriority } from "../../lib/priority.js";
import { fmtDayLong } from "../../lib/dateUtils.js";

export default function DailyCalendarView({ date, tasksByDate, onEdit, onAdd }) {
  const tasks = [...(tasksByDate[date] || [])].sort(comparePriority);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700">{fmtDayLong(date)}</h3>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      {tasks.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No tasks scheduled for this day" />
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start gap-3">
              <div className="w-14 shrink-0 pt-2 text-right text-xs font-semibold text-slate-400">
                {task.time}
              </div>
              <div className="flex-1">
                <CalendarTaskBlock task={task} onEdit={onEdit} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
