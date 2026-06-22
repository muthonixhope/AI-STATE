import { useEffect, useMemo, useState } from "react";
import { FolderUp } from "lucide-react";
import { api } from "../../api/client.js";
import { useApp } from "../../context/AppContext.jsx";
import FileUpload from "./FileUpload.jsx";
import FileCard from "./FileCard.jsx";
import FileFilters, { TYPE_FILTERS } from "./FileFilters.jsx";
import Spinner from "../common/Spinner.jsx";
import EmptyState from "../common/EmptyState.jsx";

export default function FileWorkspace() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newIds, setNewIds] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [sort, setSort] = useState("uploaded");
  const { binFiles } = useApp();

  useEffect(() => {
    api
      .getFiles()
      .then((d) => setFiles(d.files))
      .finally(() => setLoading(false));
  }, []);

  function handleUploaded(file) {
    setFiles((prev) => [file, ...prev]);
    setNewIds((prev) => [file.id, ...prev]);
  }

  const deletedFileIds = useMemo(
    () => new Set(binFiles.map((f) => f.id)),
    [binFiles]
  );

  const visible = useMemo(() => {
    const types = TYPE_FILTERS.find((f) => f.key === typeFilter)?.types;
    let list = files
      .filter((f) => !deletedFileIds.has(f.id))
      .filter((f) => (types ? types.includes(f.doc_type) : true));

    const byDateDesc = (a, b, key) =>
      (b[key] || "").localeCompare(a[key] || "");
    list.sort((a, b) => {
      if (sort === "opened") return byDateDesc(a, b, "last_opened");
      if (sort === "alpha") return a.file_name.localeCompare(b.file_name);
      if (sort === "expiration") {
        // soonest real expiration first; files without one go last
        const ax = a.contract_expiration || "9999-12-31";
        const bx = b.contract_expiration || "9999-12-31";
        return ax.localeCompare(bx);
      }
      return byDateDesc(a, b, "uploaded_at"); // default: recently uploaded
    });
    return list;
  }, [files, typeFilter, sort]);

  return (
    <div className="space-y-5 p-6">
      <FileUpload onUploaded={handleUploaded} />

      <div className="flex items-center gap-2">
        <FolderUp className="h-4 w-4 text-slate-400" />
        <h3 className="text-sm font-bold text-slate-700">
          File Library
          <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
            {visible.length}
          </span>
        </h3>
      </div>

      <FileFilters
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        sort={sort}
        onSortChange={setSort}
      />

      {loading ? (
        <Spinner label="Loading file library..." />
      ) : visible.length === 0 ? (
        <EmptyState icon={FolderUp} title="No files in this category" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((file) => (
            <FileCard key={file.id} file={file} isNew={newIds.includes(file.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
