"""Generate professional draft replies grounded in the document library.

Detects the tenant's intent, looks up the relevant file, extracts the real
answer, and fills a professional template. Drafts are NEVER auto-sent.
"""

from ai.document_parser import extract_fields

INTENTS = [
    ("contract_expiration", ("expire", "expiration", "renew", "end of lease", "lease end")),
    ("rent_amount", ("how much", "rent amount", "monthly rent", "my rent")),
    ("payment_status", ("balance", "overdue", "outstanding", "payment status", "owe")),
    ("repair_status", ("repair", "fixed", "fix", "maintenance", "leak", "heat")),
    ("contract_copy", ("copy of", "send me my contract", "copy of my contract")),
]


def detect_intent(text):
    lowered = (text or "").lower()
    for intent, triggers in INTENTS:
        if any(t in lowered for t in triggers):
            return intent
    return "general"


def _find_doc(tenant_id, documents, doc_types=None):
    for doc in documents:
        if doc["tenant_id"] != tenant_id:
            continue
        if doc_types and doc["doc_type"] not in doc_types:
            continue
        return doc
    return None


def generate_draft(email, tenant, documents):
    """Return {intent, draft, grounded_on} for a tenant question."""
    intent = detect_intent(email["body"] + " " + email["subject"])
    name = tenant["name"] if tenant else "Tenant"
    first = name.split()[0]
    grounded_on = None
    body = None

    if intent in ("contract_expiration", "rent_amount", "contract_copy"):
        doc = _find_doc(email["tenant_id"], documents, {"Tenant Contract"})
        if doc:
            grounded_on = doc["file_name"]
            fields = extract_fields(doc["raw_text"])
            if intent == "contract_expiration":
                body = (
                    f"Dear {first},\n\n"
                    f"Thank you for reaching out. According to your lease agreement on "
                    f"file, your contract is set to expire on "
                    f"{fields.get('contract_expiration')}. If you would like to renew, "
                    f"please let us know at least 30 days in advance and we will be happy "
                    f"to prepare the paperwork.\n\n"
                    f"Best regards,\nProperty Management Team"
                )
            elif intent == "rent_amount":
                body = (
                    f"Dear {first},\n\n"
                    f"Thank you for your message. Your current monthly rent is "
                    f"{fields.get('rent_amount')}, as stated in your lease agreement. "
                    f"Please let us know if you have any further questions.\n\n"
                    f"Best regards,\nProperty Management Team"
                )
            else:  # contract_copy
                body = (
                    f"Dear {first},\n\n"
                    f"Thank you for reaching out. Please find a copy of your rental "
                    f"contract attached. For your reference, your monthly rent is "
                    f"{fields.get('rent_amount')} and your lease expires on "
                    f"{fields.get('contract_expiration')}.\n\n"
                    f"Best regards,\nProperty Management Team"
                )

    elif intent == "payment_status":
        doc = _find_doc(email["tenant_id"], documents, {"Payment Record", "Invoice"})
        if doc:
            grounded_on = doc["file_name"]
            fields = extract_fields(doc["raw_text"])
            body = (
                f"Dear {first},\n\n"
                f"Thank you for your message. Our records show a payment status of "
                f"'{fields.get('payment_status')}' with an outstanding balance of "
                f"{fields.get('outstanding_balance') or '$0'}. Please let us know if "
                f"you would like to arrange a payment plan.\n\n"
                f"Best regards,\nProperty Management Team"
            )

    elif intent == "repair_status":
        doc = _find_doc(email["tenant_id"], documents, {"Repair Document"})
        body = (
            f"Dear {first},\n\n"
            f"Thank you for letting us know. We have logged your maintenance request "
            f"and a technician will be scheduled as soon as possible. We will keep you "
            f"updated on the status.\n\n"
            f"Best regards,\nProperty Management Team"
        )
        if doc:
            grounded_on = doc["file_name"]

    if body is None:
        body = (
            f"Dear {first},\n\n"
            f"Thank you for contacting us regarding \"{email['subject']}\". We have "
            f"received your message and will get back to you with a full response "
            f"shortly.\n\n"
            f"Best regards,\nProperty Management Team"
        )

    return {"intent": intent, "draft": body, "grounded_on": grounded_on}
