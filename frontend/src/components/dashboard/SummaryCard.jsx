import { ArrowRight } from "lucide-react";

export default function SummaryCard({ title, icon: Icon, onViewAll, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          {Icon && <Icon className="h-4 w-4 text-slate-400" />}
          {title}
        </h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
