import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { api } from "../../api/client.js";
import SearchResult from "./SearchResult.jsx";
import Spinner from "../common/Spinner.jsx";
import EmptyState from "../common/EmptyState.jsx";

const SUGGESTIONS = ["expiration", "Garcia", "rent", "overdue", "fire safety"];

export default function DocumentSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  function runSearch(q) {
    setQuery(q);
    setLoading(true);
    setSearched(true);
    api
      .search(q)
      .then((d) => setResults(d.results))
      .finally(() => setLoading(false));
  }

  // show the full library on first load (empty query)
  useEffect(() => {
    runSearch("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-5 p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(query);
        }}
        className="relative"
      >
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents — try a tenant name, 'expiration', 'rent'..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm shadow-card focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400">Try:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => runSearch(s)}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="Searching and summarizing documents..." />
      ) : results.length === 0 && searched ? (
        <EmptyState
          icon={SearchIcon}
          title="No documents matched your search"
          hint="Try a different keyword or tenant name"
        />
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            {results.length} document{results.length === 1 ? "" : "s"}
            {query ? ` matching “${query}”` : " in the library"}
          </p>
          {results.map((r) => (
            <SearchResult key={r.id} result={r} />
          ))}
        </div>
      )}
    </div>
  );
}
