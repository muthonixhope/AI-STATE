import { useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  Wrench,
  ReceiptText,
  Building,
  CalendarClock,
  Eye,
  Expand,
  Trash2,
} from "lucide-react";
import { formatDate } from "../../lib/priority.js";
import { useApp } from "../../context/AppContext.jsx";
import FilePreviewModal from "./FilePreviewModal.jsx";
import { api } from "../../api/client.js";

const TYPE_META = {
  "Tenant Contract": { icon: FileText, color: "text-brand-600 bg-brand-50" },
  Invoice: { icon: ReceiptText, color: "text-orange-600 bg-orange-50" },
  "Repair Document": { icon: Wrench, color: "text-amber-600 bg-amber-50" },
  "Payment Record": { icon: FileSpreadsheet, color: "text-emerald-600 bg-emerald-50" },
  "Building Document": { icon: Building, color: "text-slate-600 bg-slate-100" },
};

export default function FileCard({ file, isNew }) {
  const meta = TYPE_META[file.doc_type] || TYPE_META["Tenant Contract"];
  const Icon = meta.icon;
  const [previewOpen, setPreviewOpen] = useState(false);
  const { deleteFile } = useApp();

  function handleOpen() {
    api.openFile(file.id).catch(() => {});
    setPreviewOpen(true);
  }

  return (
    <>
      <div
        className={`rounded-xl border bg-white shadow-card transition-all ${
          isNew ? "border-brand-300 ring-2 ring-brand-100" : "border-slate-200"
        }`}
      >
        {/* Coloured top stripe */}
        <div
          className={`h-1.5 rounded-t-xl ${
            file.doc_type === "Tenant Contract"
              ? "bg-brand-400"
              : file.doc_type === "Invoice"
              ? "bg-orange-400"
              : file.doc_type === "Repair Document"
              ? "bg-amber-400"
              : file.doc_type === "Payment Record"
              ? "bg-emerald-400"
              : "bg-slate-400"
          }`}
        />

        <div className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${meta.color}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {file.file_name}
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400">
                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-500">
                  {file.doc_type}
                </span>
                {file.tenant_name && <span>· {file.tenant_name}</span>}
                <span>· {file.uploaded_at}</span>
              </div>
            </div>
            <button
              onClick={() => deleteFile(file)}
              title="Delete file"
              className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-400">AI summary: </span>
            {file.summary}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" /> Opened {formatDate(file.last_opened)}
            </span>
            {file.contract_expiration && (
              <span className="inline-flex items-center gap-1 font-medium text-amber-600">
                <CalendarClock className="h-3 w-3" /> Expires{" "}
                {formatDate(file.contract_expiration)}
              </span>
            )}
          </div>

          <button
            onClick={handleOpen}
            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-100"
          >
            <Expand className="h-3.5 w-3.5" />
            Open file
          </button>
        </div>
      </div>

      {previewOpen && (
        <FilePreviewModal fileId={file.id} onClose={() => setPreviewOpen(false)} />
      )}
    </>
  );
}
