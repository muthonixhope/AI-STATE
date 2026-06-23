import { useState } from "react";
import { StickyNote, Plus, Check } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { formatDate } from "../../lib/priority.js";

export default function DashboardNotesPad() {
  const { notes, addNote, toggleNote, deleteNote, tenants } = useApp();
  const [text, setText] = useState("");
  const [tenant, setTenant] = useState("");
  const [due, setDue] = useState("");

  const active = notes.filter((n) => !n.done);
  const doneCount = notes.length - active.length;

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    addNote({ text: text.trim(), tenant: tenant || null, dueDate: due || null });
    setText("");
    setTenant("");
    setDue("");
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <StickyNote className="h-4 w-4 text-slate-400" /> Quick notes
        </h2>
        {doneCount > 0 && (
          <span className="text-[11px] text-slate-400">{doneCount} completed</span>
        )}
      </div>

      <form onSubmit={submit} className="mb-4 space-y-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a quick reminder…"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            className="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-600 focus:outline-none"
          >
            <option value="">Tenant (optional)</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-600 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
          >
            <Plus className="h-3.5 w-3.5" /> Add note
          </button>
        </div>
      </form>

      {active.length === 0 ? (
        <p className="text-sm text-slate-400">No active notes. You're all caught up. 🎉</p>
      ) : (
        <ul className="space-y-2">
          {active.map((n) => (
            <li
              key={n.id}
              className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2"
            >
              <button
                onClick={() => toggleNote(n.id)}
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-slate-300 text-transparent hover:border-emerald-500 hover:text-emerald-500"
                title="Mark done"
              >
                <Check className="h-3 w-3" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-700">{n.text}</p>
                <div className="mt-0.5 flex flex-wrap gap-2 text-[11px] text-slate-400">
                  {n.tenant && <span>{n.tenant}</span>}
                  {n.dueDate && <span>· due {formatDate(n.dueDate)}</span>}
                </div>
              </div>
              <button
                onClick={() => deleteNote(n.id)}
                className="text-[11px] font-medium text-slate-300 hover:text-red-500"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
