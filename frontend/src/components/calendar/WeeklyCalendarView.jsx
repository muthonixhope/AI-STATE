import CalendarTaskBlock from "./CalendarTaskBlock.jsx";

const DAYS = [
  { key: "Mon", label: "Mon", date: "Jun 22" },
  { key: "Tue", label: "Tue", date: "Jun 23" },
  { key: "Wed", label: "Wed", date: "Jun 24" },
  { key: "Thu", label: "Thu", date: "Jun 25" },
  { key: "Fri", label: "Fri", date: "Jun 26" },
];

export default function WeeklyCalendarView({ tasks, onChanged }) {
  const byDay = (day) =>
    tasks
      .filter((t) => t.weekday === day)
      .sort((a, b) => a.slot_time.localeCompare(b.slot_time));

  return (
    <div className="rounded-2xl border border-slate-200 bg-brand-50/40 p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {DAYS.map((d) => {
          const dayTasks = byDay(d.key);
          return (
            <div key={d.key} className="flex flex-col">
              <div className="mb-2 rounded-lg bg-white px-3 py-2 text-center shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {d.label}
                </p>
                <p className="text-[11px] text-slate-400">{d.date}</p>
              </div>
              <div className="space-y-2">
                {dayTasks.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-200 py-4 text-center text-[11px] text-slate-300">
                    No tasks
                  </p>
                ) : (
                  dayTasks.map((task) => (
                    <CalendarTaskBlock key={task.id} task={task} onChanged={onChanged} />
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
