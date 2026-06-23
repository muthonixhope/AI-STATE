import { useMemo, useState } from "react";
import { Inbox as InboxIcon, Mail } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import EmailCard from "./EmailCard.jsx";
import PriorityFilter from "./PriorityFilter.jsx";
import StatCard from "../common/StatCard.jsx";
import EmptyState from "../common/EmptyState.jsx";
import { PRIORITY, PRIORITY_ORDER, comparePriority } from "../../lib/priority.js";

export default function PrioritizedInbox() {
  const { activeEmails, highlightedEmailId, priorityCounts } = useApp();
  const [filter, setFilter] = useState("all");

  const counts = useMemo(() => {
    const c = {};
    for (const p of PRIORITY_ORDER) c[p] = priorityCounts[p] || 0;
    return c;
  }, [priorityCounts]);

  const visible = useMemo(() => {
    const list =
      filter === "all" ? activeEmails : activeEmails.filter((e) => e.priority === filter);
    return [...list].sort(comparePriority);
  }, [activeEmails, filter]);

  return (
    <div className="space-y-5 p-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total emails" value={priorityCounts.total} icon={Mail} />
        {PRIORITY_ORDER.map((p) => (
          <StatCard
            key={p}
            label={`${PRIORITY[p].short} · ${PRIORITY[p].name}`}
            value={counts[p]}
            accent={PRIORITY[p].text}
            icon={InboxIcon}
          />
        ))}
      </div>

      <PriorityFilter active={filter} onChange={setFilter} counts={counts} />

      {visible.length === 0 ? (
        <EmptyState icon={InboxIcon} title="No emails in this category" />
      ) : (
        <div className="space-y-3">
          {visible.map((email) => (
            <EmailCard
              key={email.id}
              email={email}
              highlighted={highlightedEmailId === email.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
