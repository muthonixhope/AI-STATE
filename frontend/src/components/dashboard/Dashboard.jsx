import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  FolderOpen,
  Mail,
  Plus,
  Search,
  UploadCloud,
} from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import SummaryCard from "./SummaryCard.jsx";
import UrgentEmailCard from "./UrgentEmailCard.jsx";
import RecentFileCard from "./RecentFileCard.jsx";
import DashboardNotesPad from "./DashboardNotesPad.jsx";
import CalendarTaskBlock from "../calendar/CalendarTaskBlock.jsx";
import TaskModal from "../calendar/TaskModal.jsx";
import EmptyState from "../common/EmptyState.jsx";
import { PRIORITY, PRIORITY_ORDER, comparePriority } from "../../lib/priority.js";

const TODAY = "2026-06-23";

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

function SummaryBox({ label, value, accent, stripe, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className={`h-1.5 ${stripe}`} />
      <div className="flex items-center gap-3 p-4">
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500 group-hover:bg-slate-100">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
          <p className={`text-2xl font-bold ${accent}`}>{value}</p>
        </div>
      </div>
    </button>
  );
}

export default function Dashboard() {
  const {
    activeEmails,
    activeFiles,
    tasks,
    priorityCounts,
    setSection,
    openEmail,
    openEmailWithFilter,
    addNotification,
    runSearch,
  } = useApp();

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const alertedRef = useRef(false);

  const urgentEmails = useMemo(
    () => [...activeEmails].sort(comparePriority).slice(0, 4),
    [activeEmails]
  );
  const todayTasks = useMemo(
    () => tasks.filter((t) => t.date === TODAY).sort(comparePriority),
    [tasks]
  );
  const recentlyOpened = useMemo(
    () =>
      [...activeFiles]
        .filter((f) => f.last_opened)
        .sort((a, b) => (b.last_opened || "").localeCompare(a.last_opened || ""))
        .slice(0, 3),
    [activeFiles]
  );
  const recentlyUploaded = useMemo(
    () =>
      [...activeFiles]
        .sort((a, b) => (b.uploaded_at || "").localeCompare(a.uploaded_at || ""))
        .slice(0, 3),
    [activeFiles]
  );

  // one urgent-email notification per session
  useEffect(() => {
    if (alertedRef.current) return;
    const urgent = activeEmails.find((e) => e.priority === "p1");
    if (urgent) {
      alertedRef.current = true;
      addNotification({
        isUrgent: true,
        message: `Urgent email: "${urgent.subject}"`,
        actions: [{ label: "Open email", onClick: () => openEmail(urgent.id) }],
      });
    }
  }, [activeEmails, addNotification, openEmail]);

  const SUMMARY = [
    { filterKey: null, label: "Total emails", value: priorityCounts.total, accent: "text-slate-900", stripe: "bg-navy-900", icon: Mail },
    ...PRIORITY_ORDER.map((p) => ({
      filterKey: p,
      label: `${PRIORITY[p].short} · ${PRIORITY[p].name}`,
      value: priorityCounts[p] || 0,
      accent: PRIORITY[p].text,
      stripe: PRIORITY[p].dot,
      icon: AlertTriangle,
    })),
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Greeting banner */}
      <div className="overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-r from-brand-50 via-sky-50 to-white px-6 py-6">
        <h2 className="text-2xl font-bold text-slate-900">{greeting()}, Tim 👋</h2>
        <p className="mt-0.5 text-sm font-medium text-brand-600">{formattedToday()}</p>
        <p className="mt-1 text-sm text-slate-500">Here's what needs your attention today.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (search.trim()) runSearch(search.trim());
          }}
          className="mt-4 max-w-xl"
        >
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-brand-100">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search emails, files, tasks, tenants…"
              className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </form>
      </div>

      {/* Clickable priority summary boxes */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {SUMMARY.map((b) => (
          <SummaryBox
            key={b.label}
            label={b.label}
            value={b.value}
            accent={b.accent}
            stripe={b.stripe}
            icon={b.icon}
            onClick={() => openEmailWithFilter(b.filterKey)}
          />
        ))}
      </div>

      {/* Working board: urgent emails + today's tasks */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SummaryCard title="Urgent & important emails" icon={AlertTriangle} onViewAll={() => setSection("inbox")}>
          {urgentEmails.length === 0 ? (
            <EmptyState icon={Mail} title="Inbox clear" />
          ) : (
            urgentEmails.map((e) => <UrgentEmailCard key={e.id} email={e} />)
          )}
        </SummaryCard>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <CalendarClock className="h-4 w-4 text-slate-400" /> Today's tasks
            </h2>
            <button
              onClick={() => setModal({ defaultDate: TODAY })}
              className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
            >
              <Plus className="h-3.5 w-3.5" /> Add task
            </button>
          </div>
          {todayTasks.length === 0 ? (
            <EmptyState icon={CalendarClock} title="No tasks scheduled today" />
          ) : (
            <div className="space-y-2">
              {todayTasks.map((t) => (
                <CalendarTaskBlock key={t.id} task={t} onEdit={(task) => setModal({ task })} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Notes pad */}
      <DashboardNotesPad />

      {/* Files */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SummaryCard title="Recently opened files" icon={FolderOpen} onViewAll={() => setSection("files")}>
          {recentlyOpened.length === 0 ? (
            <EmptyState icon={FolderOpen} title="No files opened yet" />
          ) : (
            recentlyOpened.map((f) => <RecentFileCard key={f.id} file={f} />)
          )}
        </SummaryCard>
        <SummaryCard title="Recently uploaded files" icon={UploadCloud} onViewAll={() => setSection("files")}>
          {recentlyUploaded.map((f) => (
            <RecentFileCard key={f.id} file={f} />
          ))}
        </SummaryCard>
      </div>

      {modal && (
        <TaskModal task={modal.task} defaultDate={modal.defaultDate} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
