import { Mail, FileText, RotateCcw, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import EmptyState from "../common/EmptyState.jsx";
import { formatDate } from "../../lib/priority.js";
import PriorityBadge from "../common/PriorityBadge.jsx";

function BinRow({ item, type, onRestore }) {
  const isEmail = type === "email";
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-card">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          isEmail ? "bg-sky-50 text-sky-600" : "bg-brand-50 text-brand-600"
        }`}
      >
        {isEmail ? <Mail className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">
          {isEmail ? item.subject : item.file_name}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400">
          {item.tenant_name && <span>{item.tenant_name}</span>}
          {isEmail && item.building && <span>· {item.building}</span>}
          {isEmail && item.priority && (
            <PriorityBadge level={item.priority} showDot={false} />
          )}
          {!isEmail && item.doc_type && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-500">
              {item.doc_type}
            </span>
          )}
          <span>· Deleted {formatDate(item.deletedAt)}</span>
        </div>
      </div>

      <button
        onClick={onRestore}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Restore
      </button>
    </div>
  );
}

export default function BinSection() {
  const { binEmails, binFiles, restoreEmail, restoreFile } = useApp();
  const isEmpty = binEmails.length === 0 && binFiles.length === 0;

  if (isEmpty) {
    return (
      <div className="p-6">
        <EmptyState
          icon={Trash2}
          title="Your bin is empty"
          hint="Deleted emails and files will appear here. You can restore them at any time."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {binEmails.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-700">
              Deleted Emails
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                {binEmails.length}
              </span>
            </h3>
          </div>
          <div className="space-y-2">
            {binEmails.map((email) => (
              <BinRow
                key={email.id}
                item={email}
                type="email"
                onRestore={() => restoreEmail(email.id)}
              />
            ))}
          </div>
        </section>
      )}

      {binFiles.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-700">
              Deleted Files
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                {binFiles.length}
              </span>
            </h3>
          </div>
          <div className="space-y-2">
            {binFiles.map((file) => (
              <BinRow
                key={file.id}
                item={file}
                type="file"
                onRestore={() => restoreFile(file.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
