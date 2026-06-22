import { priorityStyle } from "../../lib/priority.js";

export default function PriorityBadge({ level, showDot = true }) {
  const s = priorityStyle(level);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.badge}`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />}
      {s.label}
    </span>
  );
}
