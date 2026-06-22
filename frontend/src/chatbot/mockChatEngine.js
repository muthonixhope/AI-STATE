// Self-contained frontend chatbot engine.
// Searches a local copy of tenant/document data and returns structured answers.
// No backend call needed — everything runs in the browser.

const TENANTS = [
  {
    firstName: "Maria",
    name: "Maria Garcia",
    unit: "4B",
    building: "Parkview Apartments",
    rent: "$1,850",
    leaseStart: "2025-03-01",
    leaseExpiry: "2026-08-31",
    paymentStatus: "Current",
    outstandingBalance: null,
    file: "lease_contract_garcia.pdf",
    clauses: [
      "60-day written notice required before move-out",
      "Pets allowed with a $300 non-refundable pet fee",
    ],
    invoice: null,
    repairStatus: null,
  },
  {
    firstName: "James",
    name: "James Chen",
    unit: "12A",
    building: "Riverside Lofts",
    rent: "$1,900",
    leaseStart: "2025-04-01",
    leaseExpiry: "2026-10-31",
    paymentStatus: "Current",
    outstandingBalance: null,
    file: "lease_contract_chen.pdf",
    clauses: [],
    invoice: {
      amount: "$420",
      reason: "dishwasher leak inspection and seal replacement",
      status: "Unpaid",
      file: "invoice_plumbing_chen.pdf",
    },
    repairStatus: null,
  },
  {
    firstName: "Sarah",
    name: "Sarah Johnson",
    unit: "2C",
    building: "Parkview Apartments",
    rent: "$1,750",
    leaseStart: "2025-01-01",
    leaseExpiry: "2026-12-31",
    paymentStatus: "Current",
    outstandingBalance: null,
    file: "lease_contract_johnson.pdf",
    clauses: [
      "Two months written notice required before lease end",
      "No subletting without prior written consent from the landlord",
      "Tenant is responsible for minor repairs under £150",
    ],
    invoice: null,
    repairStatus: null,
  },
  {
    firstName: "David",
    name: "David Okafor",
    unit: "7D",
    building: "Maple Court",
    rent: "$1,400",
    leaseStart: "2025-02-01",
    leaseExpiry: "2026-11-30",
    paymentStatus: "Overdue",
    outstandingBalance: "$1,400",
    file: "payment_ledger_okafor.pdf",
    clauses: [],
    invoice: null,
    repairStatus: null,
  },
  {
    firstName: "Emily",
    name: "Emily Rodriguez",
    unit: "5A",
    building: "Riverside Lofts",
    rent: "$1,600",
    leaseStart: "2025-07-01",
    leaseExpiry: "2027-01-31",
    paymentStatus: "Current",
    outstandingBalance: null,
    file: null,
    clauses: [],
    invoice: null,
    repairStatus: null,
  },
  {
    firstName: "Michael",
    name: "Michael Thompson",
    unit: "9B",
    building: "Maple Court",
    rent: "$1,550",
    leaseStart: "2025-04-01",
    leaseExpiry: "2026-10-31",
    paymentStatus: "Current",
    outstandingBalance: null,
    file: "repair_report_thompson.pdf",
    clauses: ["Heating repairs covered by landlord at no cost to the tenant"],
    invoice: null,
    repairStatus:
      "Heating system not producing heat — parts ordered, follow-up visit scheduled. Covered by landlord at no tenant cost.",
  },
  {
    firstName: "Aisha",
    name: "Aisha Khan",
    unit: "1F",
    building: "Parkview Apartments",
    rent: "$1,650",
    leaseStart: "2025-09-01",
    leaseExpiry: "2026-09-30",
    paymentStatus: "Current",
    outstandingBalance: null,
    file: "lease_contract_khan.pdf",
    clauses: [
      "Lease renews automatically unless 30-day notice is given before expiry",
      "Rent is due on the 1st of each month with a 5-day grace period",
    ],
    invoice: null,
    repairStatus: null,
  },
  {
    firstName: "Robert",
    name: "Robert Muller",
    unit: "3E",
    building: "Riverside Lofts",
    rent: "$1,800",
    leaseStart: "2025-08-01",
    leaseExpiry: "2027-02-28",
    paymentStatus: "Current",
    outstandingBalance: null,
    file: null,
    clauses: [],
    invoice: null,
    repairStatus: null,
  },
  // Extended tenants for chatbot demo
  {
    firstName: "Mila",
    name: "Mila Rossi",
    unit: "3B",
    building: "Parkview Apartments",
    rent: "£1,250",
    leaseStart: "2025-12-01",
    leaseExpiry: "2026-11-30",
    paymentStatus: "Current",
    outstandingBalance: null,
    file: "lease_contract_rossi.pdf",
    clauses: [
      "Monthly rent payable by bank transfer on the 1st of each month",
      "Property to be returned in original condition upon lease end",
      "Landlord must provide 24-hour notice before any inspection",
    ],
    invoice: null,
    repairStatus: null,
  },
  {
    firstName: "Daniel",
    name: "Daniel Martin",
    unit: "6C",
    building: "Maple Court",
    rent: "$1,500",
    leaseStart: "2026-04-01",
    leaseExpiry: "2027-03-31",
    paymentStatus: "Current",
    outstandingBalance: null,
    file: "lease_contract_martin.pdf",
    clauses: ["Standard 30-day notice required for lease termination"],
    invoice: {
      amount: "$840",
      reason: "electrical wiring inspection and repair",
      status: "Unpaid",
      file: "invoice_electrical_martin.pdf",
    },
    repairStatus: null,
  },
];

function fmt(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function askChatbot(question) {
  const q = question.toLowerCase();

  // Detect intent keywords
  const isRent = /\brent\b|monthly (payment|cost|fee)|how much (does|is|do)|pay.*month/.test(q);
  const isExpiry =
    /expir|lease end|when.*lease|contract.*end|end.*contract|expire|how long/.test(q);
  const isInvoice = /invoice|unpaid|amount due|bill/.test(q);
  const isBalance = /balance|owe|outstanding|arrears/.test(q);
  const isClause = /clause|term|condition|rule|policy|contract detail/.test(q);
  const isPayment = /payment|overdue|late|paid/.test(q);
  const isRepair = /repair|fix|maintenance|heating|boiler|broken|issue/.test(q);
  const isExpiringSoon =
    /expiring soon|expir.*soon|soon.*expir|which tenant|all lease|lease.*expir.*soon/.test(q);

  // All-tenants expiring soon
  if (isExpiringSoon) {
    const today = new Date();
    const sixMonths = new Date(today);
    sixMonths.setMonth(sixMonths.getMonth() + 6);
    const expiring = TENANTS.filter((t) => {
      const d = new Date(t.leaseExpiry);
      return d >= today && d <= sixMonths;
    }).sort((a, b) => a.leaseExpiry.localeCompare(b.leaseExpiry));

    if (expiring.length === 0) {
      return {
        answer:
          "No tenants currently have leases expiring within the next 6 months. All contracts are in good standing.",
        source: null,
        confidence: "High",
      };
    }
    const list = expiring
      .map(
        (t) =>
          `• ${t.name} — Unit ${t.unit}, ${t.building} — expires ${fmt(t.leaseExpiry)}`
      )
      .join("\n");
    return {
      answer: `The following ${expiring.length} tenant${expiring.length > 1 ? "s have" : " has"} a lease expiring within the next 6 months:\n\n${list}\n\nI recommend sending renewal notices at least 30 days before each expiry date to ensure compliance.`,
      source: null,
      confidence: "High",
    };
  }

  // Find matching tenant by first name
  const tenant = TENANTS.find((t) => q.includes(t.firstName.toLowerCase()));

  if (!tenant) {
    return {
      answer:
        "I couldn't find that tenant in the uploaded documents. Try asking by first name (e.g. \"Mila\", \"Sarah\", \"James\", \"Daniel\"), or ask about rent, lease expiry, invoices, payment status, or contract clauses.",
      source: null,
      confidence: "No match found",
    };
  }

  // Invoice / unpaid query
  if (isInvoice || (isBalance && !isRent)) {
    if (tenant.invoice) {
      return {
        answer: `${tenant.name} has an outstanding unpaid invoice of ${tenant.invoice.amount} for ${tenant.invoice.reason}.\n\nInvoice status: ${tenant.invoice.status}\n\nI recommend sending a formal payment reminder. If this remains unpaid beyond the 14-day payment window, you may wish to escalate to a formal notice.`,
        source: tenant.invoice.file,
        confidence: "High",
      };
    }
    if (tenant.outstandingBalance) {
      return {
        answer: `${tenant.name}'s account is currently overdue with an outstanding balance of ${tenant.outstandingBalance}. Payment status: ${tenant.paymentStatus}.\n\nA late fee of $50 applies after the 5-day grace period. I recommend issuing a formal arrears notice if payment is not received within 7 days.`,
        source: tenant.file,
        confidence: "High",
      };
    }
    return {
      answer: `${tenant.name}'s account is fully up to date. No unpaid invoices or outstanding balances are recorded in the documents on file. Payment status: ${tenant.paymentStatus}.`,
      source: tenant.file || null,
      confidence: "High",
    };
  }

  // Payment / overdue query
  if (isPayment && !isRent) {
    if (tenant.paymentStatus === "Overdue" && tenant.outstandingBalance) {
      return {
        answer: `${tenant.name}'s rent payment is currently overdue. Outstanding balance: ${tenant.outstandingBalance}. The last payment was recorded on 30 April 2026.\n\nA late fee of $50 applies per the lease agreement. I recommend sending a formal arrears notice immediately.`,
        source: tenant.file,
        confidence: "High",
      };
    }
    return {
      answer: `${tenant.name}'s payment record is in good standing. Current status: ${tenant.paymentStatus}. No overdue amounts are recorded as of the most recent document update.`,
      source: tenant.file || null,
      confidence: "High",
    };
  }

  // Contract clauses
  if (isClause) {
    if (tenant.clauses && tenant.clauses.length > 0) {
      const list = tenant.clauses.map((c) => `• ${c}`).join("\n");
      return {
        answer: `Here are the key contract clauses for ${tenant.name} (Unit ${tenant.unit}, ${tenant.building}):\n\n${list}\n\nThese clauses are taken directly from the signed lease agreement on file. For the full document, use the File Library.`,
        source: tenant.file,
        confidence: "High",
      };
    }
    return {
      answer: `I don't have detailed contract clauses recorded for ${tenant.name} in the current documents. Please upload their signed lease agreement to the File Library so I can extract and summarise the key terms.`,
      source: null,
      confidence: "Medium",
    };
  }

  // Lease expiry
  if (isExpiry) {
    return {
      answer: `${tenant.name}'s lease agreement expires on ${fmt(tenant.leaseExpiry)}. The lease started on ${fmt(tenant.leaseStart)} and is held for Unit ${tenant.unit} at ${tenant.building}.\n\nCurrent payment status: ${tenant.paymentStatus}. ${tenant.clauses.some((c) => c.includes("notice")) ? `Note: ${tenant.clauses.find((c) => c.includes("notice"))}` : "Please check the lease agreement for applicable notice periods."}`,
      source: tenant.file || null,
      confidence: "High",
    };
  }

  // Repair / maintenance
  if (isRepair && tenant.repairStatus) {
    return {
      answer: `${tenant.name}'s maintenance record:\n\n${tenant.repairStatus}`,
      source: tenant.file,
      confidence: "High",
    };
  }

  // Rent amount
  if (isRent) {
    return {
      answer: `${tenant.name}'s monthly rent is ${tenant.rent} as per their current lease agreement. The lease runs from ${fmt(tenant.leaseStart)} to ${fmt(tenant.leaseExpiry)} for Unit ${tenant.unit} at ${tenant.building}.\n\nPayment status: ${tenant.paymentStatus}.${tenant.outstandingBalance ? ` Outstanding balance: ${tenant.outstandingBalance}.` : ""}`,
      source: tenant.file || null,
      confidence: "High",
    };
  }

  // General overview
  const lines = [
    `Here is a summary for ${tenant.name} (Unit ${tenant.unit}, ${tenant.building}):`,
    "",
    `• Monthly Rent: ${tenant.rent}`,
    `• Lease Start: ${fmt(tenant.leaseStart)}`,
    `• Lease Expiry: ${fmt(tenant.leaseExpiry)}`,
    `• Payment Status: ${tenant.paymentStatus}`,
    tenant.outstandingBalance
      ? `• Outstanding Balance: ${tenant.outstandingBalance}`
      : null,
    tenant.invoice
      ? `• Unpaid Invoice: ${tenant.invoice.amount} (${tenant.invoice.reason})`
      : null,
    tenant.repairStatus ? `• Maintenance: ${tenant.repairStatus}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    answer: lines,
    source: tenant.file || null,
    confidence: "High",
  };
}

export const SUGGESTION_PROMPTS = [
  "What is Mila's rent?",
  "When does Mila's lease expire?",
  "Does Daniel have unpaid invoices?",
  "Show me Sarah's contract clauses",
  "Which tenants have leases expiring soon?",
];
