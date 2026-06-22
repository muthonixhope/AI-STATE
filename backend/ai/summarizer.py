"""Email summarization + suggested-action simulation (3-tier model)."""

import re

ACTION_BY_LEVEL = {
    "p1": "Dispatch emergency response now and notify the building manager",
    "p2": "Review and forward to the owner / asset management team",
    "p3": "Handle as routine administrative work",
}

# more specific actions keyed on detected topics (checked before the tier default)
ACTION_RULES = [
    (("gas", "carbon monoxide"), "Evacuate if needed, call the gas company, dispatch a technician"),
    (("no heat", "no cooling", "cooling system", "hvac", "heating system"),
     "Dispatch an HVAC technician on priority"),
    (("burning smell", "spark", "electrical", "exposed wire"),
     "Dispatch a licensed electrician immediately"),
    (("burst pipe", "pipe burst", "water pipe", "flood", "leak", "leaking", "water damage"),
     "Send a plumber and document any water damage"),
    (("capex", "capital expenditure"), "Prepare a CAPEX summary for owner approval"),
    (("budget",), "Compile the figures and schedule a budget review with the owner"),
    (("breeam", "certification"), "Gather the certification documents and respond to the owner"),
    (("lease restructuring", "rent review", "lease renewal"),
     "Loop in asset management on the lease request"),
    (("service charge", "invoice"), "Log the invoice and update the service-charge ledger"),
    (("parking", "permit"), "Send the parking / permit instructions"),
    (("expire", "expiration", "renew"), "Look up the contract and confirm the date"),
    (("copy of",), "Attach the requested document and reply"),
]


def summarize_email(text):
    """Condense an email body to a short, AI-style summary (1 sentence)."""
    cleaned = re.sub(r"\s+", " ", (text or "").strip())
    if not cleaned:
        return "No content."
    sentences = re.split(r"(?<=[.!?])\s+", cleaned)
    summary = sentences[0]
    if len(summary.split()) <= 4 and len(sentences) > 1:
        summary = sentences[1]
    summary = summary.strip()
    if len(summary) > 160:
        summary = summary[:157].rstrip() + "..."
    if summary and summary[-1] not in ".!?":
        summary += "."
    return summary[0].upper() + summary[1:] if summary else summary


def suggest_action(level, text):
    lowered = (text or "").lower()
    for triggers, action in ACTION_RULES:
        if any(t in lowered for t in triggers):
            return action
    return ACTION_BY_LEVEL.get(level, "Review and respond")
