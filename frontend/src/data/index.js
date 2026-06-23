// Seed builder: runs the (frontend) AI engine over the raw data to produce the
// fully-classified emails, parsed files, and a dated task schedule. Called once
// by AppContext to populate the central store.

import { TENANTS, getTenant } from "./tenants";
import { RAW_EMAILS } from "./emails";
import { RAW_FILES } from "./files";
import {
  classifyPriority,
  summarizeEmail,
  suggestAction,
  extractFields,
  buildSummarySentence,
} from "../lib/aiEngine";
import { priorityRank } from "../lib/priority";

// Fixed "today" for the demo so dates line up with the seeded data.
export const TODAY_ISO = "2026-06-23";

function addDays(iso, days) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  const pad = (n) => String(n).padStart(2, "0");
  // local components — avoid the UTC day-shift from toISOString()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function buildEmails() {
  return RAW_EMAILS.map((e) => {
    const role = e.contact_role || "Tenant";
    const tenant = getTenant(e.tenantId) || {};
    const name = e.contact_name || tenant.name || "Unknown tenant";
    const building = e.building || tenant.building || "—";
    const unit = tenant.unit || "—";
    const { level, reasons } = classifyPriority(e.subject + ". " + e.body, role);
    const priority = e.seedPriority || level;
    return {
      id: e.id,
      tenantId: e.tenantId,
      tenant_name: name,
      contact_role: role,
      unit,
      building,
      subject: e.subject,
      body: e.body,
      received_at: e.received_at,
      aiPriority: level,
      priority,
      priorityOverridden: Boolean(e.seedPriority) && e.seedPriority !== level,
      reasons,
      summary: summarizeEmail(e.body),
      suggested_action: suggestAction(priority, e.body),
    };
  });
}

function buildFiles() {
  return RAW_FILES.map((f) => {
    const tenant = getTenant(f.tenantId) || {};
    const fields = extractFields(f.raw_text);
    return {
      ...f,
      tenant_name: fields.tenant_name || tenant.name || null,
      fields,
      contract_expiration: fields.contract_expiration || null,
      summary: buildSummarySentence(fields, f.doc_type),
      isText: false, // seeded docs render their raw_text block
    };
  });
}

// Build a dated task schedule from the actionable emails (P1–P3) plus a few
// manual reminders, so the calendar has realistic spread.
function buildTasks(emails) {
  const actionable = emails
    .filter((e) => e.priority !== "p4")
    .sort((a, b) => {
      const r = priorityRank(a.priority) - priorityRank(b.priority);
      if (r !== 0) return r;
      return a.received_at.localeCompare(b.received_at);
    });

  const SLOTS = ["08:00", "09:30", "11:00", "13:00", "14:30", "16:00", "17:30"];
  // P1/P2 land today; P3 move to the next working days.
  const perDay = {};
  const tasks = actionable.map((e, idx) => {
    let dayOffset;
    if (e.priority === "p1") dayOffset = 0;
    else if (e.priority === "p2") dayOffset = 0;
    else dayOffset = 1 + Math.floor((idx % 6) / 3); // P3 -> tomorrow / +2
    const date = addDays(TODAY_ISO, dayOffset);
    perDay[date] = (perDay[date] || 0) + 1;
    const slot = SLOTS[(perDay[date] - 1) % SLOTS.length];
    return {
      id: `task_${e.id}`,
      title: e.suggested_action,
      tenantId: e.tenantId,
      tenant_name: e.tenant_name,
      date,
      time: slot,
      priority: e.priority,
      linkedEmailId: e.id,
      linkedFileId: null,
      notes: e.subject,
      status: "pending",
      source: "ai",
    };
  });

  // A few manual reminders spread across the month for the monthly view.
  const manual = [
    {
      id: "task_m1",
      title: "Send lease renewal notice to Aisha Khan",
      tenantId: "t7",
      tenant_name: "Aisha Khan",
      date: addDays(TODAY_ISO, 5),
      time: "10:00",
      priority: "p3",
      linkedEmailId: "e7",
      linkedFileId: "d2",
      notes: "Lease expires 2026-09-30 — give 30+ days notice.",
      status: "pending",
      source: "manual",
    },
    {
      id: "task_m2",
      title: "Follow up on Daniel Martin electrical invoice ($840)",
      tenantId: "t10",
      tenant_name: "Daniel Martin",
      date: addDays(TODAY_ISO, 7),
      time: "11:30",
      priority: "p3",
      linkedEmailId: null,
      linkedFileId: "d7",
      notes: "Invoice unpaid — send reminder.",
      status: "pending",
      source: "manual",
    },
    {
      id: "task_m3",
      title: "Quarterly fire-safety check — Parkview",
      tenantId: null,
      tenant_name: "Parkview Apartments",
      date: addDays(TODAY_ISO, 12),
      time: "09:00",
      priority: "p2",
      linkedEmailId: null,
      linkedFileId: "d6",
      notes: "Test smoke detectors per certificate.",
      status: "pending",
      source: "manual",
    },
  ];

  return [...tasks, ...manual];
}

export function buildSeed() {
  const emails = buildEmails();
  const files = buildFiles();
  const tasks = buildTasks(emails);
  const notes = [
    {
      id: "n1",
      text: "Call gas company to confirm Maria Garcia callout completed",
      tenant: "Maria Garcia",
      dueDate: TODAY_ISO,
      done: false,
    },
    {
      id: "n2",
      text: "Chase David Okafor overdue rent ($1,400)",
      tenant: "David Okafor",
      dueDate: addDays(TODAY_ISO, 2),
      done: false,
    },
  ];
  return { tenants: TENANTS, emails, files, tasks, notes };
}
