import { Sparkles } from "lucide-react";

const TITLES = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Your day at a glance — priorities, tasks, and recent files",
  },
  email: {
    title: "All Emails",
    subtitle: "Read, reply, and manage every email in one place",
  },
  inbox: {
    title: "Prioritized Inbox",
    subtitle: "AI-triaged mail, sorted into 3 priority tiers",
  },
  calendar: {
    title: "Task Calendar",
    subtitle: "Auto-generated plan built from email priority",
  },
  files: {
    title: "File Library",
    subtitle: "Upload and organize tenant documents",
  },
  search: {
    title: "Search Documents",
    subtitle: "Find and summarize information across files",
  },
  drafts: {
    title: "Draft Email Replies",
    subtitle: "AI drafts grounded in your documents — you approve before sending",
  },
  chatbot: {
    title: "Document Chatbot",
    subtitle: "Ask anything about your tenants, contracts, rents, and invoices",
  },
  bin: {
    title: "Bin",
    subtitle: "Deleted emails and files — restore them any time",
  },
};

export default function TopBar({ section }) {
  const meta = TITLES[section] || TITLES.inbox;
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div>
        <h1 className="text-lg font-bold text-slate-900">{meta.title}</h1>
        <p className="text-sm text-brand-600">{meta.subtitle}</p>
      </div>
      <div className="hidden items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 sm:flex">
        <Sparkles className="h-3.5 w-3.5" />
        AI Assistant Active
      </div>
    </header>
  );
}
