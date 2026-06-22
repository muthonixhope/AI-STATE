// Single source of truth for the 3-tier priority system.
//   P1 Safety & critical  -> Red
//   P2 Owner requests      -> Amber
//   P3 Administrative      -> Slate-blue
// Every component reads styling from here, so the whole app stays consistent.

export const PRIORITY = {
  p1: {
    key: "p1",
    label: "Priority 1",
    short: "P1",
    note: "Safety & critical building issues",
    dot: "bg-red-500",
    text: "text-red-700",
    badge: "bg-red-50 text-red-700 ring-1 ring-red-200",
    border: "border-l-red-500",
    chipActive: "bg-red-500 text-white",
    chipIdle: "bg-red-50 text-red-700 hover:bg-red-100",
    block: "bg-red-50 border-red-200",
  },
  p2: {
    key: "p2",
    label: "Priority 2",
    short: "P2",
    note: "Property owner requests",
    dot: "bg-amber-500",
    text: "text-amber-700",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    border: "border-l-amber-500",
    chipActive: "bg-amber-500 text-white",
    chipIdle: "bg-amber-50 text-amber-700 hover:bg-amber-100",
    block: "bg-amber-50 border-amber-200",
  },
  p3: {
    key: "p3",
    label: "Priority 3",
    short: "P3",
    note: "Administrative work",
    dot: "bg-sky-500",
    text: "text-sky-700",
    badge: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    border: "border-l-sky-400",
    chipActive: "bg-sky-500 text-white",
    chipIdle: "bg-sky-50 text-sky-700 hover:bg-sky-100",
    block: "bg-sky-50 border-sky-200",
  },
};

export const PRIORITY_ORDER = ["p1", "p2", "p3"];

export function priorityStyle(level) {
  return PRIORITY[level] || PRIORITY.p3;
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
