import { useCallback, useEffect, useState } from "react";
import { api } from "../../api/client.js";
import ScheduleViewToggle from "../schedule/ScheduleViewToggle.jsx";
import DailyCalendarView from "./DailyCalendarView.jsx";
import WeeklyCalendarView from "./WeeklyCalendarView.jsx";
import MonthlyCalendarView from "./MonthlyCalendarView.jsx";
import Spinner from "../common/Spinner.jsx";

export default function TaskCalendar() {
  const [view, setView] = useState("weekly");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api
      .getSchedule(view)
      .then((d) => setTasks(d.tasks))
      .finally(() => setLoading(false));
  }, [view]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Tasks are auto-ordered by priority — P1 safety issues are placed earliest.
        </p>
        <ScheduleViewToggle view={view} onChange={setView} />
      </div>

      {loading ? (
        <Spinner label="Building your calendar..." />
      ) : view === "daily" ? (
        <DailyCalendarView tasks={tasks} onChanged={load} />
      ) : view === "weekly" ? (
        <WeeklyCalendarView tasks={tasks} onChanged={load} />
      ) : (
        <MonthlyCalendarView tasks={tasks} onChanged={load} />
      )}
    </div>
  );
}
