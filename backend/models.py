"""Pydantic request models for the API."""

from typing import Optional

from pydantic import BaseModel


class TaskActionRequest(BaseModel):
    action: str  # "accept" | "reject"


class TaskEditRequest(BaseModel):
    title: Optional[str] = None
    slot_time: Optional[str] = None


class FileUploadRequest(BaseModel):
    file_name: str
    doc_type: Optional[str] = None


class DraftRequest(BaseModel):
    email_id: str
