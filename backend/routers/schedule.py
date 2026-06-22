from fastapi import APIRouter, HTTPException

from ai.scheduler import build_schedule
from models import TaskActionRequest, TaskEditRequest
from services import build_tasks
from state import set_task_override

router = APIRouter(prefix="/api/schedule", tags=["schedule"])


def _email_id_from_task(task_id):
    # task ids look like "task_e1"
    return task_id.replace("task_", "", 1)


@router.get("")
def get_schedule(view: str = "daily"):
    """Return the prioritized task schedule (flat, placed) for the view."""
    if view not in ("daily", "weekly", "monthly"):
        raise HTTPException(status_code=400, detail="invalid view")
    tasks = build_schedule(build_tasks(), view)
    return {"view": view, "tasks": tasks}


@router.post("/{task_id}/action")
def task_action(task_id: str, req: TaskActionRequest):
    if req.action not in ("accept", "reject"):
        raise HTTPException(status_code=400, detail="invalid action")
    status = "accepted" if req.action == "accept" else "rejected"
    email_id = _email_id_from_task(task_id)
    set_task_override(email_id, status=status)
    return {"task_id": task_id, "status": status}


@router.put("/{task_id}")
def edit_task(task_id: str, req: TaskEditRequest):
    email_id = _email_id_from_task(task_id)
    override = set_task_override(email_id, title=req.title, slot_time=req.slot_time)
    return {"task_id": task_id, "override": override}
