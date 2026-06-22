import { priorityStyle } from "../../lib/priority.js";
import CalendarTaskBlock from "./CalendarTaskBlock.jsx";
import EmptyState from "../common/EmptyState.jsx";
import { CalendarClock } from "lucide-react";

export default function DailyCalendarView({ tasks, onChanged }) {
  if (!tasks.length) {
    return <EmptyState icon={CalendarClock} title="No tasks scheduled today" />;
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-brand-50/40 p-4">
      <h3 className="mb-3 text-sm font-bold text-slate-700">Today — Monday, Jun 22</h3>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-3">
            <div className="w-14 shrink-0 pt-2 text-right text-xs font-semibold text-slate-400">
              {task.slot_time}
            </div>
            <div className="flex-1">
              <CalendarTaskBlock task={task} onChanged={onChanged} showTime={false} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
