import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  FolderOpen,
  Mail,
  CircleDot,
  Inbox as InboxIcon,
} from "lucide-react";
import { api } from "../../api/client.js";
import { useApp } from "../../context/AppContext.jsx";
import GlobalSearch from "./GlobalSearch.jsx";
import SummaryCard from "./SummaryCard.jsx";
import UrgentEmailCard from "./UrgentEmailCard.jsx";
import TodayTaskCard from "./TodayTaskCard.jsx";
import RecentFileCard from "./RecentFileCard.jsx";
import Spinner from "../common/Spinner.jsx";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formattedToday() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ColorStatCard({ label, value, accent, borderColor, icon: Icon }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
      <div className={`h-1.5 ${borderColor}`} />
      <div className="flex items-center gap-3 p-4">
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className={`text-2xl font-bold ${accent}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setSection, addNotification, openEmail } = useApp();
  const alertedRef = useRef(false);

  const load = useCallback(() => {
    api
      .getDashboard()
      .then((d) => {
        setData(d);
        // Show one urgent-email notification per session
        if (!alertedRef.current) {
          const urgent = d.top_emails?.find((e) => e.priority === "p1");
          if (urgent) {
            alertedRef.current = true;
            addNotification({
              isUrgent: true,
              message: `Urgent email: "${urgent.subject}"`,
              actions: [
                {
                  label: "Open email",
                  onClick: () => openEmail(urgent.id),
                },
              ],
            });
          }
        }
      })
      .finally(() => setLoading(false));
  }, [addNotification, openEmail]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading || !data) {
    return (
      <div className="p-6">
        <Spinner label="Building your dashboard..." />
      </div>
    );
  }

  const s = data.stats;

  return (
    <div className="space-y-6 p-6">
      {/* Greeting banner */}
      <div className="rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-50 via-sky-50 to-white px-6 py-5">
        <h2 className="text-xl font-bold text-slate-900">
          {greeting()}, Tim 👋
        </h2>
        <p className="mt-0.5 text-sm font-medium text-brand-600">
          {formattedToday()}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Here's what needs your attention today.
        </p>
      </div>

      <GlobalSearch />

      {/* Coloured stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <ColorStatCard
          label="Total emails"
          value={s.total_emails}
          accent="text-slate-900"
          borderColor="bg-sky-400"
          icon={Mail}
        />
        <ColorStatCard
          label="P1 · Safety"
          value={s.p1}
          accent="text-red-600"
          borderColor="bg-red-500"
          icon={AlertTriangle}
        />
        <ColorStatCard
          label="P2 · Owner"
          value={s.p2}
          accent="text-amber-600"
          borderColor="bg-amber-500"
          icon={CircleDot}
        />
        <ColorStatCard
          label="P3 · Admin"
          value={s.p3}
          accent="text-sky-700"
          borderColor="bg-sky-400"
          icon={InboxIcon}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <SummaryCard
            title="Most urgent emails"
            icon={AlertTriangle}
            onViewAll={() => setSection("inbox")}
          >
            {data.top_emails.map((e) => (
              <UrgentEmailCard key={e.id} email={e} />
            ))}
          </SummaryCard>

          <SummaryCard
            title="Today's tasks"
            icon={CalendarClock}
            onViewAll={() => setSection("calendar")}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {data.today_tasks.map((t) => (
                <TodayTaskCard key={t.id} task={t} onChanged={load} />
              ))}
            </div>
          </SummaryCard>
        </div>

        <div className="lg:col-span-1">
          <SummaryCard
            title="Recently opened files"
            icon={FolderOpen}
            onViewAll={() => setSection("files")}
          >
            {data.recent_files.map((f) => (
              <RecentFileCard key={f.id} file={f} />
            ))}
          </SummaryCard>
        </div>
      </div>
    </div>
  );
}
