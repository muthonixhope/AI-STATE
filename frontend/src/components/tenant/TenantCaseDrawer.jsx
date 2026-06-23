import { useMemo } from "react";
import { X, Mail, FileText, CheckSquare, ClipboardList } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { priorityStyle, formatDateTime, formatDate } from "../../lib/priority.js";
import TenantProfileCard from "./TenantProfileCard.jsx";
import TenantTimeline from "./TenantTimeline.jsx";

function Section({ icon: Icon, title, count, children }) {
  return (
    <div>
      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
        <Icon className="h-4 w-4 text-slate-400" />
        {title}
        {count != null && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
            {count}
          </span>
        )}
      </h4>
      {children}
    </div>
  );
}

export default function TenantCaseDrawer() {
  const {
    tenantCaseId,
    closeTenantCase,
    tenantsById,
    activeEmails,
    activeFiles,
    tasks,
    notes,
    openEmail,
    setSection,
    openFile,
  } = useApp();

  const tenant = tenantCaseId ? tenantsById[tenantCaseId] : null;

  const linked = useMemo(() => {
    if (!tenant) return { emails: [], files: [], openTasks: [], notes: [] };
    return {
      emails: activeEmails.filter((e) => e.tenantId === tenant.id),
      files: activeFiles.filter((f) => f.tenantId === tenant.id),
      openTasks: tasks.filter((t) => t.tenantId === tenant.id && t.status !== "done"),
      notes: notes.filter((n) => n.tenant === tenant.name),
    };
  }, [tenant, activeEmails, activeFiles, tasks, notes]);

  if (!tenant) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm animate-fade-in"
        onClick={closeTenantCase}
      />
      <aside className="relative flex h-full w-full max-w-xl flex-col bg-slate-50 shadow-lift animate-slide-in-right">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
              Tenant Case
            </p>
            <h2 className="text-lg font-bold text-slate-900">{tenant.name}</h2>
          </div>
          <button
            onClick={closeTenantCase}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="scroll-area flex-1 space-y-6 overflow-y-auto p-5">
          <TenantProfileCard tenant={tenant} />

          <Section icon={Mail} title="Emails" count={linked.emails.length}>
            {linked.emails.length === 0 ? (
              <p className="text-sm text-slate-400">No emails on file.</p>
            ) : (
              <ul className="space-y-2">
                {linked.emails.map((e) => {
                  const st = priorityStyle(e.priority);
                  return (
                    <li
                      key={e.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">{e.subject}</p>
                        <p className="text-xs text-slate-400">{formatDateTime(e.received_at)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${st.badge}`}>
                          {st.short}
                        </span>
                        <button
                          onClick={() => {
                            closeTenantCase();
                            openEmail(e.id);
                          }}
                          className="text-xs font-medium text-brand-600 hover:underline"
                        >
                          Open
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>

          <Section icon={FileText} title="Files" count={linked.files.length}>
            {linked.files.length === 0 ? (
              <p className="text-sm text-slate-400">No files on file.</p>
            ) : (
              <ul className="space-y-2">
                {linked.files.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{f.file_name}</p>
                      <p className="text-xs text-slate-400">{f.doc_type}</p>
                    </div>
                    <button
                      onClick={() => {
                        openFile(f.id);
                        closeTenantCase();
                        setSection("files");
                      }}
                      className="text-xs font-medium text-brand-600 hover:underline"
                    >
                      Open
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section icon={CheckSquare} title="Open tasks" count={linked.openTasks.length}>
            {linked.openTasks.length === 0 ? (
              <p className="text-sm text-slate-400">No open tasks.</p>
            ) : (
              <ul className="space-y-2">
                {linked.openTasks.map((t) => {
                  const st = priorityStyle(t.priority);
                  return (
                    <li
                      key={t.id}
                      className={`rounded-xl border border-l-4 ${st.border} border-slate-200 bg-white px-3 py-2`}
                    >
                      <p className="text-sm font-medium text-slate-800">{t.title}</p>
                      <p className="text-xs text-slate-400">
                        {formatDate(t.date)} · {t.time}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>

          {(tenant.requests?.length > 0 ||
            tenant.complaints?.length > 0 ||
            tenant.repairs?.length > 0) && (
            <Section icon={ClipboardList} title="Requests, complaints & repairs">
              <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3 text-sm">
                {tenant.complaints?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-red-500">Complaints</p>
                    {tenant.complaints.map((c, i) => (
                      <p key={i} className="text-slate-600">• {c}</p>
                    ))}
                  </div>
                )}
                {tenant.repairs?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-500">Repairs</p>
                    {tenant.repairs.map((c, i) => (
                      <p key={i} className="text-slate-600">• {c}</p>
                    ))}
                  </div>
                )}
                {tenant.requests?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-500">Requests</p>
                    {tenant.requests.map((c, i) => (
                      <p key={i} className="text-slate-600">• {c}</p>
                    ))}
                  </div>
                )}
              </div>
            </Section>
          )}

          <Section icon={ClipboardList} title="Case history">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <TenantTimeline events={tenant.timeline} />
            </div>
          </Section>
        </div>
      </aside>
    </div>
  );
}
