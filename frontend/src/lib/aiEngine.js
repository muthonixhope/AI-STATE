// Frontend port of the backend AI modules (priority engine, summarizer,
// document parser, draft generator). Pure functions, no network. This lets the
// whole prototype run frontend-only while keeping the original "AI does work"
// behaviour deterministic.

// ── Priority classifier ───────────────────────────────────────────
const P1_KEYWORDS = {
  "burst pipe": 10, "pipe burst": 10, "burst water": 10, "broken pipe": 9,
  "water pipe": 8, flood: 9, "water damage": 7, leak: 6, leaking: 6,
  "no heat": 8, "no cooling": 8, "cooling system": 8, "heating system": 7,
  hvac: 7, "air conditioning": 6, "no hot water": 7,
  fire: 10, smoke: 9, gas: 10, "carbon monoxide": 10, "burning smell": 9,
  spark: 8, electrical: 7, "exposed wire": 8,
  safety: 7, hazard: 7, emergency: 7, structural: 7, injury: 9,
  unsafe: 7, dangerous: 7,
};

const P2_KEYWORDS = {
  capex: 10, "capital expenditure": 10, "budget planning": 9, budget: 7,
  breeam: 10, certification: 6, valuation: 7, "asset management": 8,
  portfolio: 6, investor: 7, investment: 6, refinanc: 7,
  owner: 6, reporting: 5, "lease restructuring": 8, "rent review": 7,
  "lease renewal": 6, "service charge budget": 8,
};

const P3_KEYWORDS = {
  "service charge": 7, invoice: 5, parking: 4, permit: 4, key: 3,
  "copy of": 4, question: 3, wondering: 3, request: 2, general: 2,
  update: 2, notice: 2, confirm: 2, thank: 2, received: 1,
  contract: 3, rent: 3, payment: 3, how: 1, when: 1,
};

const BUCKETS = [
  ["p1", P1_KEYWORDS],
  ["p2", P2_KEYWORDS],
  ["p3", P3_KEYWORDS],
];

function scoreBucket(text, keywords) {
  let score = 0;
  const matched = [];
  for (const [kw, weight] of Object.entries(keywords)) {
    if (text.includes(kw)) {
      score += weight;
      matched.push(kw);
    }
  }
  return { score, matched };
}

// Returns { level, reasons, score }
export function classifyPriority(text, role = "Tenant") {
  const lowered = (text || "").toLowerCase();
  const results = {};
  for (const [level, keywords] of BUCKETS) {
    results[level] = scoreBucket(lowered, keywords);
  }
  let best = null;
  let bestScore = -1;
  for (const level of ["p1", "p2", "p3"]) {
    if (results[level].score > bestScore) {
      best = level;
      bestScore = results[level].score;
    }
  }
  let level = bestScore <= 0 ? "p3" : best;
  let reasons = bestScore <= 0 ? ["general admin"] : results[level].matched;

  // owner / asset-manager mail is at least P2 (unless it's a P1 safety issue)
  if ((role === "Property Owner" || role === "Asset Manager") && level === "p3") {
    level = "p2";
    reasons = [...reasons, "owner request"];
  }
  return { level, reasons, score: Math.max(bestScore, 0) };
}

// ── Summarizer + suggested action ─────────────────────────────────
const ACTION_BY_LEVEL = {
  p1: "Dispatch emergency response now and notify the building manager",
  p2: "Review and forward to the owner / asset management team",
  p3: "Handle as routine administrative work",
  p4: "No action needed — keep for reference",
};

const ACTION_RULES = [
  [["gas", "carbon monoxide"], "Evacuate if needed, call the gas company, dispatch a technician"],
  [["no heat", "no cooling", "cooling system", "hvac", "heating system"], "Dispatch an HVAC technician on priority"],
  [["burning smell", "spark", "electrical", "exposed wire"], "Dispatch a licensed electrician immediately"],
  [["burst pipe", "pipe burst", "water pipe", "flood", "leak", "leaking", "water damage"], "Send a plumber and document any water damage"],
  [["capex", "capital expenditure"], "Prepare a CAPEX summary for owner approval"],
  [["budget"], "Compile the figures and schedule a budget review with the owner"],
  [["breeam", "certification"], "Gather the certification documents and respond to the owner"],
  [["lease restructuring", "rent review", "lease renewal"], "Loop in asset management on the lease request"],
  [["service charge", "invoice"], "Log the invoice and update the service-charge ledger"],
  [["parking", "permit"], "Send the parking / permit instructions"],
  [["expire", "expiration", "renew"], "Look up the contract and confirm the date"],
  [["copy of"], "Attach the requested document and reply"],
];

export function summarizeEmail(text) {
  const cleaned = (text || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return "No content.";
  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  let summary = sentences[0];
  if (summary.split(" ").length <= 4 && sentences.length > 1) summary = sentences[1];
  summary = summary.trim();
  if (summary.length > 160) summary = summary.slice(0, 157).trimEnd() + "...";
  if (summary && !".!?".includes(summary[summary.length - 1])) summary += ".";
  return summary ? summary[0].toUpperCase() + summary.slice(1) : summary;
}

export function suggestAction(level, text) {
  const lowered = (text || "").toLowerCase();
  for (const [triggers, action] of ACTION_RULES) {
    if (triggers.some((t) => lowered.includes(t))) return action;
  }
  return ACTION_BY_LEVEL[level] || "Review and respond";
}

// ── Document field extraction ─────────────────────────────────────
const PATTERNS = {
  tenant_name: [/Tenant:\s*(.+)/i],
  contract_start: [/(?:Lease\s+)?Start Date:\s*(\d{4}-\d{2}-\d{2})/i],
  contract_expiration: [
    /(?:Lease\s+)?Expiration Date:\s*(\d{4}-\d{2}-\d{2})/i,
    /End Date:\s*(\d{4}-\d{2}-\d{2})/i,
  ],
  rent_amount: [/Monthly Rent:\s*\$?([0-9,]+)/i, /Amount Due:\s*\$?([0-9,]+)/i],
  payment_status: [/Payment Status:\s*([A-Za-z/ ]+)/i],
  outstanding_balance: [/Outstanding Balance:\s*\$?([0-9,]+)/i],
};

function firstMatch(text, patterns) {
  for (const pat of patterns) {
    const m = text.match(pat);
    if (m) return m[1].trim();
  }
  return null;
}

export function extractClauses(text) {
  return [...(text || "").matchAll(/Key Clause:\s*(.+)/g)].map((m) => m[1].trim());
}

export function extractFields(rawText) {
  const text = rawText || "";
  const fields = {};
  for (const [name, patterns] of Object.entries(PATTERNS)) {
    fields[name] = firstMatch(text, patterns);
  }
  for (const money of ["rent_amount", "outstanding_balance"]) {
    if (fields[money]) fields[money] = "$" + fields[money];
  }
  fields.clauses = extractClauses(text);
  return fields;
}

export function buildSummarySentence(fields, docType) {
  const tenant = fields.tenant_name || "an unidentified party";
  if (docType === "Tenant Contract") {
    const exp = fields.contract_expiration || "an unspecified date";
    const rent = fields.rent_amount || "n/a";
    return `Lease for ${tenant} at ${rent}/mo, expiring ${exp}.`;
  }
  if (docType === "Invoice") {
    const amt = fields.rent_amount || "n/a";
    const status = fields.payment_status || "unknown";
    return `Invoice for ${tenant} of ${amt} (${status}).`;
  }
  if (docType === "Payment Record") {
    const bal = fields.outstanding_balance || "$0";
    const status = fields.payment_status || "unknown";
    return `Payment ledger for ${tenant}: ${status}, balance ${bal}.`;
  }
  if (docType === "Repair Document") return `Repair document related to ${tenant}.`;
  if (docType === "Building Document") return "Building-level document (not tenant-specific).";
  return `Document associated with ${tenant}.`;
}

// ── Draft generator (signature appended separately) ───────────────
const INTENTS = [
  ["contract_expiration", ["expire", "expiration", "renew", "end of lease", "lease end"]],
  ["rent_amount", ["how much", "rent amount", "monthly rent", "my rent"]],
  ["payment_status", ["balance", "overdue", "outstanding", "payment status", "owe"]],
  ["repair_status", ["repair", "fixed", "fix", "maintenance", "leak", "heat"]],
  ["contract_copy", ["copy of", "send me my contract", "copy of my contract"]],
];

export function detectIntent(text) {
  const lowered = (text || "").toLowerCase();
  for (const [intent, triggers] of INTENTS) {
    if (triggers.some((t) => lowered.includes(t))) return intent;
  }
  return "general";
}

function findDoc(tenantId, files, docTypes) {
  for (const f of files) {
    if (f.tenantId !== tenantId) continue;
    if (docTypes && !docTypes.includes(f.doc_type)) continue;
    return f;
  }
  return null;
}

// Returns { intent, body, groundedOn } — body has NO signature; caller appends it.
export function generateDraftBody(email, tenant, files) {
  const intent = detectIntent(email.body + " " + email.subject);
  const name = tenant ? tenant.name : "Tenant";
  const first = name.split(" ")[0];
  let groundedOn = null;
  let body = null;

  if (["contract_expiration", "rent_amount", "contract_copy"].includes(intent)) {
    const doc = findDoc(email.tenantId, files, ["Tenant Contract"]);
    if (doc) {
      groundedOn = doc.file_name;
      const fields = doc.fields || extractFields(doc.raw_text);
      if (intent === "contract_expiration") {
        body =
          `Dear ${first},\n\n` +
          `Thank you for reaching out. According to your lease agreement on file, your contract is set to expire on ${fields.contract_expiration}. If you would like to renew, please let us know at least 30 days in advance and we will be happy to prepare the paperwork.`;
      } else if (intent === "rent_amount") {
        body =
          `Dear ${first},\n\n` +
          `Thank you for your message. Your current monthly rent is ${fields.rent_amount}, as stated in your lease agreement. Please let us know if you have any further questions.`;
      } else {
        body =
          `Dear ${first},\n\n` +
          `Thank you for reaching out. Please find a copy of your rental contract attached. For your reference, your monthly rent is ${fields.rent_amount} and your lease expires on ${fields.contract_expiration}.`;
      }
    }
  } else if (intent === "payment_status") {
    const doc = findDoc(email.tenantId, files, ["Payment Record", "Invoice"]);
    if (doc) {
      groundedOn = doc.file_name;
      const fields = doc.fields || extractFields(doc.raw_text);
      body =
        `Dear ${first},\n\n` +
        `Thank you for your message. Our records show a payment status of '${fields.payment_status}' with an outstanding balance of ${fields.outstanding_balance || "$0"}. Please let us know if you would like to arrange a payment plan.`;
    }
  } else if (intent === "repair_status") {
    const doc = findDoc(email.tenantId, files, ["Repair Document"]);
    if (doc) groundedOn = doc.file_name;
    body =
      `Dear ${first},\n\n` +
      `Thank you for letting us know. We have logged your maintenance request and a technician will be scheduled as soon as possible. We will keep you updated on the status.`;
  }

  if (body === null) {
    body =
      `Dear ${first},\n\n` +
      `Thank you for contacting us regarding "${email.subject}". We have received your message and will get back to you with a full response shortly.`;
  }

  return { intent, body, groundedOn };
}

export const SIGNATURE = "Best regards,\nTim Parker\nReal Estate Manager";
