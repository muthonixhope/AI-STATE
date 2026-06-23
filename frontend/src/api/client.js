// Relative /api paths work in both dev (Vite proxy) and prod (Vercel routes).
async function request(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`API ${res.status}: ${detail}`);
  }
  return res.json();
}

export const api = {
  getDashboard: () => request("/api/dashboard"),
  globalSearch: (q) => request(`/api/search/global?q=${encodeURIComponent(q)}`),
  getInbox: () => request("/api/inbox"),
  getSchedule: (view) => request(`/api/schedule?view=${view}`),
  taskAction: (taskId, action) =>
    request(`/api/schedule/${taskId}/action`, {
      method: "POST",
      body: JSON.stringify({ action }),
    }),
  editTask: (taskId, payload) =>
    request(`/api/schedule/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  getFiles: () => request("/api/files"),
  getFile: (id) => request(`/api/files/${id}`),
  openFile: (id) =>
    request(`/api/files/${id}/open`, { method: "POST" }),
  uploadFile: (fileName, docType) =>
    request("/api/files/upload", {
      method: "POST",
      body: JSON.stringify({ file_name: fileName, doc_type: docType || null }),
    }),
  search: (q) => request(`/api/search?q=${encodeURIComponent(q)}`),
  generateDraft: (emailId) =>
    request("/api/drafts/generate", {
      method: "POST",
      body: JSON.stringify({ email_id: emailId }),
    }),
};
