import { useEffect } from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";

function Toast({ n }) {
  const { dismissNotification } = useApp();

  useEffect(() => {
    const t = setTimeout(() => dismissNotification(n.id), 8000);
    return () => clearTimeout(t);
  }, [n.id, dismissNotification]);

  const isUrgent = n.isUrgent;

  return (
    <div
      className={`flex w-full max-w-sm items-start gap-3 rounded-xl border bg-white p-4 shadow-lg transition-all ${
        isUrgent
          ? "border-red-200 border-l-4 border-l-red-500"
          : "border-slate-200 border-l-4 border-l-amber-400"
      }`}
    >
      <div
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isUrgent ? "bg-red-100" : "bg-amber-50"
        }`}
      >
        {isUrgent ? (
          <AlertTriangle className="h-4 w-4 text-red-600" />
        ) : (
          <Trash2 className="h-4 w-4 text-amber-600" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800">{n.message}</p>
        {n.actions?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {n.actions.map((a) => (
              <button
                key={a.label}
                onClick={() => {
                  a.onClick?.();
                  dismissNotification(n.id);
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  a.label === "Restore"
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : a.label === "Open email"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => dismissNotification(n.id)}
        className="ml-1 shrink-0 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function NotificationToast() {
  const { notifications } = useApp();
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((n) => (
        <Toast key={n.id} n={n} />
      ))}
    </div>
  );
}
