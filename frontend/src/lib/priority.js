// Single source of truth for the priority system.
//   P1 Safety / Emergency   -> Red
//   P2 Owner / Important    -> Amber
//   P3 Admin / Normal       -> Blue
//   P4 Low Priority         -> Slate / Gray
// Every component reads styling from here, so the whole app stays consistent.

export const PRIORITY = {
  p1: {
    key: "p1",
    label: "Priority 1",
    short: "P1",
    name: "Safety / Emergency",
    note: "Safety & critical building issues",
    dot: "bg-red-500",
    text: "text-red-700",
    badge: "bg-red-50 text-red-700 ring-1 ring-red-200",
    border: "border-l-red-500",
    hex: "#ef4444",
    chipActive: "bg-red-500 text-white",
    chipIdle: "bg-red-50 text-red-700 hover:bg-red-100",
    block: "bg-red-50 border-red-200",
    soft: "bg-red-50",
  },
  p2: {
    key: "p2",
    label: "Priority 2",
    short: "P2",
    name: "Owner / Important",
    note: "Property owner & important requests",
    dot: "bg-amber-500",
    text: "text-amber-700",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    border: "border-l-amber-500",
    hex: "#f59e0b",
    chipActive: "bg-amber-500 text-white",
    chipIdle: "bg-amber-50 text-amber-700 hover:bg-amber-100",
    block: "bg-amber-50 border-amber-200",
    soft: "bg-amber-50",
  },
  p3: {
    key: "p3",
    label: "Priority 3",
    short: "P3",
    name: "Admin / Normal",
    note: "Administrative work",
    dot: "bg-sky-500",
    text: "text-sky-700",
    badge: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    border: "border-l-sky-400",
    hex: "#38bdf8",
    chipActive: "bg-sky-500 text-white",
    chipIdle: "bg-sky-50 text-sky-700 hover:bg-sky-100",
    block: "bg-sky-50 border-sky-200",
    soft: "bg-sky-50",
  },
  p4: {
    key: "p4",
    label: "Priority 4",
    short: "P4",
    name: "Low Priority",
    note: "Low priority / no action needed",
    dot: "bg-slate-400",
    text: "text-slate-600",
    badge: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    border: "border-l-slate-300",
    hex: "#94a3b8",
    chipActive: "bg-slate-500 text-white",
    chipIdle: "bg-slate-100 text-slate-600 hover:bg-slate-200",
    block: "bg-slate-50 border-slate-200",
    soft: "bg-slate-50",
  },
};

export const PRIORITY_ORDER = ["p1", "p2", "p3", "p4"];

// rank: lower number = more urgent (P1 first)
const RANK = { p1: 0, p2: 1, p3: 2, p4: 3 };

export function priorityStyle(level) {
  return PRIORITY[level] || PRIORITY.p3;
}

export function priorityRank(level) {
  return RANK[level] ?? 99;
}

// Comparator for same-day ordering: P1 -> P4, then by time/received.
export function comparePriority(a, b) {
  const r = priorityRank(a.priority) - priorityRank(b.priority);
  if (r !== 0) return r;
  const ta = a.time || a.slot_time || a.received_at || "";
  const tb = b.time || b.slot_time || b.received_at || "";
  return String(ta).localeCompare(String(tb));
}

export function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
