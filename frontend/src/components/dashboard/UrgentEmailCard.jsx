import { ArrowRight } from "lucide-react";
import PriorityBadge from "../common/PriorityBadge.jsx";
import { priorityStyle } from "../../lib/priority.js";
import { useApp } from "../../context/AppContext.jsx";

export default function UrgentEmailCard({ email }) {
  const s = priorityStyle(email.priority);
  const { openEmail } = useApp();
  return (
    <button
      onClick={() => openEmail(email.id)}
      className={`block w-full rounded-xl border border-slate-200 border-l-4 bg-white p-3 text-left transition-colors hover:bg-slate-50 ${s.border}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">
            {email.contact_name}
            <span className="ml-1.5 text-xs font-normal text-slate-400">
              {email.contact_role}
            </span>
          </p>
          <p className="truncate text-sm text-slate-600">{email.subject}</p>
        </div>
        <PriorityBadge level={email.priority} />
      </div>
      <p className="mt-1.5 line-clamp-2 text-xs text-slate-500">{email.summary}</p>
      <p className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${s.text}`}>
        <ArrowRight className="h-3 w-3" />
        {email.suggested_action}
      </p>
    </button>
  );
}
