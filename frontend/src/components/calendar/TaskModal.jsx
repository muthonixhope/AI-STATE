import { useState } from "react";
import { X } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { PRIORITY, PRIORITY_ORDER } from "../../lib/priority.js";

// Add + edit task in one modal. Pass `task` to edit, or `defaultDate` to
// pre-fill the date when adding from a specific day.
export default function TaskModal({ task, defaultDate, onClose }) {
  const { tenants, activeEmails, activeFiles, addTask, updateTask, deleteTask } = useApp();
  const editing = Boolean(task);

  const [form, setForm] = useState(() => ({
    title: task?.title || "",
    tenantId: task?.tenantId || "",
    date: task?.date || defaultDate || new Date().toISOString().slice(0, 10),
    time: task?.time || "09:00",
    priority: task?.priority || "p3",
    linkedEmailId: task?.linkedEmailId || "",
    linkedFileId: task?.linkedFileId || "",
    notes: task?.notes || "",
  }));

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function save() {
    if (!form.title.trim()) return;
    const tenant = tenants.find((t) => t.id === form.tenantId);
    const payload = {
      title: form.title.trim(),
      tenantId: form.tenantId || null,
      tenant_name: tenant?.name || null,
      date: form.date,
      time: form.time,
      priority: form.priority,
      linkedEmailId: form.linkedEmailId || null,
      linkedFileId: form.linkedFileId || null,
      notes: form.notes,
    };
    if (editing) updateTask(task.id, payload);
    else addTask(payload);
    onClose();
  }

  const label = "text-[11px] font-semibold uppercase tracking-wide text-slate-400";
  const input =
    "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 p-4 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-lift">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h3 className="text-base font-bold text-slate-900">
            {editing ? "Edit task" : "Add task"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="scroll-area max-h-[70vh] space-y-4 overflow-y-auto p-5">
          <div>
            <label className={label}>Task title</label>
            <input
              className={input}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Dispatch plumber to Unit 12A"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Date</label>
              <input type="date" className={input} value={form.date} onChange={(e) => set("date", e.target.value)} />
            </div>
            <div>
              <label className={label}>Time</label>
              <input type="time" className={input} value={form.time} onChange={(e) => set("time", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Priority</label>
              <select className={input} value={form.priority} onChange={(e) => set("priority", e.target.value)}>
                {PRIORITY_ORDER.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY[p].short} · {PRIORITY[p].name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Tenant</label>
              <select className={input} value={form.tenantId} onChange={(e) => set("tenantId", e.target.value)}>
                <option value="">— None —</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Linked email</label>
              <select className={input} value={form.linkedEmailId} onChange={(e) => set("linkedEmailId", e.target.value)}>
                <option value="">— None —</option>
                {activeEmails.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Linked file</label>
              <select className={input} value={form.linkedFileId} onChange={(e) => set("linkedFileId", e.target.value)}>
                <option value="">— None —</option>
                {activeFiles.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.file_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={label}>Notes</label>
            <textarea
              rows={3}
              className={input}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Optional notes…"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 p-4">
          {editing ? (
            <button
              onClick={() => {
                deleteTask(task.id);
                onClose();
              }}
              className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              Delete task
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={!form.title.trim()}
              className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {editing ? "Save changes" : "Add task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
