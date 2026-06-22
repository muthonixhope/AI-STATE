"""Extract structured fields from a document's raw text.

Simulates AI document understanding with labeled-line + regex extraction.
"""

import re

# field name -> list of regex patterns (first match wins)
PATTERNS = {
    "tenant_name": [r"Tenant:\s*(.+)"],
    "contract_start": [r"(?:Lease\s+)?Start Date:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})"],
    "contract_expiration": [
        r"(?:Lease\s+)?Expiration Date:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})",
        r"End Date:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})",
    ],
    "rent_amount": [
        r"Monthly Rent:\s*\$?([0-9,]+)",
        r"Amount Due:\s*\$?([0-9,]+)",
    ],
    "payment_status": [r"Payment Status:\s*([A-Za-z/ ]+)"],
    "outstanding_balance": [r"Outstanding Balance:\s*\$?([0-9,]+)"],
}


def _first_match(text, patterns):
    for pat in patterns:
        m = re.search(pat, text, re.IGNORECASE)
        if m:
            return m.group(1).strip()
    return None


def extract_clauses(text):
    return [m.strip() for m in re.findall(r"Key Clause:\s*(.+)", text)]


def extract_fields(raw_text):
    """Return a structured summary dict for a document."""
    text = raw_text or ""
    fields = {}
    for name, patterns in PATTERNS.items():
        fields[name] = _first_match(text, patterns)

    # normalize money fields to "$1,850" style if present
    for money_field in ("rent_amount", "outstanding_balance"):
        if fields.get(money_field):
            fields[money_field] = "$" + fields[money_field]

    fields["clauses"] = extract_clauses(text)
    return fields


def build_summary_sentence(fields, doc_type):
    """A short human-readable AI summary used on file cards."""
    tenant = fields.get("tenant_name") or "an unidentified party"
    if doc_type == "Tenant Contract":
        exp = fields.get("contract_expiration") or "an unspecified date"
        rent = fields.get("rent_amount") or "n/a"
        return f"Lease for {tenant} at {rent}/mo, expiring {exp}."
    if doc_type == "Invoice":
        amt = fields.get("rent_amount") or "n/a"
        status = fields.get("payment_status") or "unknown"
        return f"Invoice for {tenant} of {amt} ({status})."
    if doc_type == "Payment Record":
        bal = fields.get("outstanding_balance") or "$0"
        status = fields.get("payment_status") or "unknown"
        return f"Payment ledger for {tenant}: {status}, balance {bal}."
    if doc_type == "Repair Document":
        return f"Repair document related to {tenant}."
    if doc_type == "Building Document":
        return "Building-level document (not tenant-specific)."
    return f"Document associated with {tenant}."
