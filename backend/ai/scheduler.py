"""Turn classified emails into a prioritized task schedule.

High-priority items are placed earliest. Returns a FLAT list of tasks, each
annotated with placement fields so the frontend calendar can lay them out:

  daily   -> slot_time ("HH:MM")
  weekly  -> weekday ("Mon".."Fri") + slot_time   (P1 earlier in the day)
  monthly -> date ("2026-06-DD") + slot_time       (P1 on earlier days)
"""

# deterministic anchor month/day so the demo always looks consistent
WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"]
DAILY_SLOTS = ["08:00", "09:30", "11:00", "13:00", "14:30", "16:00", "17:30"]
# spread monthly tasks across June 2026 (urgent first -> earlier days)
MONTH_DAYS = [3, 5, 9, 11, 16, 18, 23, 24, 25, 26, 29, 30]


def _sorted_tasks(tasks):
    # higher priority weight first; within a tier, earlier received first
    return sorted(tasks, key=lambda t: (-t["priority_weight"], t["received_at"]))


def build_schedule(tasks, view="daily"):
    """Return a flat list of placed tasks for the requested view."""
    ordered = _sorted_tasks([t for t in tasks if t["status"] != "rejected"])

    if view == "weekly":
        return _weekly(ordered)
    if view == "monthly":
        return _monthly(ordered)
    return _daily(ordered)


def _daily(ordered):
    placed = []
    for idx, task in enumerate(ordered):
        slot = DAILY_SLOTS[idx] if idx < len(DAILY_SLOTS) else "18:00"
        placed.append({**task, "slot_time": slot})
    return placed


def _weekly(ordered):
    # round-robin across weekdays; position within a day -> a time slot,
    # so higher-priority tasks (earlier in `ordered`) get earlier slots.
    per_day_count = {d: 0 for d in WEEKDAYS}
    placed = []
    for idx, task in enumerate(ordered):
        day = WEEKDAYS[idx % len(WEEKDAYS)]
        pos = per_day_count[day]
        per_day_count[day] += 1
        slot = DAILY_SLOTS[pos] if pos < len(DAILY_SLOTS) else "18:00"
        placed.append({**task, "weekday": day, "slot_time": slot})
    return placed


def _monthly(ordered):
    placed = []
    for idx, task in enumerate(ordered):
        day = MONTH_DAYS[idx] if idx < len(MONTH_DAYS) else 30
        slot = DAILY_SLOTS[idx % len(DAILY_SLOTS)]
        placed.append({**task, "date": f"2026-06-{day:02d}", "slot_time": slot})
    return placed
