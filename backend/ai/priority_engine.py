"""Rule-based priority classifier (3-tier category model).

Simulates an AI triage model that sorts incoming mail into three priorities:

  P1 — Safety & critical building issues  (red)
  P2 — Property owner requests            (amber)
  P3 — Administrative work                (slate-blue)

Weighted keyword buckets decide the tier; the highest total score wins, ties
resolve UP toward the more critical tier, and anything unmatched falls to P3
(admin is the catch-all). Matched keywords are returned as `reasons` so the UI
can show *why* a message was prioritised.
"""

LEVEL_META = {
    "p1": {"label": "Priority 1 — Safety & Critical", "color": "red", "weight": 3},
    "p2": {"label": "Priority 2 — Owner Request", "color": "amber", "weight": 2},
    "p3": {"label": "Priority 3 — Administrative", "color": "slate", "weight": 1},
}

# P1 — safety & critical building issues
P1_KEYWORDS = {
    "burst pipe": 10, "pipe burst": 10, "burst water": 10, "broken pipe": 9,
    "water pipe": 8, "flood": 9, "water damage": 7, "leak": 6, "leaking": 6,
    "no heat": 8, "no cooling": 8, "cooling system": 8, "heating system": 7,
    "hvac": 7, "air conditioning": 6, "no hot water": 7,
    "fire": 10, "smoke": 9, "gas": 10, "carbon monoxide": 10, "burning smell": 9,
    "spark": 8, "electrical": 7, "exposed wire": 8,
    "safety": 7, "hazard": 7, "emergency": 7, "structural": 7, "injury": 9,
    "unsafe": 7, "dangerous": 7,
}

# P2 — property owner / asset-management requests
P2_KEYWORDS = {
    "capex": 10, "capital expenditure": 10, "budget planning": 9, "budget": 7,
    "breeam": 10, "certification": 6, "valuation": 7, "asset management": 8,
    "portfolio": 6, "investor": 7, "investment": 6, "refinanc": 7,
    "owner": 6, "reporting": 5, "lease restructuring": 8, "rent review": 7,
    "lease renewal": 6, "service charge budget": 8,
}

# P3 — administrative work (catch-all)
P3_KEYWORDS = {
    "service charge": 7, "invoice": 5, "parking": 4, "permit": 4, "key": 3,
    "copy of": 4, "question": 3, "wondering": 3, "request": 2, "general": 2,
    "update": 2, "notice": 2, "confirm": 2, "thank": 2, "received": 1,
    "contract": 3, "rent": 3, "payment": 3, "how": 1, "when": 1,
}

BUCKETS = [
    ("p1", P1_KEYWORDS),
    ("p2", P2_KEYWORDS),
    ("p3", P3_KEYWORDS),
]

# severity order used to break ties (earlier = more critical)
SEVERITY_ORDER = ["p1", "p2", "p3"]


def _score_bucket(text, keywords):
    score = 0
    matched = []
    for kw, weight in keywords.items():
        if kw in text:
            score += weight
            matched.append(kw)
    return score, matched


def _result(level, reasons, score):
    meta = LEVEL_META[level]
    return {
        "level": level,
        "label": meta["label"],
        "color": meta["color"],
        "weight": meta["weight"],
        "score": score,
        "reasons": reasons,
    }


def classify_priority(text):
    """Return {level, label, color, weight, score, reasons}."""
    lowered = (text or "").lower()
    results = {}
    for level, keywords in BUCKETS:
        score, matched = _score_bucket(lowered, keywords)
        results[level] = {"score": score, "matched": matched}

    best_level, best_score = None, -1
    for level in SEVERITY_ORDER:  # severe -> mild so ties keep the severe tier
        score = results[level]["score"]
        if score > best_score:
            best_level, best_score = level, score

    if best_score <= 0:
        return _result("p3", ["general admin"], 0)
    return _result(best_level, results[best_level]["matched"], best_score)


def elevate_for_owner(result, role):
    """Owner / asset-manager mail is at least P2 (unless it's a P1 safety issue)."""
    if role in ("Property Owner", "Asset Manager") and result["level"] == "p3":
        elevated = _result("p2", result["reasons"] + ["owner request"], result["score"])
        return elevated
    return result
