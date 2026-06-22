"""Mock document library.

Each document carries a `raw_text` block authored with labeled lines so
ai.document_parser can extract structured fields (tenant, dates, rent, etc.).
"""

DOCUMENTS = [
    {
        "id": "d1",
        "file_name": "lease_contract_garcia.pdf",
        "tenant_id": "t1",
        "doc_type": "Tenant Contract",
        "uploaded_at": "2026-06-10",
        "last_opened": "2026-06-21",
        "raw_text": (
            "RESIDENTIAL LEASE AGREEMENT\n"
            "Tenant: Maria Garcia\n"
            "Property: Parkview Apartments, Unit 4B\n"
            "Lease Start Date: 2025-03-01\n"
            "Lease Expiration Date: 2026-08-31\n"
            "Monthly Rent: $1,850\n"
            "Security Deposit: $1,850\n"
            "Payment Status: Current\n"
            "Outstanding Balance: $0\n"
            "Key Clause: A 60-day written notice is required before move-out.\n"
            "Key Clause: Pets are allowed with a $300 non-refundable pet fee.\n"
        ),
    },
    {
        "id": "d2",
        "file_name": "lease_contract_khan.pdf",
        "tenant_id": "t7",
        "doc_type": "Tenant Contract",
        "uploaded_at": "2026-06-11",
        "last_opened": "2026-06-22",
        "raw_text": (
            "RESIDENTIAL LEASE AGREEMENT\n"
            "Tenant: Aisha Khan\n"
            "Property: Parkview Apartments, Unit 1F\n"
            "Lease Start Date: 2025-09-01\n"
            "Lease Expiration Date: 2026-09-30\n"
            "Monthly Rent: $1,650\n"
            "Security Deposit: $1,650\n"
            "Payment Status: Current\n"
            "Outstanding Balance: $0\n"
            "Key Clause: Lease renews automatically unless 30-day notice is given.\n"
            "Key Clause: Rent is due on the 1st of each month with a 5-day grace period.\n"
        ),
    },
    {
        "id": "d3",
        "file_name": "invoice_plumbing_chen.pdf",
        "tenant_id": "t2",
        "doc_type": "Invoice",
        "uploaded_at": "2026-06-18",
        "last_opened": "2026-06-20",
        "raw_text": (
            "PLUMBING SERVICE INVOICE\n"
            "Tenant: James Chen\n"
            "Property: Riverside Lofts, Unit 12A\n"
            "Service: Dishwasher leak inspection and seal replacement\n"
            "Invoice Date: 2026-06-18\n"
            "Amount Due: $420\n"
            "Payment Status: Unpaid\n"
            "Outstanding Balance: $420\n"
            "Key Clause: Payment due within 14 days of invoice date.\n"
        ),
    },
    {
        "id": "d4",
        "file_name": "repair_report_thompson.pdf",
        "tenant_id": "t6",
        "doc_type": "Repair Document",
        "uploaded_at": "2026-06-19",
        "last_opened": "2026-06-22",
        "raw_text": (
            "MAINTENANCE REPAIR REPORT\n"
            "Tenant: Michael Thompson\n"
            "Property: Maple Court, Unit 9B\n"
            "Issue: Heating system not producing heat\n"
            "Report Date: 2026-06-19\n"
            "Status: Parts ordered, follow-up visit scheduled\n"
            "Payment Status: N/A\n"
            "Key Clause: Heating repairs are covered by the landlord at no tenant cost.\n"
        ),
    },
    {
        "id": "d5",
        "file_name": "payment_ledger_okafor.pdf",
        "tenant_id": "t4",
        "doc_type": "Payment Record",
        "uploaded_at": "2026-06-20",
        "last_opened": "2026-06-21",
        "raw_text": (
            "TENANT PAYMENT LEDGER\n"
            "Tenant: David Okafor\n"
            "Property: Maple Court, Unit 7D\n"
            "Monthly Rent: $1,400\n"
            "Last Payment Date: 2026-04-30\n"
            "Payment Status: Overdue\n"
            "Outstanding Balance: $1,400\n"
            "Key Clause: A late fee of $50 applies after a 5-day grace period.\n"
        ),
    },
    {
        "id": "d6",
        "file_name": "building_fire_safety_parkview.pdf",
        "tenant_id": None,
        "doc_type": "Building Document",
        "uploaded_at": "2026-06-05",
        "last_opened": "2026-06-18",
        "raw_text": (
            "BUILDING FIRE SAFETY CERTIFICATE\n"
            "Property: Parkview Apartments\n"
            "Inspection Date: 2026-05-15\n"
            "Next Inspection Due: 2027-05-15\n"
            "Status: Passed\n"
            "Key Clause: Smoke detectors must be tested every 6 months.\n"
            "Key Clause: Fire extinguishers are located on each floor landing.\n"
        ),
    },
]
