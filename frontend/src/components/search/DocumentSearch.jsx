import { useEffect, useMemo, useState } from "react";
import {
  Search as SearchIcon,
  Mail,
  FileText,
  CheckSquare,
  StickyNote,
  UserSquare,
} from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import EmptyState from "../common/EmptyState.jsx";
import { priorityStyle, formatDate, formatDateTime } from "../../lib/priority.js";

const SUGGESTIONS = ["Mila", "gas smell", "Garcia", "overdue", "rent", "expiration"];

function includesQ(q, ...vals) {
  const hay = vals.filter(Boolean).join(" ").toLowerCase();
  return hay.includes(q);
}

export default function DocumentSearch() {
  const {
    searchQuery,
    setSearchQuery,
    activeEmails,
    activeFiles,
    tasks,
    notes,
    tenants,
    openEmail,
    openTenantCase,
    openFile,
    setSection,
  } = useApp();
  const [query, setQuery] = useState(searchQuery || "");

  useEffect(() => {
    setQuery(searchQuery || "");
  }, [searchQuery]);

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return null;
    return {
      tenants: tenants.filter((t) =>
        includesQ(
          q,
          t.name,
          t.unit,
          t.building,
          ...(t.requests || []),
          ...(t.complaints || []),
          ...(t.repairs || []),
          ...(t.timeline || []).map((e) => e.label)
        )
      ),
      emails: activeEmails.filter((e) =>
        includesQ(q, e.subject, e.body, e.summary, e.tenant_name)
      ),
      files: activeFiles.filter((f) =>
        includesQ(q, f.file_name, f.summary, f.raw_text, f.tenant_name, f.doc_type)
      ),
      tasks: tasks.filter((t) => includesQ(q, t.title, t.notes, t.tenant_name)),
      notes: notes.filter((n) => includesQ(q, n.text, n.tenant)),
    };
  }, [q, tenants, activeEmails, activeFiles, tasks, notes]);

  const total = results
    ? results.tenants.length +
      results.emails.length +
      results.files.length +
      results.tasks.length +
      results.notes.length
    : 0;

  return (
    <div className="space-y-5 p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearchQuery(query);
        }}
        className="relative"
      >
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchQuery(e.target.value);
          }}
          placeholder="Search emails, files, tasks, notes, and tenants…"
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm shadow-card focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400">Try:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setQuery(s);
              setSearchQuery(s);
            }}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
          >
            {s}
          </button>
        ))}
      </div>

      {!results ? (
        <EmptyState icon={SearchIcon} title="Search across everything" hint="Type a tenant name, keyword, or phrase" />
      ) : total === 0 ? (
        <EmptyState icon={SearchIcon} title={`No matches for “${query}”`} hint="Try a different keyword" />
      ) : (
        <div className="space-y-6">
          <p className="text-xs text-slate-400">
            {total} result{total === 1 ? "" : "s"} for “{query}”
          </p>

          {results.tenants.length > 0 && (
            <Group icon={UserSquare} title="Tenants" count={results.tenants.length}>
              {results.tenants.map((t) => (
                <button
                  key={t.id}
                  onClick={() => openTenantCase(t.id)}
                  className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-left shadow-card hover:bg-slate-50"
                >
                  <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-500">
                    Unit {t.unit} · {t.building} · Rent {t.lease.rent} ·{" "}
                    {t.paymentStatus === "Overdue" ? `Overdue ${t.outstandingBalance}` : t.paymentStatus}
                  </p>
                </button>
              ))}
            </Group>
          )}

          {results.emails.length > 0 && (
            <Group icon={Mail} title="Emails" count={results.emails.length}>
              {results.emails.map((e) => {
                const s = priorityStyle(e.priority);
                return (
                  <button
                    key={e.id}
                    onClick={() => openEmail(e.id)}
                    className={`block w-full rounded-xl border border-l-4 border-slate-200 bg-white p-3 text-left shadow-card hover:bg-slate-50 ${s.border}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-slate-800">{e.subject}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${s.badge}`}>{s.short}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {e.tenant_name} · {formatDateTime(e.received_at)}
                    </p>
                  </button>
                );
              })}
            </Group>
          )}

          {results.files.length > 0 && (
            <Group icon={FileText} title="Files" count={results.files.length}>
              {results.files.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    openFile(f.id);
                    setSection("files");
                  }}
                  className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-left shadow-card hover:bg-slate-50"
                >
                  <p className="text-sm font-semibold text-slate-800">{f.file_name}</p>
                  <p className="text-xs text-slate-500">{f.summary}</p>
                </button>
              ))}
            </Group>
          )}

          {results.tasks.length > 0 && (
            <Group icon={CheckSquare} title="Tasks" count={results.tasks.length}>
              {results.tasks.map((t) => {
                const s = priorityStyle(t.priority);
                return (
                  <button
                    key={t.id}
                    onClick={() => setSection("calendar")}
                    className={`block w-full rounded-xl border border-l-4 border-slate-200 bg-white p-3 text-left shadow-card hover:bg-slate-50 ${s.border}`}
                  >
                    <p className="text-sm font-semibold text-slate-800">{t.title}</p>
                    <p className="text-xs text-slate-500">
                      {formatDate(t.date)} · {t.time}
                      {t.tenant_name ? ` · ${t.tenant_name}` : ""}
                    </p>
                  </button>
                );
              })}
            </Group>
          )}

          {results.notes.length > 0 && (
            <Group icon={StickyNote} title="Notes" count={results.notes.length}>
              {results.notes.map((n) => (
                <div key={n.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-card">
                  <p className="text-sm text-slate-700">{n.text}</p>
                  {n.tenant && <p className="text-xs text-slate-400">{n.tenant}</p>}
                </div>
              ))}
            </Group>
          )}
        </div>
      )}
    </div>
  );
}

function Group({ icon: Icon, title, count, children }) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
        <Icon className="h-4 w-4 text-slate-400" /> {title}
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">{count}</span>
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
