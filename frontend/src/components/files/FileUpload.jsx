import { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { TENANTS } from "../../data/tenants.js";
import { extractFields, buildSummarySentence } from "../../lib/aiEngine.js";

const TEXT_EXT = ["txt", "csv", "json", "md", "log"];

function detectDocType(name) {
  const n = name.toLowerCase();
  if (n.includes("lease") || n.includes("contract")) return "Tenant Contract";
  if (n.includes("invoice")) return "Invoice";
  if (n.includes("repair") || n.includes("maintenance")) return "Repair Document";
  if (n.includes("payment") || n.includes("ledger")) return "Payment Record";
  if (n.includes("building") || n.includes("inspection") || n.includes("fire"))
    return "Building Document";
  return "Document";
}

// match a tenant by any name token appearing in filename or content
function detectTenant(haystack) {
  const h = haystack.toLowerCase();
  for (const t of TENANTS) {
    const parts = t.name.toLowerCase().split(" ");
    if (parts.some((p) => p.length > 2 && h.includes(p))) return t;
  }
  return null;
}

function summarizeText(content) {
  const cleaned = content.replace(/\s+/g, " ").trim();
  if (!cleaned) return "Empty document.";
  return cleaned.length > 180 ? cleaned.slice(0, 177) + "…" : cleaned;
}

async function analyzeFile(file) {
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const isText = TEXT_EXT.includes(ext);
  const docType = detectDocType(file.name);

  let raw_text = null;
  let blobUrl = null;
  let fields = {};
  let summary;

  if (isText) {
    raw_text = await file.text();
    fields = extractFields(raw_text);
    summary =
      fields.tenant_name || fields.rent_amount
        ? buildSummarySentence(fields, docType)
        : summarizeText(raw_text);
  } else {
    blobUrl = URL.createObjectURL(file);
    summary = `Uploaded ${docType.toLowerCase()} "${file.name}". Open to preview the original document. (Full text parsing for ${ext.toUpperCase()} runs server-side in production.)`;
  }

  const tenant = detectTenant(`${file.name} ${raw_text || ""}`);

  return {
    file_name: file.name,
    doc_type: docType,
    tenantId: tenant?.id || null,
    tenant_name: fields.tenant_name || tenant?.name || null,
    fields,
    contract_expiration: fields.contract_expiration || null,
    summary,
    raw_text,
    blobUrl,
    mime: file.type,
    isText,
  };
}

export default function FileUpload({ onUploaded }) {
  const { uploadFile } = useApp();
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const inputRef = useRef(null);

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setAnalyzing(true);
    for (const f of files) {
      // eslint-disable-next-line no-await-in-loop
      const record = await analyzeFile(f);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 600)); // brief "AI reading" beat
      const finalized = uploadFile(record);
      onUploaded?.(finalized);
    }
    setAnalyzing(false);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
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
      className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
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
        onChange={(e) => handleFiles(e.target.files)}
      />
      {analyzing ? (
        <>
          <Loader2 className="mb-3 h-8 w-8 animate-spin text-brand-600" />
          <p className="text-sm font-semibold text-slate-700">AI is reading your document…</p>
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
            .txt / .csv / .json are read &amp; summarised live · PDF, DOC, images are previewable
          </p>
        </>
      )}
    </div>
  );
}
