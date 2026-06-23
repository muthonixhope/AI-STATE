import { ArrowRight, UserSquare } from "lucide-react";
import { priorityStyle } from "../../lib/priority.js";
import { useApp } from "../../context/AppContext.jsx";

export default function UrgentEmailCard({ email }) {
  const s = priorityStyle(email.priority);
  const { openEmail, openTenantCase } = useApp();
  return (
    <div
      className={`rounded-xl border border-l-4 border-slate-200 bg-white p-3 transition-colors hover:bg-slate-50 ${s.border}`}
    >
      <div className="flex items-start justify-between gap-2">
        <button onClick={() => openEmail(email.id)} className="min-w-0 text-left">
          <p className="truncate text-sm font-semibold text-slate-800">
            {email.tenant_name}
            <span className="ml-1.5 text-xs font-normal text-slate-400">{email.contact_role}</span>
          </p>
          <p className="truncate text-sm text-slate-600">{email.subject}</p>
        </button>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${s.badge}`}>
          {s.short}
        </span>
      </div>
      <p className="mt-1.5 line-clamp-2 text-xs text-slate-500">{email.summary}</p>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <p className={`flex items-center gap-1 text-xs font-medium ${s.text}`}>
          <ArrowRight className="h-3 w-3" />
          {email.suggested_action}
        </p>
        {email.tenantId && (
          <button
            onClick={() => openTenantCase(email.tenantId)}
            className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-brand-600 hover:underline"
          >
            <UserSquare className="h-3 w-3" /> Case
          </button>
        )}
      </div>
    </div>
  );
}
