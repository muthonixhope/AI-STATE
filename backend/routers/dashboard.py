from fastapi import APIRouter

from ai.scheduler import build_schedule
from routers.files import _serialize
from services import classified_inbox, build_tasks
from state import all_documents

router = APIRouter(prefix="/api", tags=["dashboard"])


@router.get("/dashboard")
def dashboard():
    """One bundle for the overview tab: top emails, today's tasks, recent files."""
    inbox = classified_inbox()
    top_emails = inbox[:3]  # already sorted by priority then recency

    today_tasks = build_schedule(build_tasks(), "daily")[:5]

    files = [_serialize(d) for d in all_documents()]
    recent_files = sorted(
        files, key=lambda f: f.get("last_opened") or f["uploaded_at"], reverse=True
    )[:4]

    return {
        "top_emails": top_emails,
        "today_tasks": today_tasks,
        "recent_files": recent_files,
        "stats": {
            "total_emails": len(inbox),
            "p1": sum(1 for e in inbox if e["priority"] == "p1"),
            "p2": sum(1 for e in inbox if e["priority"] == "p2"),
            "p3": sum(1 for e in inbox if e["priority"] == "p3"),
        },
    }
