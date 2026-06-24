import { useState } from "react";
import {
  LayoutGrid,
  MailOpen,
  Inbox,
  CalendarClock,
  FolderUp,
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
  { key: "drafts", label: "Draft Replies", icon: Mail },
  { key: "chatbot", label: "Document Chatbot", icon: Bot },
  { key: "bin", label: "Bin", icon: Trash2 },
];

function BrandMark() {
  // MOMENI company logo with a graceful text fallback if the image isn't placed.
  const [imgOk, setImgOk] = useState(true);
  return (
    <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
      <div className="hidden w-full md:block">
        {imgOk ? (
          <img
            src="/momeni-logo.png"
            alt="MOMENI"
            onError={() => setImgOk(false)}
            className="h-7 w-auto object-contain brightness-0 invert"
          />
        ) : (
          <p className="font-serif text-xl font-bold tracking-[0.18em] text-white">
            MOMENI
          </p>
        )}
        <p className="mt-1 text-[11px] font-medium tracking-wide text-navy-200">
          AIstate — Real Estate Assistant
        </p>
      </div>
      {/* collapsed (mobile) */}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white md:hidden">
        <Building2 className="h-5 w-5" />
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { section, setSection, binEmails, binFiles } = useApp();
  const binCount = binEmails.length + binFiles.length;

  return (
    <aside className="flex w-16 flex-col bg-gradient-to-b from-navy-900 to-navy-950 md:w-64">
      <BrandMark />

      <nav className="scroll-area flex-1 space-y-1 overflow-y-auto p-2 md:p-3">
        {NAV.map(({ key, label, icon: Icon }) => {
          const active = section === key;
          const isBin = key === "bin";
          return (
            <button
              key={key}
              onClick={() => setSection(key)}
              title={label}
              className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-brand-600 text-white shadow-soft"
                  : "text-navy-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="hidden md:inline">{label}</span>
              {isBin && binCount > 0 && (
                <span className="ml-auto hidden h-5 min-w-5 items-center justify-center rounded-full bg-white/15 px-1.5 text-[11px] font-bold text-white md:flex">
                  {binCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="hidden border-t border-white/10 p-4 md:block">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
            T
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">Tim Parker</p>
            <p className="text-[11px] text-navy-200">Real Estate Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
