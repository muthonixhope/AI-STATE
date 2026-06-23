import { useState } from "react";
import { PRIORITY, comparePriority, priorityStyle } from "../../lib/priority.js";
import { monthGrid, isSameMonth, dayNum } from "../../lib/dateUtils.js";
import { useApp } from "../../context/AppContext.jsx";

const WEEKDAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY = "2026-06-23";

export default function MonthlyCalendarView({ anchor, tasksByDate, onSelectDay }) {
  const { moveTask } = useApp();
  const [dragOverCell, setDragOverCell] = useState(null);
  const cells = monthGrid(anchor);

  function findTask(taskId) {
    for (const arr of Object.values(tasksByDate)) {
      const t = arr.find((t) => t.id === taskId);
      if (t) return t;
    }
    return null;
  }

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
          const isOver = dragOverCell === d;

          return (
            <div
              key={d}
              role="button"
              tabIndex={0}
              onClick={() => onSelectDay(d)}
              onKeyDown={(e) => e.key === "Enter" && onSelectDay(d)}
              onDragOver={(e) => { e.preventDefault(); setDragOverCell(d); }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setDragOverCell(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const taskId = e.dataTransfer.getData("taskId");
                if (taskId) {
                  const task = findTask(taskId);
                  moveTask(taskId, d, task?.time || "09:00");
                }
                setDragOverCell(null);
              }}
              className={`min-h-[78px] cursor-pointer select-none rounded-lg border p-1.5 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-brand-300 ${
                isOver
                  ? "border-brand-400 bg-brand-50 ring-2 ring-brand-200"
                  : isToday
                  ? "border-brand-300 bg-brand-50 hover:border-brand-400"
                  : inMonth
                  ? "border-slate-100 bg-slate-50/60 hover:border-brand-300 hover:bg-brand-50/50"
                  : "border-transparent bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold ${
                  isToday ? "text-brand-700" : inMonth ? "text-slate-500" : "text-slate-300"
                }`}>
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
                      draggable
                      onDragStart={(e) => {
                        e.stopPropagation();
                        e.dataTransfer.setData("taskId", t.id);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`cursor-grab truncate rounded px-1 py-0.5 text-[9px] font-medium active:cursor-grabbing ${s.badge}`}
                    >
                      {t.title}
                    </p>
                  );
                })}
                {dayTasks.length > 2 && (
                  <p className="px-1 text-[9px] text-slate-400">+{dayTasks.length - 2} more</p>
                )}
              </div>

              {isOver && (
                <p className="mt-0.5 text-center text-[9px] text-brand-500">Drop here</p>
              )}
            </div>
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
