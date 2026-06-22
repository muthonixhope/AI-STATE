import { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { api } from "../../api/client.js";

const SAMPLE_NAMES = [
  "lease_contract_new_tenant.pdf",
  "invoice_electrical_repair.pdf",
  "payment_record_june.pdf",
  "building_inspection_report.pdf",
];

export default function FileUpload({ onUploaded }) {
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const inputRef = useRef(null);

  async function handleFiles(names) {
    if (!names.length) return;
    setAnalyzing(true);
    // simulate the AI "reading" the document before it appears in the library
    for (const name of names) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 900));
      // eslint-disable-next-line no-await-in-loop
      const { file } = await api.uploadFile(name);
      onUploaded?.(file);
    }
    setAnalyzing(false);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const names = Array.from(e.dataTransfer.files).map((f) => f.name);
    handleFiles(names.length ? names : [pickSample()]);
  }

  function pickSample() {
    return SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
        dragging
          ? "border-brand-500 bg-brand-50"
          : "border-slate-300 bg-white hover:border-brand-400 hover:bg-slate-50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(Array.from(e.target.files).map((f) => f.name))}
      />
      {analyzing ? (
        <>
          <Loader2 className="mb-3 h-8 w-8 animate-spin text-brand-600" />
          <p className="text-sm font-semibold text-slate-700">
            AI is analyzing your document...
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Detecting tenant, document type, and key details
          </p>
        </>
      ) : (
        <>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Drag &amp; drop files here, or click to browse
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Contracts, invoices, repair docs, payment records, building documents
          </p>
        </>
      )}
    </div>
  );
}
