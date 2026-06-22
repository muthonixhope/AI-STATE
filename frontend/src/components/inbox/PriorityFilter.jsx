import { PRIORITY, PRIORITY_ORDER } from "../../lib/priority.js";

export default function PriorityFilter({ active, onChange, counts }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("all")}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
          active === "all"
            ? "bg-slate-800 text-white"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        All ({total})
      </button>
      {PRIORITY_ORDER.map((level) => {
        const s = PRIORITY[level];
        const isActive = active === level;
        return (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              isActive ? s.chipActive : s.chipIdle
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label} ({counts[level] || 0})
          </button>
        );
      })}
    </div>
  );
}
