import { useState } from "react";
import { Search, Mail, FileText, Users, CheckSquare, X } from "lucide-react";
import { api } from "../../api/client.js";
import { priorityStyle } from "../../lib/priority.js";
import { useApp } from "../../context/AppContext.jsx";

const GROUPS = [
  { key: "emails", label: "Emails", icon: Mail, section: "inbox" },
  { key: "files", label: "Files", icon: FileText, section: "files" },
  { key: "tenants", label: "Tenants", icon: Users, section: "inbox" },
  { key: "tasks", label: "Tasks", icon: CheckSquare, section: "calendar" },
];

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setSection, openEmail } = useApp();

  function run(q) {
    setQuery(q);
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    api
      .globalSearch(q)
      .then(setResults)
      .finally(() => setLoading(false));
  }

  function go(groupKey, item) {
    if (groupKey === "emails") openEmail(item.id);
    else if (groupKey === "tasks") openEmail(item.email_id);
    else setSection(GROUPS.find((g) => g.key === groupKey).section);
    setResults(null);
    setQuery("");
  }

  const totalCount = results
    ? GROUPS.reduce((n, g) => n + (results[g.key]?.length || 0), 0)
    : 0;

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <input
        value={query}
        onChange={(e) => run(e.target.value)}
        placeholder="Search everything — emails, files, tenants, tasks..."
        className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-10 text-sm shadow-card focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
      {query && (
        <button
          onClick={() => run("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {results && (
        <div className="absolute z-20 mt-2 max-h-[28rem] w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
          {loading && <p className="px-3 py-2 text-xs text-slate-400">Searching…</p>}
          {totalCount === 0 && !loading && (
            <p className="px-3 py-4 text-center text-xs text-slate-400">
              No matches for “{query}”
            </p>
          )}
          {GROUPS.map(({ key, label, icon: Icon }) => {
            const items = results[key] || [];
            if (items.length === 0) return null;
            return (
              <div key={key} className="mb-1">
                <p className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  <Icon className="h-3 w-3" /> {label} ({items.length})
                </p>
                {items.slice(0, 5).map((item) => (
                  <button
                    key={`${key}-${item.id}`}
                    onClick={() => go(key, item)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-700">
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="truncate text-xs text-slate-400">{item.subtitle}</p>
                      )}
                    </div>
                    {item.priority && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityStyle(item.priority).badge}`}
                      >
                        {priorityStyle(item.priority).short}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
