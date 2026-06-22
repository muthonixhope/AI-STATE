"""AIstate backend — FastAPI app entrypoint.

Run with:  uvicorn main:app --reload --port 8000
Interactive API docs:  http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import inbox, schedule, files, search, drafts, dashboard

app = FastAPI(
    title="AIstate API",
    description="AI assistant for real estate managers (prototype).",
    version="1.0.0",
)

# allow the Vite dev server to call the API during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(inbox.router)
app.include_router(schedule.router)
app.include_router(files.router)
app.include_router(search.router)
app.include_router(drafts.router)


@app.get("/")
def root():
    return {"app": "AIstate", "status": "ok", "docs": "/docs"}
