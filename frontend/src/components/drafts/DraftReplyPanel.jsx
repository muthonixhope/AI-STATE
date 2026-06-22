import { Mail } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import DraftCard from "./DraftCard.jsx";
import EmptyState from "../common/EmptyState.jsx";

export default function DraftReplyPanel() {
  const { draftQueue, setDraftQueue } = useApp();

  function remove(emailId) {
    setDraftQueue((q) => q.filter((id) => id !== emailId));
  }

  return (
    <div className="space-y-5 p-6">
      <p className="text-sm text-slate-500">
        For each tenant or owner question, the AI checks your uploaded files and prepares a
        professional reply. You stay in control — review, edit, and approve before anything
        is sent.
      </p>

      {draftQueue.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No drafts queued"
          hint="Open the inbox and click “Draft AI reply” on an email"
        />
      ) : (
        <div className="space-y-4">
          {draftQueue.map((emailId) => (
            <DraftCard key={emailId} emailId={emailId} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  );
}
