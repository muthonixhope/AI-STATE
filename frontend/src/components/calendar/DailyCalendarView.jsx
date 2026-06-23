import { useState } from "react";
import { Plus } from "lucide-react";
import CalendarTaskBlock from "./CalendarTaskBlock.jsx";
import { comparePriority } from "../../lib/priority.js";
import { fmtDayLong } from "../../lib/dateUtils.js";
import { useApp } from "../../context/AppContext.jsx";

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
];

function getHourSlot(time) {
  if (!time) return null;
  const hr = time.split(":")[0].padStart(2, "0");
  const slot = `${hr}:00`;
  return TIME_SLOTS.includes(slot) ? slot : null;
}

export default function DailyCalendarView({ date, tasksByDate, onEdit, onAdd }) {
  const { moveTask } = useApp();
  const [dragOverSlot, setDragOverSlot] = useState(null);

  const allTasks = [...(tasksByDate[date] || [])].sort(comparePriority);

  const slottedMap = {};
  const unslotted = [];
  for (const t of allTasks) {
    const slot = getHourSlot(t.time);
    if (slot) (slottedMap[slot] = slottedMap[slot] || []).push(t);
    else unslotted.push(t);
  }

  function handleDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOverSlot(null);
  }

  function handleDrop(e, slotTime) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) moveTask(taskId, date, slotTime);
    setDragOverSlot(null);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-bold text-slate-700">{fmtDayLong(date)}</h3>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          <Plus className="h-3.5 w-3.5" /> Add task
        </button>
      </div>

      <div className="max-h-[600px] divide-y divide-slate-50 overflow-y-auto">
        {TIME_SLOTS.map((slot) => {
          const tasks = slottedMap[slot] || [];
          const isOver = dragOverSlot === slot;
          return (
            <div
              key={slot}
              onDragOver={(e) => { e.preventDefault(); setDragOverSlot(slot); }}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, slot)}
              className={`flex gap-3 px-4 py-1.5 transition-colors ${
                isOver ? "bg-brand-50/80" : "hover:bg-slate-50/40"
              }`}
            >
              <div className={`w-14 shrink-0 pt-3 text-right text-[11px] font-semibold ${
                isOver ? "text-brand-500" : "text-slate-300"
              }`}>
                {slot}
              </div>
              <div className={`min-h-[44px] flex-1 py-1.5 transition-all ${
                isOver
                  ? "rounded-lg border-2 border-dashed border-brand-300 px-2"
                  : "border border-transparent"
              }`}>
                {tasks.length > 0 ? (
                  <div className="space-y-1.5">
                    {tasks.map((task) => (
                      <CalendarTaskBlock key={task.id} task={task} onEdit={onEdit} canDrag />
                    ))}
                  </div>
                ) : isOver ? (
                  <div className="flex h-10 items-center justify-center text-[11px] text-brand-400">
                    Drop here
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}

        {unslotted.length > 0 && (
          <div className="px-4 py-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
              Other times
            </p>
            <div className="space-y-1.5">
              {unslotted.map((task) => (
                <CalendarTaskBlock key={task.id} task={task} onEdit={onEdit} canDrag />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
