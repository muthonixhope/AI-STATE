from fastapi import APIRouter

from services import classified_inbox

router = APIRouter(prefix="/api", tags=["inbox"])


@router.get("/inbox")
def get_inbox():
    """Return all tenant emails, each classified, summarized, and sorted."""
    return {"emails": classified_inbox()}
