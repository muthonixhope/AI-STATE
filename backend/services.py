"""Shared service helpers that compose the AI modules with the data layer."""

from ai.priority_engine import classify_priority, elevate_for_owner
from ai.summarizer import summarize_email, suggest_action
from data.emails import EMAILS
from data.tenants import get_tenant
from state import get_task_override


def classify_email(email):
    """Attach AI classification + summary + suggested action to one email.

    Handles both tenant emails and property-owner / asset-manager emails
    (which carry an explicit contact_name + contact_role instead of a tenant).
    """
    role = email.get("contact_role", "Tenant")
    tenant = get_tenant(email.get("tenant_id")) or {}
    if email.get("contact_name"):
        name = email["contact_name"]
        building = email.get("building") or tenant.get("building", "—")
        unit = tenant.get("unit", "—")
    else:
        name = tenant.get("name", "Unknown tenant")
        building = tenant.get("building", "—")
        unit = tenant.get("unit", "—")

    priority = classify_priority(email["subject"] + ". " + email["body"])
    priority = elevate_for_owner(priority, role)

    return {
        "id": email["id"],
        "tenant_id": email.get("tenant_id"),
        "tenant_name": name,
        "contact_name": name,
        "contact_role": role,
        "unit": unit,
        "building": building,
        "subject": email["subject"],
        "body": email["body"],
        "received_at": email["received_at"],
        "priority": priority["level"],
        "priority_label": priority["label"],
        "color": priority["color"],
        "priority_weight": priority["weight"],
        "reasons": priority["reasons"],
        "summary": summarize_email(email["body"]),
        "suggested_action": suggest_action(priority["level"], email["body"]),
    }


def classified_inbox():
    items = [classify_email(e) for e in EMAILS]
    items.sort(key=lambda x: (-x["priority_weight"], x["received_at"]))
    return items


def email_to_task(classified):
    """Convert a classified email into a schedulable task (with overrides)."""
    override = get_task_override(classified["id"])
    return {
        "id": f"task_{classified['id']}",
        "email_id": classified["id"],
        "title": override.get("title") or f"{classified['suggested_action']}",
        "tenant_name": classified["tenant_name"],
        "subject": classified["subject"],
        "priority": classified["priority"],
        "priority_label": classified["priority_label"],
        "color": classified["color"],
        "priority_weight": classified["priority_weight"],
        "received_at": classified["received_at"],
        "status": override.get("status", "pending"),
        "slot_time": override.get("slot_time"),
    }


def build_tasks():
    return [email_to_task(c) for c in classified_inbox()]
