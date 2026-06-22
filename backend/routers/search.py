from fastapi import APIRouter

from ai.search import search_documents
from data.tenants import TENANTS
from services import classified_inbox, build_tasks
from state import all_documents

router = APIRouter(prefix="/api", tags=["search"])


@router.get("/search")
def search(q: str = ""):
    results = search_documents(q, all_documents())
    return {"query": q, "count": len(results), "results": results}


@router.get("/search/global")
def global_search(q: str = ""):
    """Search across emails, files, tenants, and tasks for the dashboard."""
    needle = q.strip().lower()

    def hit(*parts):
        return needle and needle in " ".join(p for p in parts if p).lower()

    emails = [
        {
            "id": e["id"],
            "title": e["subject"],
            "subtitle": f"{e['contact_name']} · {e['contact_role']}",
            "priority": e["priority"],
        }
        for e in classified_inbox()
        if not needle or hit(e["subject"], e["contact_name"], e["summary"], e["building"])
    ]

    files = [
        {
            "id": r["id"],
            "title": r["file_name"],
            "subtitle": f"{r['doc_type']}"
            + (f" · {r['fields'].get('tenant_name')}" if r["fields"].get("tenant_name") else ""),
        }
        for r in search_documents(q, all_documents())
    ]

    tenants = [
        {
            "id": t["id"],
            "title": t["name"],
            "subtitle": f"Unit {t['unit']} · {t['building']}",
        }
        for t in TENANTS
        if not needle or hit(t["name"], t["unit"], t["building"], t["email"])
    ]

    tasks = [
        {
            "id": t["id"],
            "title": t["title"],
            "subtitle": f"{t['tenant_name']} · {t['priority_label']}",
            "priority": t["priority"],
            "email_id": t["email_id"],
        }
        for t in build_tasks()
        if not needle or hit(t["title"], t["tenant_name"], t["subject"])
    ]

    return {
        "query": q,
        "emails": emails,
        "files": files,
        "tenants": tenants,
        "tasks": tasks,
    }
