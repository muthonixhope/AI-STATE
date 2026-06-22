# AI-STATE

# AIstate — AI Assistant for Real Estate Managers

A clean, modern dashboard prototype that helps real estate managers handle tenant
**emails, files, contracts, repair requests, and scheduling** more efficiently.

The "AI" is **simulated with rule-based Python functions** (no real LLM, email, or file
APIs) so the prototype runs fully offline on mock data — ideal for a university project or
client demo.

> Two-tier app: a **FastAPI** backend that does the AI work and owns the mock data, and a
> **React + Vite + Tailwind** frontend that fetches from it over REST.

---

## Features

| Section | What it does |
|---|---|
| **Dashboard** | The first tab: a calm overview with global search (across emails, files, tenants, tasks), quick priority stats, the most urgent emails, today's tasks, and recently opened files. |
| **Prioritized Inbox** | Imports tenant **and property-owner** mail and classifies each into a **3-tier priority** system — 🔴 **P1 Safety & critical** (burst pipes, HVAC failure, fire/gas/electrical), 🟠 **P2 Owner requests** (CAPEX, budget, BREEAM, lease), 🔵 **P3 Administrative** (service charges, routine questions). Each card shows the contact + role, subject, AI summary, priority, why it was flagged, and a suggested next action. |
| **Task Calendar** | Turns the inbox into a prioritized plan with **Daily / Weekly / Monthly** calendar views — weekly day-columns with timed task blocks, a monthly planner grid with a side panel (top priorities, notes, upcoming deadlines). P1 items are placed earliest. Accept, reject, edit a task, or open the linked email. |
| **File Library** | Drag-and-drop upload that simulates AI ingestion, plus a library with **type filters and sorting** (recently uploaded/opened, contract expiration, alphabetical). Each card shows file name, detected tenant, type, upload + last-opened dates, contract expiration, and an AI summary. |
| **Search Documents** | Search the library; the AI extracts and summarizes tenant name, contract start/expiration, rent, payment status, outstanding balance, and key clauses. |
| **Draft Email Replies** | For a tenant or owner question, the AI checks the documents and drafts a professional reply grounded in the real data. **Nothing is sent automatically** — you review, edit, approve, or reject. |

---

## How the simulated AI works (where to look)

All logic lives in `backend/ai/` as small, readable, pure functions:

- `priority_engine.py` — weighted keyword classifier → 3-tier priority (P1/P2/P3) + the
  matched reasons. Owner/asset-manager mail is elevated to at least P2.
- `summarizer.py` — email summary + suggested action.
- `document_parser.py` — regex/labeled-line field extraction from document text.
- `scheduler.py` — orders tasks by priority into daily/weekly/monthly views.
- `draft_generator.py` — detects intent, looks up the right file, fills a reply template.
- `search.py` — ranks and summarizes document matches.

Mock data is in `backend/data/` (`tenants.py`, `emails.py`, `documents.py`).

---

## Running it

You need **Python 3.10+** and **Node.js 18+**. Use two terminals.

### 1. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Interactive API docs (Swagger): <http://localhost:8000/docs>

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (default <http://localhost:5173>). The dev server proxies
`/api` calls to the backend on port 8000.

---

## Project structure

```
AI STATE/
├── backend/            FastAPI app
│   ├── main.py         app + CORS + routers
│   ├── ai/             rule-based "AI" modules
│   ├── data/           mock tenants / emails / documents
│   ├── routers/        /api/dashboard, /inbox, /schedule, /files, /search, /drafts
│   ├── services.py     composes AI modules with data
│   └── state.py        in-memory runtime store (no database)
└── frontend/           React + Vite + Tailwind
    └── src/
        ├── api/client.js
        ├── context/AppContext.jsx
        ├── lib/priority.js   centralized 3-tier priority styles
        └── components/       dashboard / inbox / calendar / files / search / drafts
```

## Notes & scope

- All data is mock and held **in memory** — restarting the backend resets uploads and task
  status. There is no database, authentication, or real email/file integration by design.
- Drafts are never auto-sent; the manager always approves first (human-in-the-loop).

