export default function StatCard({ label, value, accent = "text-slate-900", icon: Icon }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-card">
      {Icon && (
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className={`text-xl font-bold ${accent}`}>{value}</p>
      </div>
    </div>
  );
}
