import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  FolderOpen,
  Mail,
  Plus,
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
  } = useApp();

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

      {/* ── Greeting banner with property image ─────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-r from-brand-50 via-sky-50 to-slate-100">
        {/* Building photo — right 44% */}
        <div className="absolute inset-y-0 right-0 w-[44%]">
          <img
            src="/building.jpg"
            alt="Managed property"
            className="h-full w-full object-cover object-center"
            onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
          />
          {/* gradient left-edge fade so text stays readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-50 via-sky-50/75 to-transparent" />
        </div>

        {/* Text */}
        <div className="relative px-7 py-7">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-brand-500">
            MOMENI · Property Management
          </p>
          <h2 className="text-2xl font-bold text-slate-900">{greeting()}, Tim 👋</h2>
          <p className="mt-0.5 text-sm font-semibold text-brand-600">{formattedToday()}</p>
          <p className="mt-2 text-sm text-slate-500">Here's what needs your attention today.</p>
        </div>
      </div>

      {/* ── Priority summary boxes ───────────────────────────────────── */}
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

      {/* ── Working board: urgent emails + today's tasks ─────────────── */}
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

      {/* ── Notes pad ───────────────────────────────────────────────── */}
      <DashboardNotesPad />

      {/* ── Files ───────────────────────────────────────────────────── */}
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
