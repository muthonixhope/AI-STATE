import CalendarTaskBlock from "./CalendarTaskBlock.jsx";
import { comparePriority } from "../../lib/priority.js";
import { weekDays, dayNum, parse } from "../../lib/dateUtils.js";

const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY = "2026-06-23";

export default function WeeklyCalendarView({ anchor, tasksByDate, onSelectDay, onEdit }) {
  const days = weekDays(anchor);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((d, i) => {
          const dayTasks = [...(tasksByDate[d] || [])].sort(comparePriority);
          const isToday = d === TODAY;
          return (
            <div key={d} className="flex flex-col">
              <button
                onClick={() => onSelectDay(d)}
                className={`mb-2 rounded-lg px-3 py-2 text-center shadow-sm transition ${
                  isToday ? "bg-brand-600 text-white" : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <p className={`text-xs font-bold uppercase tracking-wide ${isToday ? "text-white" : "text-slate-500"}`}>
                  {DOW[i]}
                </p>
                <p className={`text-[11px] ${isToday ? "text-brand-100" : "text-slate-400"}`}>
                  {parse(d).toLocaleDateString(undefined, { month: "short" })} {dayNum(d)}
                </p>
              </button>
              <div className="space-y-2">
                {dayTasks.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-200 py-4 text-center text-[11px] text-slate-300">
                    No tasks
                  </p>
                ) : (
                  dayTasks.map((task) => (
                    <CalendarTaskBlock key={task.id} task={task} onEdit={onEdit} compact />
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
