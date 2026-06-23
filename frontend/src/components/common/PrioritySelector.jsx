import { PRIORITY, PRIORITY_ORDER, priorityStyle } from "../../lib/priority.js";

// Compact priority override control. The AI sets the initial priority; the
// manager can change it here and the whole app re-syncs from central state.
export default function PrioritySelector({ value, aiValue, overridden, onChange, size = "sm" }) {
  const style = priorityStyle(value);
  const pad = size === "sm" ? "py-1 pl-2.5 pr-7 text-xs" : "py-1.5 pl-3 pr-8 text-sm";

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className={`appearance-none rounded-full font-semibold ring-1 transition focus:outline-none focus:ring-2 ${style.badge} ${pad}`}
          title="Change priority"
        >
          {PRIORITY_ORDER.map((p) => (
            <option key={p} value={p}>
              {PRIORITY[p].short} · {PRIORITY[p].name}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 opacity-60"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.5 7.5L10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      {overridden && (
        <span
          className="text-[10px] font-medium text-slate-400"
          title={`AI suggested ${PRIORITY[aiValue]?.short || "—"}`}
        >
          Manually changed · AI: {PRIORITY[aiValue]?.short}
        </span>
      )}
    </div>
  );
}
