import random
from datetime import date

from fastapi import APIRouter, HTTPException

from ai.document_parser import extract_fields, build_summary_sentence
from data.tenants import find_tenant_by_name, TENANTS
from models import FileUploadRequest
from state import add_document, all_documents

router = APIRouter(prefix="/api/files", tags=["files"])


def _serialize(doc):
    fields = extract_fields(doc["raw_text"])
    tenant_name = fields.get("tenant_name")
    return {
        "id": doc["id"],
        "file_name": doc["file_name"],
        "doc_type": doc["doc_type"],
        "uploaded_at": doc["uploaded_at"],
        "last_opened": doc.get("last_opened", doc["uploaded_at"]),
        "contract_expiration": fields.get("contract_expiration"),
        "tenant_name": tenant_name,
        "summary": build_summary_sentence(fields, doc["doc_type"]),
        "fields": fields,
    }


def _serialize_full(doc):
    fields = extract_fields(doc["raw_text"])
    base = _serialize(doc)
    base["fields"] = fields
    base["raw_text"] = doc.get("raw_text", "")
    return base


@router.get("")
def list_files():
    return {"files": [_serialize(d) for d in all_documents()]}


@router.get("/{file_id}")
def get_file(file_id: str):
    for doc in all_documents():
        if doc["id"] == file_id:
            return {"file": _serialize_full(doc)}
    raise HTTPException(status_code=404, detail="File not found")


@router.post("/{file_id}/open")
def mark_opened(file_id: str):
    for doc in all_documents():
        if doc["id"] == file_id:
            doc["last_opened"] = date.today().isoformat()
            return {"ok": True, "last_opened": doc["last_opened"]}
    raise HTTPException(status_code=404, detail="File not found")


def _guess_doc_type(name):
    n = name.lower()
    if "contract" in n or "lease" in n:
        return "Tenant Contract"
    if "invoice" in n:
        return "Invoice"
    if "repair" in n or "maintenance" in n:
        return "Repair Document"
    if "payment" in n or "ledger" in n:
        return "Payment Record"
    if "building" in n or "fire" in n or "safety" in n:
        return "Building Document"
    return "Tenant Contract"


@router.post("/upload")
def upload_file(req: FileUploadRequest):
    """Simulate AI ingestion of an uploaded file.

    We don't read real bytes — we synthesize realistic parsed text so the new
    file behaves like the seeded ones (detected tenant, type, summary).
    """
    doc_type = req.doc_type or _guess_doc_type(req.file_name)
    tenant = random.choice(TENANTS)
    new_id = f"u{random.randint(1000, 9999)}"
    raw_text = (
        f"{doc_type.upper()}\n"
        f"Tenant: {tenant['name']}\n"
        f"Property: {tenant['building']}, Unit {tenant['unit']}\n"
        f"Monthly Rent: $1,750\n"
        f"Payment Status: Current\n"
        f"Outstanding Balance: $0\n"
        f"Lease Start Date: 2025-06-01\n"
        f"Lease Expiration Date: 2026-12-31\n"
        f"Key Clause: Auto-generated summary for the uploaded document.\n"
    )
    doc = {
        "id": new_id,
        "file_name": req.file_name,
        "tenant_id": tenant["id"],
        "doc_type": doc_type,
        "uploaded_at": date.today().isoformat(),
        "last_opened": date.today().isoformat(),
        "raw_text": raw_text,
    }
    add_document(doc)
    return {"file": _serialize(doc)}
