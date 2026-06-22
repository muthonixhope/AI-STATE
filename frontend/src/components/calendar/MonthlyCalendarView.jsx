import { useEffect, useMemo, useState } from "react";
import { Flag, StickyNote, CalendarClock } from "lucide-react";
import { api } from "../../api/client.js";
import { priorityStyle, formatDate } from "../../lib/priority.js";

const WEEKDAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// June 2026 starts on a Monday and has 30 days
const DAYS_IN_MONTH = 30;
const LEADING_BLANKS = 0;

export default function MonthlyCalendarView({ tasks }) {
  const [notes, setNotes] = useState(
    "• Confirm roofing contractor quote\n• Follow up on Q3 budget review"
  );
  const [files, setFiles] = useState([]);

  useEffect(() => {
    api.getFiles().then((d) => setFiles(d.files));
  }, []);

  const tasksByDay = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      const day = t.date ? parseInt(t.date.slice(8), 10) : null;
      if (!day) return;
      (map[day] = map[day] || []).push(t);
    });
    return map;
  }, [tasks]);

  const topPriorities = useMemo(
    () => [...tasks].sort((a, b) => b.priority_weight - a.priority_weight).slice(0, 5),
    [tasks]
  );

  const deadlines = useMemo(
    () =>
      files
        .filter((f) => f.contract_expiration)
        .sort((a, b) => a.contract_expiration.localeCompare(b.contract_expiration))
        .slice(0, 5),
    [files]
  );

  const cells = [];
  for (let i = 0; i < LEADING_BLANKS; i++) cells.push(null);
  for (let d = 1; d <= DAYS_IN_MONTH; d++) cells.push(d);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* month grid */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-2">
        <h3 className="mb-3 text-sm font-bold text-slate-700">June 2026</h3>
        <div className="grid grid-cols-7 gap-1.5">
          {WEEKDAY_HEADERS.map((w) => (
            <div
              key={w}
              className="pb-1 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400"
            >
              {w}
            </div>
          ))}
          {cells.map((day, idx) => {
            if (day === null) return <div key={`b${idx}`} />;
            const dayTasks = tasksByDay[day] || [];
            const isToday = day === 22;
            return (
              <div
                key={day}
                className={`min-h-[64px] rounded-lg border p-1.5 ${
                  isToday
                    ? "border-brand-300 bg-brand-50"
                    : "border-slate-100 bg-slate-50/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-semibold ${
                      isToday ? "text-brand-700" : "text-slate-500"
                    }`}
                  >
                    {day}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[9px] font-bold text-slate-400">
                      {dayTasks.length}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {dayTasks.slice(0, 4).map((t) => (
                    <span
                      key={t.id}
                      title={`${priorityStyle(t.priority).short} · ${t.title}`}
                      className={`h-1.5 w-1.5 rounded-full ${priorityStyle(t.priority).dot}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> P1 Safety
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> P2 Owner
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" /> P3 Admin
          </span>
        </div>
      </div>

      {/* side panel */}
      <div className="space-y-4">
        <Panel title="Top priorities" icon={Flag}>
          {topPriorities.map((t) => {
            const s = priorityStyle(t.priority);
            return (
              <div key={t.id} className="flex items-center gap-2 text-xs">
                <span className={`h-2 w-2 shrink-0 rounded-full ${s.dot}`} />
                <span className="truncate text-slate-600">{t.title}</span>
              </div>
            );
          })}
        </Panel>

        <Panel title="Notes" icon={StickyNote}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-600 focus:border-brand-500 focus:outline-none"
          />
        </Panel>

        <Panel title="Upcoming deadlines" icon={CalendarClock}>
          {deadlines.length === 0 ? (
            <p className="text-xs text-slate-400">No contract expirations on file.</p>
          ) : (
            deadlines.map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-2 text-xs">
                <span className="truncate text-slate-600">
                  {f.tenant_name || f.file_name}
                </span>
                <span className="shrink-0 font-medium text-amber-600">
                  {formatDate(f.contract_expiration)}
                </span>
              </div>
            ))
          )}
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
        <Icon className="h-4 w-4 text-slate-400" />
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
