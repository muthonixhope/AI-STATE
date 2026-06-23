import { Home, Mail, Phone, CalendarDays, Wallet, AlertCircle } from "lucide-react";
import { formatDate } from "../../lib/priority.js";

function Row({ icon: Icon, label, value, tone = "text-slate-700" }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className={`text-sm font-medium ${tone}`}>{value}</p>
      </div>
    </div>
  );
}

export default function TenantProfileCard({ tenant }) {
  const overdue = tenant.paymentStatus === "Overdue";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 text-lg font-bold text-white">
          {tenant.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">{tenant.name}</h3>
          <p className="text-sm text-slate-500">
            Unit {tenant.unit} · {tenant.building}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Row icon={Mail} label="Email" value={tenant.contact?.email || "—"} />
        <Row icon={Phone} label="Phone" value={tenant.contact?.phone || "—"} />
        <Row icon={Wallet} label="Monthly Rent" value={tenant.lease?.rent || "—"} />
        <Row
          icon={AlertCircle}
          label="Payment Status"
          value={overdue ? `Overdue (${tenant.outstandingBalance})` : tenant.paymentStatus}
          tone={overdue ? "text-red-600" : "text-emerald-600"}
        />
        <Row icon={CalendarDays} label="Lease Start" value={formatDate(tenant.lease?.start)} />
        <Row icon={CalendarDays} label="Lease Expiry" value={formatDate(tenant.lease?.expiry)} />
      </div>

      {tenant.clauses?.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
            <Home className="h-3.5 w-3.5" /> Key lease clauses
          </p>
          <ul className="space-y-1">
            {tenant.clauses.map((c, i) => (
              <li key={i} className="text-sm text-slate-600">• {c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
