import { useEffect, useMemo, useState } from "react";
import { Inbox as InboxIcon, AlertTriangle, Mail, CircleDot } from "lucide-react";
import { api } from "../../api/client.js";
import { useApp } from "../../context/AppContext.jsx";
import EmailCard from "./EmailCard.jsx";
import PriorityFilter from "./PriorityFilter.jsx";
import StatCard from "../common/StatCard.jsx";
import Spinner from "../common/Spinner.jsx";
import EmptyState from "../common/EmptyState.jsx";

export default function PrioritizedInbox() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { highlightedEmailId, binEmails } = useApp();

  useEffect(() => {
    api
      .getInbox()
      .then((d) => setEmails(d.emails))
      .finally(() => setLoading(false));
  }, []);

  const deletedIds = useMemo(
    () => new Set(binEmails.map((e) => e.id)),
    [binEmails]
  );

  const activeEmails = useMemo(
    () => emails.filter((e) => !deletedIds.has(e.id)),
    [emails, deletedIds]
  );

  const counts = useMemo(() => {
    return activeEmails.reduce((acc, e) => {
      acc[e.priority] = (acc[e.priority] || 0) + 1;
      return acc;
    }, {});
  }, [activeEmails]);

  const visible = useMemo(
    () =>
      filter === "all"
        ? activeEmails
        : activeEmails.filter((e) => e.priority === filter),
    [activeEmails, filter]
  );

  if (loading) {
    return (
      <div className="p-6">
        <Spinner label="AI is triaging your inbox..." />
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total emails" value={activeEmails.length} icon={Mail} />
        <StatCard
          label="P1 · Safety"
          value={counts.p1 || 0}
          accent="text-red-600"
          icon={AlertTriangle}
        />
        <StatCard
          label="P2 · Owner"
          value={counts.p2 || 0}
          accent="text-amber-600"
          icon={CircleDot}
        />
        <StatCard
          label="P3 · Admin"
          value={counts.p3 || 0}
          accent="text-sky-700"
          icon={InboxIcon}
        />
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
