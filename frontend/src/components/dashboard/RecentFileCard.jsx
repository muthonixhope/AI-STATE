import { FileText } from "lucide-react";
import { formatDate } from "../../lib/priority.js";
import { useApp } from "../../context/AppContext.jsx";

export default function RecentFileCard({ file }) {
  const { setSection } = useApp();
  return (
    <button
      onClick={() => setSection("files")}
      className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-left transition-colors hover:bg-slate-50"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <FileText className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800">
            {file.file_name}
          </p>
          <p className="truncate text-xs text-slate-400">
            {file.doc_type}
            {file.tenant_name ? ` · ${file.tenant_name}` : ""}
          </p>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-xs text-slate-500">{file.summary}</p>
      <p className="mt-1.5 text-[11px] text-slate-400">
        Last opened {formatDate(file.last_opened)}
      </p>
    </button>
  );
}
