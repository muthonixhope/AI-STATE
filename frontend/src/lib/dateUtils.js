// Small date helpers for the calendar (all work on "YYYY-MM-DD" strings).

function pad(n) {
  return String(n).padStart(2, "0");
}

export function toISO(date) {
  const d = date instanceof Date ? date : new Date(date);
  // build from LOCAL components — toISOString() would shift the day in
  // timezones with a positive UTC offset.
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parse(iso) {
  return new Date(iso + "T00:00:00");
}

export function addDays(iso, n) {
  const d = parse(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function addMonths(iso, n) {
  const d = parse(iso);
  d.setMonth(d.getMonth() + n);
  return toISO(d);
}

// Monday-based start of week
export function startOfWeek(iso) {
  const d = parse(iso);
  const day = (d.getDay() + 6) % 7; // Mon=0 … Sun=6
  d.setDate(d.getDate() - day);
  return toISO(d);
}

export function weekDays(iso) {
  const start = startOfWeek(iso);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

// 6x7 grid covering the month that contains `iso`
export function monthGrid(iso) {
  const d = parse(iso);
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const gridStart = startOfWeek(toISO(first));
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

export function isSameMonth(iso, refIso) {
  return parse(iso).getMonth() === parse(refIso).getMonth();
}

export function fmtDayLong(iso) {
  return parse(iso).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function fmtDayShort(iso) {
  return parse(iso).toLocaleDateString(undefined, { weekday: "short", day: "numeric" });
}

export function fmtMonthYear(iso) {
  return parse(iso).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export function fmtWeekRange(iso) {
  const days = weekDays(iso);
  const a = parse(days[0]);
  const b = parse(days[6]);
  const opts = { month: "short", day: "numeric" };
  return `${a.toLocaleDateString(undefined, opts)} – ${b.toLocaleDateString(undefined, opts)}`;
}

export function dayNum(iso) {
  return parse(iso).getDate();
}
