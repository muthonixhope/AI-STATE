import { FileText } from "lucide-react";

export default function ChatMessage({ msg }) {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-brand-600 px-4 py-3 text-sm text-white shadow-sm">
          {msg.content}
        </div>
      </div>
    );
  }

  const confidenceStyles = {
    High: "bg-emerald-100 text-emerald-700",
    Medium: "bg-amber-100 text-amber-700",
    "No match found": "bg-red-100 text-red-700",
  };

  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] space-y-2">
        <div className="rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="whitespace-pre-line text-sm text-slate-800">{msg.content}</p>
        </div>

        {(msg.source || msg.confidence) && (
          <div className="flex flex-wrap items-center gap-2 pl-1">
            {msg.confidence && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  confidenceStyles[msg.confidence] || "bg-slate-100 text-slate-600"
                }`}
              >
                {msg.confidence}
              </span>
            )}
            {msg.source && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                <FileText className="h-3 w-3" />
                {msg.source}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
