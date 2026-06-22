import {
  LayoutGrid,
  MailOpen,
  Inbox,
  CalendarClock,
  FolderUp,
  Search,
  Mail,
  Trash2,
  Bot,
  Building2,
} from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { key: "email", label: "All Emails", icon: MailOpen },
  { key: "inbox", label: "Prioritized Inbox", icon: Inbox },
  { key: "calendar", label: "Task Calendar", icon: CalendarClock },
  { key: "files", label: "File Library", icon: FolderUp },
  { key: "search", label: "Search Documents", icon: Search },
  { key: "drafts", label: "Draft Replies", icon: Mail },
  { key: "chatbot", label: "Document Chatbot", icon: Bot },
  { key: "bin", label: "Bin", icon: Trash2 },
];

export default function Sidebar() {
  const { section, setSection, binEmails, binFiles } = useApp();
  const binCount = binEmails.length + binFiles.length;

  return (
    <aside className="flex w-16 flex-col bg-gradient-to-b from-slate-800 to-slate-900 md:w-64">
      {/* Brand */}
      <div className="flex items-center gap-2.5 border-b border-slate-700/50 px-4 py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white">
          <Building2 className="h-5 w-5" />
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-bold leading-tight text-white">AIstate</p>
          <p className="text-[11px] text-slate-400">Real Estate Assistant</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2 md:p-3">
        {NAV.map(({ key, label, icon: Icon }) => {
          const active = section === key;
          const isBin = key === "bin";
          return (
            <button
              key={key}
              onClick={() => setSection(key)}
              title={label}
              className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="hidden md:inline">{label}</span>
              {isBin && binCount > 0 && (
                <span className="ml-auto hidden h-5 min-w-5 items-center justify-center rounded-full bg-slate-600 px-1.5 text-[11px] font-bold text-slate-200 md:flex">
                  {binCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="hidden border-t border-slate-700/50 p-4 md:block">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
            T
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">Tim</p>
            <p className="text-[11px] text-slate-400">Property Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
