import { PRIORITY, comparePriority, priorityStyle } from "../../lib/priority.js";
import { monthGrid, isSameMonth, dayNum } from "../../lib/dateUtils.js";

const WEEKDAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY = "2026-06-23";

export default function MonthlyCalendarView({ anchor, tasksByDate, onSelectDay }) {
  const cells = monthGrid(anchor);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAY_HEADERS.map((w) => (
          <div
            key={w}
            className="pb-1 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400"
          >
            {w}
          </div>
        ))}
        {cells.map((d) => {
          const inMonth = isSameMonth(d, anchor);
          const dayTasks = [...(tasksByDate[d] || [])].sort(comparePriority);
          const isToday = d === TODAY;
          return (
            <button
              key={d}
              onClick={() => onSelectDay(d)}
              className={`min-h-[78px] rounded-lg border p-1.5 text-left transition hover:border-brand-300 hover:bg-brand-50/50 ${
                isToday
                  ? "border-brand-300 bg-brand-50"
                  : inMonth
                  ? "border-slate-100 bg-slate-50/60"
                  : "border-transparent bg-white text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold ${
                    isToday ? "text-brand-700" : inMonth ? "text-slate-500" : "text-slate-300"
                  }`}
                >
                  {dayNum(d)}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[9px] font-bold text-slate-400">{dayTasks.length}</span>
                )}
              </div>
              <div className="mt-1 space-y-0.5">
                {dayTasks.slice(0, 2).map((t) => {
                  const s = priorityStyle(t.priority);
                  return (
                    <p
                      key={t.id}
                      className={`truncate rounded px-1 py-0.5 text-[9px] font-medium ${s.badge}`}
                    >
                      {t.title}
                    </p>
                  );
                })}
                {dayTasks.length > 2 && (
                  <p className="px-1 text-[9px] text-slate-400">+{dayTasks.length - 2} more</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-400">
        {Object.values(PRIORITY).map((p) => (
          <span key={p.key} className="inline-flex items-center gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} /> {p.short} {p.name}
          </span>
        ))}
      </div>
    </div>
  );
}
