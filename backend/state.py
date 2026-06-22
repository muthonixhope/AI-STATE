"""In-memory runtime state for the prototype (no database).

Holds mutable data that changes while the demo runs: task status overrides and
documents uploaded during the session. Resets on server restart.
"""

import copy

from data.documents import DOCUMENTS

# documents library = seeded mock docs + anything uploaded during the session
UPLOADED_DOCUMENTS = []

# task overrides keyed by email_id: {status, title, slot_time}
TASK_OVERRIDES = {}


def all_documents():
    return list(DOCUMENTS) + list(UPLOADED_DOCUMENTS)


def add_document(doc):
    UPLOADED_DOCUMENTS.append(doc)
    return doc


def get_task_override(email_id):
    return TASK_OVERRIDES.get(email_id, {})


def set_task_override(email_id, **changes):
    current = copy.deepcopy(TASK_OVERRIDES.get(email_id, {}))
    current.update({k: v for k, v in changes.items() if v is not None})
    TASK_OVERRIDES[email_id] = current
    return current
