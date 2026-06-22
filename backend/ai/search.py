"""Search + summarize the document library."""

from ai.document_parser import extract_fields, build_summary_sentence


def _make_snippet(raw_text, query):
    lowered = raw_text.lower()
    pos = lowered.find(query.lower())
    if pos == -1:
        return raw_text.strip().splitlines()[0] if raw_text.strip() else ""
    start = max(0, pos - 40)
    end = min(len(raw_text), pos + 60)
    snippet = raw_text[start:end].replace("\n", " ").strip()
    return ("..." if start > 0 else "") + snippet + ("..." if end < len(raw_text) else "")


def search_documents(query, documents):
    """Return ranked results, each with extracted fields + a snippet."""
    q = (query or "").strip().lower()
    results = []
    for doc in documents:
        fields = extract_fields(doc["raw_text"])
        haystack = " ".join(
            [
                doc["file_name"],
                doc["doc_type"],
                fields.get("tenant_name") or "",
                doc["raw_text"],
            ]
        ).lower()

        if not q:
            score = 0
        else:
            score = haystack.count(q)
            # boost matches in tenant name / file name
            if q in (fields.get("tenant_name") or "").lower():
                score += 5
            if q in doc["file_name"].lower():
                score += 3

        if q and score == 0:
            continue

        results.append(
            {
                "id": doc["id"],
                "file_name": doc["file_name"],
                "doc_type": doc["doc_type"],
                "uploaded_at": doc["uploaded_at"],
                "score": score,
                "fields": fields,
                "summary": build_summary_sentence(fields, doc["doc_type"]),
                "snippet": _make_snippet(doc["raw_text"], q) if q else "",
            }
        )

    results.sort(key=lambda r: -r["score"])
    return results
