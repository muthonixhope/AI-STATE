import { useState } from "react";
import { Sparkles, Search, Bell } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";

const TITLES = {
  dashboard: { title: "Dashboard", subtitle: "Your day at a glance — priorities, tasks, and files" },
  email: { title: "All Emails", subtitle: "Read, reply, and manage every email in one place" },
  inbox: { title: "Prioritized Inbox", subtitle: "AI-triaged mail, sorted into priority tiers" },
  calendar: { title: "Task Calendar", subtitle: "Plan your day, week, and month" },
  files: { title: "File Library", subtitle: "Upload, read, and organize tenant documents" },
  search: { title: "Search", subtitle: "Find anything across emails, files, tasks, and tenants" },
  drafts: { title: "Draft Email Replies", subtitle: "AI drafts grounded in your documents — you approve before sending" },
  chatbot: { title: "Document Chatbot", subtitle: "Ask anything about tenants, contracts, rents, and invoices" },
  bin: { title: "Bin", subtitle: "Deleted emails and files — restore them any time" },
};

export default function TopBar({ section }) {
  const meta = TITLES[section] || TITLES.dashboard;
  const { runSearch } = useApp();
  const [q, setQ] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) runSearch(q.trim());
  };

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white/80 px-6 py-3.5 backdrop-blur">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-bold text-slate-900">{meta.title}</h1>
        <p className="truncate text-sm text-slate-500">{meta.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <form onSubmit={submit} className="hidden md:block">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 focus-within:border-brand-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for something…"
              className="w-48 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none lg:w-64"
            />
          </div>
        </form>

        <button className="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-brand-600 sm:flex">
          <Bell className="h-4 w-4" />
        </button>

        <div className="hidden items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 sm:flex">
          <Sparkles className="h-3.5 w-3.5" />
          AI Assistant Active
        </div>
      </div>
    </header>
  );
}
