"""Mock tenant directory for the AIstate prototype."""

TENANTS = [
    {
        "id": "t1",
        "name": "Maria Garcia",
        "unit": "4B",
        "building": "Parkview Apartments",
        "email": "maria.garcia@example.com",
        "phone": "(555) 014-2231",
    },
    {
        "id": "t2",
        "name": "James Chen",
        "unit": "12A",
        "building": "Riverside Lofts",
        "email": "james.chen@example.com",
        "phone": "(555) 091-7745",
    },
    {
        "id": "t3",
        "name": "Sarah Johnson",
        "unit": "2C",
        "building": "Parkview Apartments",
        "email": "sarah.johnson@example.com",
        "phone": "(555) 220-9908",
    },
    {
        "id": "t4",
        "name": "David Okafor",
        "unit": "7D",
        "building": "Maple Court",
        "email": "david.okafor@example.com",
        "phone": "(555) 776-3320",
    },
    {
        "id": "t5",
        "name": "Emily Rodriguez",
        "unit": "5A",
        "building": "Riverside Lofts",
        "email": "emily.rodriguez@example.com",
        "phone": "(555) 488-1102",
    },
    {
        "id": "t6",
        "name": "Michael Thompson",
        "unit": "9B",
        "building": "Maple Court",
        "email": "michael.thompson@example.com",
        "phone": "(555) 332-6651",
    },
    {
        "id": "t7",
        "name": "Aisha Khan",
        "unit": "1F",
        "building": "Parkview Apartments",
        "email": "aisha.khan@example.com",
        "phone": "(555) 905-4417",
    },
    {
        "id": "t8",
        "name": "Robert Muller",
        "unit": "3E",
        "building": "Riverside Lofts",
        "email": "robert.muller@example.com",
        "phone": "(555) 661-8890",
    },
]

TENANTS_BY_ID = {t["id"]: t for t in TENANTS}


def get_tenant(tenant_id):
    return TENANTS_BY_ID.get(tenant_id)


def find_tenant_by_name(name):
    if not name:
        return None
    needle = name.strip().lower()
    for t in TENANTS:
        if t["name"].lower() == needle or needle in t["name"].lower():
            return t
    return None
