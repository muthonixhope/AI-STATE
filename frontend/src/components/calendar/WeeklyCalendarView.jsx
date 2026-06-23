import { useState } from "react";
import CalendarTaskBlock from "./CalendarTaskBlock.jsx";
import { comparePriority } from "../../lib/priority.js";
import { weekDays, dayNum, parse } from "../../lib/dateUtils.js";
import { useApp } from "../../context/AppContext.jsx";

const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY = "2026-06-23";

export default function WeeklyCalendarView({ anchor, tasksByDate, onSelectDay, onEdit }) {
  const { moveTask } = useApp();
  const [dragOverDay, setDragOverDay] = useState(null);
  const days = weekDays(anchor);

  function findTask(taskId) {
    for (const arr of Object.values(tasksByDate)) {
      const t = arr.find((t) => t.id === taskId);
      if (t) return t;
    }
    return null;
  }

  function handleDrop(e, targetDay) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;
    const task = findTask(taskId);
    if (task) moveTask(taskId, targetDay, task.time);
    setDragOverDay(null);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="grid grid-cols-7 divide-x divide-slate-100">
        {days.map((d, i) => {
          const dayTasks = [...(tasksByDate[d] || [])].sort(comparePriority);
          const isToday = d === TODAY;
          const isOver = dragOverDay === d;

          return (
            <div
              key={d}
              onDragOver={(e) => { e.preventDefault(); setDragOverDay(d); }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setDragOverDay(null);
              }}
              onDrop={(e) => handleDrop(e, d)}
              className={`flex flex-col transition-colors ${isOver ? "bg-brand-50/50" : ""}`}
            >
              {/* Day header */}
              <button
                onClick={() => onSelectDay(d)}
                className={`m-1.5 rounded-lg px-2 py-2 text-center shadow-sm transition hover:opacity-90 ${
                  isToday ? "bg-brand-600 text-white" : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <p className={`text-[11px] font-bold uppercase tracking-wide ${
                  isToday ? "text-white" : "text-slate-500"
                }`}>
                  {DOW[i]}
                </p>
                <p className={`text-[10px] ${isToday ? "text-brand-100" : "text-slate-400"}`}>
                  {parse(d).toLocaleDateString(undefined, { month: "short" })} {dayNum(d)}
                </p>
              </button>

              {/* Drop zone */}
              <div className={`mx-1.5 mb-1.5 min-h-[120px] flex-1 space-y-1.5 rounded-lg p-1 transition-all ${
                isOver
                  ? "border-2 border-dashed border-brand-300 bg-brand-50/30"
                  : "border border-dashed border-transparent"
              }`}>
                {dayTasks.length === 0 ? (
                  <p className={`rounded py-3 text-center text-[10px] ${
                    isOver ? "text-brand-400" : "text-slate-200"
                  }`}>
                    {isOver ? "Drop here" : "No tasks"}
                  </p>
                ) : (
                  dayTasks.map((task) => (
                    <CalendarTaskBlock
                      key={task.id}
                      task={task}
                      onEdit={onEdit}
                      compact
                      canDrag
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
