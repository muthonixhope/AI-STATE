import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { buildSeed } from "../data";
import { PRIORITY_ORDER } from "../lib/priority";

const AppContext = createContext(null);

const SEED = buildSeed();
const todayStr = () => new Date().toISOString().slice(0, 10);

export function AppProvider({ children }) {
  const [section, setSection] = useState("dashboard");
  const [highlightedEmailId, setHighlightedEmailId] = useState(null);
  const [draftQueue, setDraftQueue] = useState(["e7", "e10", "e4"]);

  // ── central data store (single source of truth) ──────────────
  const [emails, setEmails] = useState(SEED.emails);
  const [files, setFiles] = useState(SEED.files);
  const [tasks, setTasks] = useState(SEED.tasks);
  const [notes, setNotes] = useState(SEED.notes);
  const tenants = SEED.tenants;
  const tenantsById = useMemo(
    () => Object.fromEntries(tenants.map((t) => [t.id, t])),
    [tenants]
  );

  // deep-link filters / drawers
  const [emailFilter, setEmailFilter] = useState(null); // priority key or null
  const [tenantCaseId, setTenantCaseId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // soft-delete bins (full objects with deletedAt)
  const [binEmails, setBinEmails] = useState([]);
  const [binFiles, setBinFiles] = useState([]);

  // notification toasts
  const [notifications, setNotifications] = useState([]);

  // ── notifications ─────────────────────────────────────────
  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback((n) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev.slice(-2), { ...n, id }]);
    return id;
  }, []);

  // ── cross-section navigation ──────────────────────────────
  const openEmail = useCallback((emailId) => {
    setHighlightedEmailId(emailId);
    setSection("inbox");
    setTimeout(() => setHighlightedEmailId(null), 2500);
  }, []);

  const requestDraft = useCallback((emailId) => {
    setDraftQueue((q) => (q.includes(emailId) ? q : [emailId, ...q]));
    setSection("drafts");
  }, []);

  const openEmailWithFilter = useCallback((priority) => {
    setEmailFilter(priority || null);
    setSection("email");
  }, []);

  const openTenantCase = useCallback((tenantId) => {
    if (tenantId) setTenantCaseId(tenantId);
  }, []);
  const closeTenantCase = useCallback(() => setTenantCaseId(null), []);

  const runSearch = useCallback((q) => {
    setSearchQuery(q);
    setSection("search");
  }, []);

  // ── email priority override ───────────────────────────────
  const setEmailPriority = useCallback((emailId, priority) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.id === emailId
          ? { ...e, priority, priorityOverridden: priority !== e.aiPriority }
          : e
      )
    );
    // keep any AI-generated task for this email in sync
    setTasks((prev) =>
      prev.map((t) =>
        t.linkedEmailId === emailId && t.source === "ai" ? { ...t, priority } : t
      )
    );
  }, []);

  // ── tasks ─────────────────────────────────────────────────
  const addTask = useCallback((task) => {
    const id = task.id || `task_u${Date.now()}`;
    setTasks((prev) => [
      ...prev,
      { status: "pending", source: "manual", ...task, id },
    ]);
    return id;
  }, []);

  const updateTask = useCallback((id, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setTaskStatus = useCallback((id, status) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  // ── notes pad ─────────────────────────────────────────────
  const addNote = useCallback((note) => {
    const id = `n${Date.now()}`;
    setNotes((prev) => [...prev, { done: false, ...note, id }]);
    return id;
  }, []);
  const toggleNote = useCallback((id) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, done: !n.done } : n))
    );
  }, []);
  const deleteNote = useCallback((id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // ── files ─────────────────────────────────────────────────
  const uploadFile = useCallback((fileObj) => {
    const id = fileObj.id || `up${Date.now()}`;
    const finalized = {
      uploaded_at: todayStr(),
      last_opened: null,
      tenantId: null,
      fields: {},
      ...fileObj,
      id,
    };
    setFiles((prev) => [finalized, ...prev]);
    return finalized;
  }, []);

  const openFile = useCallback((id) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, last_opened: todayStr() } : f))
    );
  }, []);

  // ── restore helpers ───────────────────────────────────────
  const restoreEmail = useCallback((emailId) => {
    setBinEmails((prev) => prev.filter((e) => e.id !== emailId));
  }, []);
  const restoreFile = useCallback((fileId) => {
    setBinFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  // ── delete (soft) ─────────────────────────────────────────
  const deleteEmail = useCallback((email) => {
    setBinEmails((prev) => {
      if (prev.some((e) => e.id === email.id)) return prev;
      return [...prev, { ...email, deletedAt: new Date().toISOString() }];
    });
    const nid = Date.now() + Math.random();
    setNotifications((prev) => [
      ...prev.slice(-2),
      {
        id: nid,
        type: "delete",
        message: `Deleted email "${email.subject}"`,
        actions: [
          {
            label: "Restore",
            onClick: () => {
              setBinEmails((p) => p.filter((e) => e.id !== email.id));
              setNotifications((p) => p.filter((n) => n.id !== nid));
            },
          },
          {
            label: "Ignore",
            onClick: () => setNotifications((p) => p.filter((n) => n.id !== nid)),
          },
        ],
      },
    ]);
  }, []);

  const deleteFile = useCallback((file) => {
    setBinFiles((prev) => {
      if (prev.some((f) => f.id === file.id)) return prev;
      return [...prev, { ...file, deletedAt: new Date().toISOString() }];
    });
    const nid = Date.now() + Math.random();
    setNotifications((prev) => [
      ...prev.slice(-2),
      {
        id: nid,
        type: "delete",
        message: `Deleted file "${file.file_name}"`,
        actions: [
          {
            label: "Restore",
            onClick: () => {
              setBinFiles((p) => p.filter((f) => f.id !== file.id));
              setNotifications((p) => p.filter((n) => n.id !== nid));
            },
          },
          {
            label: "Ignore",
            onClick: () => setNotifications((p) => p.filter((n) => n.id !== nid)),
          },
        ],
      },
    ]);
  }, []);

  // ── derived selectors ─────────────────────────────────────
  const deletedEmailIds = useMemo(
    () => new Set(binEmails.map((e) => e.id)),
    [binEmails]
  );
  const deletedFileIds = useMemo(
    () => new Set(binFiles.map((f) => f.id)),
    [binFiles]
  );
  const activeEmails = useMemo(
    () => emails.filter((e) => !deletedEmailIds.has(e.id)),
    [emails, deletedEmailIds]
  );
  const activeFiles = useMemo(
    () => files.filter((f) => !deletedFileIds.has(f.id)),
    [files, deletedFileIds]
  );

  const priorityCounts = useMemo(() => {
    const counts = { total: activeEmails.length };
    for (const p of PRIORITY_ORDER) counts[p] = 0;
    for (const e of activeEmails) counts[e.priority] = (counts[e.priority] || 0) + 1;
    return counts;
  }, [activeEmails]);

  const value = {
    section,
    setSection,
    highlightedEmailId,
    openEmail,
    draftQueue,
    setDraftQueue,
    requestDraft,
    // data
    emails,
    files,
    tasks,
    notes,
    tenants,
    tenantsById,
    activeEmails,
    activeFiles,
    priorityCounts,
    // mutations
    setEmailPriority,
    addTask,
    updateTask,
    deleteTask,
    setTaskStatus,
    addNote,
    toggleNote,
    deleteNote,
    uploadFile,
    openFile,
    // deep links / drawers
    emailFilter,
    setEmailFilter,
    openEmailWithFilter,
    tenantCaseId,
    openTenantCase,
    closeTenantCase,
    searchQuery,
    setSearchQuery,
    runSearch,
    // bin
    binEmails,
    binFiles,
    deleteEmail,
    deleteFile,
    restoreEmail,
    restoreFile,
    // notifications
    notifications,
    addNotification,
    dismissNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
