import { createContext, useContext, useState, useCallback } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [section, setSection] = useState("dashboard");
  const [highlightedEmailId, setHighlightedEmailId] = useState(null);
  const [draftQueue, setDraftQueue] = useState(["e7", "e10", "e4"]);

  // Soft-delete bins (full objects with deletedAt timestamp)
  const [binEmails, setBinEmails] = useState([]);
  const [binFiles, setBinFiles] = useState([]);

  // Notification toasts
  const [notifications, setNotifications] = useState([]);

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

  // ── notifications ─────────────────────────────────────────
  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback((n) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev.slice(-2), { ...n, id }]);
    return id;
  }, []);

  // ── restore helpers (used both in BinSection and in toast actions) ──
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
    // Build notification with inline restore/dismiss actions
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
            onClick: () =>
              setNotifications((p) => p.filter((n) => n.id !== nid)),
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
            onClick: () =>
              setNotifications((p) => p.filter((n) => n.id !== nid)),
          },
        ],
      },
    ]);
  }, []);

  const value = {
    section,
    setSection,
    highlightedEmailId,
    openEmail,
    draftQueue,
    setDraftQueue,
    requestDraft,
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
