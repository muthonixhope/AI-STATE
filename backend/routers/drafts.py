from fastapi import APIRouter, HTTPException

from ai.draft_generator import generate_draft
from data.emails import EMAILS
from data.tenants import get_tenant
from models import DraftRequest
from state import all_documents

router = APIRouter(prefix="/api/drafts", tags=["drafts"])

EMAILS_BY_ID = {e["id"]: e for e in EMAILS}


@router.post("/generate")
def generate(req: DraftRequest):
    email = EMAILS_BY_ID.get(req.email_id)
    if not email:
        raise HTTPException(status_code=404, detail="email not found")
    tenant = get_tenant(email["tenant_id"])
    result = generate_draft(email, tenant, all_documents())
    return {
        "email_id": email["id"],
        "tenant_name": tenant["name"] if tenant else "Tenant",
        "subject": email["subject"],
        "question": email["body"],
        "intent": result["intent"],
        "grounded_on": result["grounded_on"],
        "draft": result["draft"],
        "status": "draft",  # never auto-sent
    }
