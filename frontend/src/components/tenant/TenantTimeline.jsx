import {
  FileText,
  Wrench,
  AlertTriangle,
  CreditCard,
  MessageSquare,
  Inbox,
} from "lucide-react";
import { formatDate } from "../../lib/priority.js";

const ICONS = {
  lease: FileText,
  repair: Wrench,
  complaint: AlertTriangle,
  payment: CreditCard,
  request: Inbox,
  note: MessageSquare,
};

const TONE = {
  lease: "text-brand-600 bg-brand-50",
  repair: "text-amber-600 bg-amber-50",
  complaint: "text-red-600 bg-red-50",
  payment: "text-emerald-600 bg-emerald-50",
  request: "text-sky-600 bg-sky-50",
  note: "text-slate-500 bg-slate-100",
};

export default function TenantTimeline({ events = [] }) {
  if (!events.length) {
    return <p className="text-sm text-slate-400">No history recorded yet.</p>;
  }
  const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <ol className="relative space-y-4 border-l border-slate-200 pl-5">
      {sorted.map((ev, i) => {
        const Icon = ICONS[ev.type] || MessageSquare;
        const tone = TONE[ev.type] || TONE.note;
        return (
          <li key={i} className="relative">
            <span
              className={`absolute -left-[30px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white ${tone}`}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <p className="text-sm font-medium text-slate-800">{ev.label}</p>
            <p className="text-xs text-slate-400">{formatDate(ev.date)}</p>
          </li>
        );
      })}
    </ol>
  );
}
