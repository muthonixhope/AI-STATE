import { useEffect, useRef, useState } from "react";
import { Send, Bot } from "lucide-react";
import { askChatbot, SUGGESTION_PROMPTS } from "../../chatbot/mockChatEngine.js";
import { findTenantByFirstName } from "../../data/tenants.js";
import ChatMessage from "./ChatMessage.jsx";

const WELCOME = {
  id: "welcome",
  role: "ai",
  content:
    "Hello Tim! I have access to your uploaded documents and tenant records.\n\nAsk me anything about tenants, contracts, rents, invoices, or payment status — I'll search the documents and give you a clear answer.",
  source: null,
  confidence: null,
};

let msgId = 0;
function uid() {
  return `m${++msgId}`;
}

export default function ChatbotTab() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function send(text) {
    const q = text.trim();
    if (!q) return;
    setInput("");

    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", content: q },
    ]);

    setTyping(true);
    // Simulate realistic "reading" delay
    await new Promise((r) => setTimeout(r, 1200));
    setTyping(false);

    const result = askChatbot(q);
    const tenant = findTenantByFirstName(q);
    setMessages((prev) => [
      ...prev,
      {
        id: uid(),
        role: "ai",
        content: result.answer,
        source: result.source,
        confidence: result.confidence,
        tenantId: tenant?.id || null,
      },
    ]);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((m) => (
            <ChatMessage key={m.id} msg={m} />
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <Bot className="h-4 w-4 text-brand-500" />
                <span className="text-xs text-slate-400">
                  AIstate is reading your documents
                </span>
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggestion chips */}
      <div className="border-t border-slate-100 bg-slate-50 px-6 py-3">
        <div className="mx-auto max-w-2xl">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Try asking
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTION_PROMPTS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700 hover:bg-brand-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-slate-200 bg-white p-4">
        <div className="mx-auto flex max-w-2xl items-end gap-3">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about a tenant, contract, rent, or invoice…"
            className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || typing}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
