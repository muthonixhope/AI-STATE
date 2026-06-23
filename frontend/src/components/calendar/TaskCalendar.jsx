import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import CalendarNavigation from "./CalendarNavigation.jsx";
import DailyCalendarView from "./DailyCalendarView.jsx";
import WeeklyCalendarView from "./WeeklyCalendarView.jsx";
import MonthlyCalendarView from "./MonthlyCalendarView.jsx";
import DayDetailPanel from "./DayDetailPanel.jsx";
import TaskModal from "./TaskModal.jsx";
import {
  addDays,
  addMonths,
  toISO,
  fmtDayLong,
  fmtWeekRange,
  fmtMonthYear,
} from "../../lib/dateUtils.js";

const VIEWS = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

export default function TaskCalendar() {
  const { tasks } = useApp();
  const [view, setView] = useState("weekly");
  const [anchor, setAnchor] = useState("2026-06-23"); // demo "today"
  const [selectedDay, setSelectedDay] = useState(null);
  const [modal, setModal] = useState(null); // {task} | {defaultDate} | null

  const tasksByDate = useMemo(() => {
    const map = {};
    for (const t of tasks) (map[t.date] = map[t.date] || []).push(t);
    return map;
  }, [tasks]);

  function shift(dir) {
    if (view === "daily") setAnchor((a) => addDays(a, dir));
    else if (view === "weekly") setAnchor((a) => addDays(a, dir * 7));
    else setAnchor((a) => addMonths(a, dir));
  }

  const label =
    view === "daily" ? fmtDayLong(anchor) : view === "weekly" ? fmtWeekRange(anchor) : fmtMonthYear(anchor);

  return (
    <div className="space-y-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CalendarNavigation
          label={label}
          onPrev={() => shift(-1)}
          onNext={() => shift(1)}
          onToday={() => setAnchor("2026-06-23")}
        />
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
            {VIEWS.map((v) => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  view === v.key ? "bg-brand-600 text-white" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setModal({ defaultDate: anchor })}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-700"
          >
            <Plus className="h-3.5 w-3.5" /> Add task
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Drag tasks to reschedule. P1 safety issues are always first within a day. Manually moved tasks are marked "Moved by manager"; AI-generated tasks show "AI scheduled".
      </p>

      {view === "daily" && (
        <DailyCalendarView
          date={anchor}
          tasksByDate={tasksByDate}
          onEdit={(task) => setModal({ task })}
          onAdd={() => setModal({ defaultDate: anchor })}
        />
      )}
      {view === "weekly" && (
        <WeeklyCalendarView
          anchor={anchor}
          tasksByDate={tasksByDate}
          onSelectDay={(d) => setSelectedDay(d)}
          onEdit={(task) => setModal({ task })}
        />
      )}
      {view === "monthly" && (
        <MonthlyCalendarView
          anchor={anchor}
          tasksByDate={tasksByDate}
          onSelectDay={(d) => setSelectedDay(d)}
        />
      )}

      {selectedDay && (
        <DayDetailPanel
          date={selectedDay}
          tasks={(tasksByDate[selectedDay] || [])}
          onClose={() => setSelectedDay(null)}
          onEdit={(task) => {
            setSelectedDay(null);
            setModal({ task });
          }}
          onAdd={() => {
            setModal({ defaultDate: selectedDay });
            setSelectedDay(null);
          }}
        />
      )}

      {modal && (
        <TaskModal
          task={modal.task}
          defaultDate={modal.defaultDate}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
