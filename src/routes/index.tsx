import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ChatterBox — Simple Messaging App" },
      { name: "description", content: "A playful single-page messaging app with seven gorgeous themes." },
      { property: "og:title", content: "ChatterBox" },
      { property: "og:description", content: "A playful single-page messaging app with seven gorgeous themes." },
    ],
  }),
  component: ChatterBox,
});

type Theme = "light" | "dark" | "midnight" | "hearts" | "bestie" | "unicorn" | "galaxy";

type Message = {
  id: string;
  text: string;
  who: "me" | "them";
  ts: number;
};

const THEMES: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "midnight", label: "Midnight" },
  { value: "hearts", label: "❤️ Hearts" },
  { value: "bestie", label: "🌸 Bestie" },
  { value: "unicorn", label: "🦄 Unicorn" },
  { value: "galaxy", label: "🌌 Galaxy" },
];

const THEME_VARS: Record<Theme, Record<string, string>> = {
  light: {
    "--page-bg": "linear-gradient(180deg, #f4f7fb 0%, #c8d6e5 100%)",
    "--card-bg": "rgba(255,255,255,0.85)",
    "--header-bg": "linear-gradient(90deg, #cfe3f3, #dfeaf5)",
    "--chat-bg": "linear-gradient(180deg, #d6e8ef 0%, #aac4d6 100%)",
    "--composer-bg": "rgba(255,255,255,0.85)",
    "--text": "#0f1b2a",
    "--muted": "#3a4a5a",
    "--bubble-me-bg": "#d6e6f5",
    "--bubble-me-text": "#0f1b2a",
    "--bubble-them-bg": "#ffffff",
    "--bubble-them-text": "#0f1b2a",
    "--send-bg": "#0f1b2a",
    "--send-text": "#ffffff",
    "--input-bg": "#ffffff",
    "--input-text": "#0f1b2a",
    "--border": "rgba(15,27,42,0.1)",
  },
  dark: {
    "--page-bg": "linear-gradient(180deg, #0a0a0a 0%, #d4d4d4 100%)",
    "--card-bg": "rgba(40,40,40,0.6)",
    "--header-bg": "rgba(160,160,160,0.35)",
    "--chat-bg": "linear-gradient(180deg, #000000 0%, #6f6f6f 100%)",
    "--composer-bg": "rgba(180,180,180,0.3)",
    "--text": "#f5f5f5",
    "--muted": "#cfcfcf",
    "--bubble-me-bg": "#3b3f55",
    "--bubble-me-text": "#ffffff",
    "--bubble-them-bg": "#1d1d1d",
    "--bubble-them-text": "#ffffff",
    "--send-bg": "#4b3a8a",
    "--send-text": "#ffffff",
    "--input-bg": "rgba(255,255,255,0.05)",
    "--input-text": "#ffffff",
    "--border": "rgba(255,255,255,0.1)",
  },
  midnight: {
    "--page-bg": "linear-gradient(135deg, #2c3e50 0%, #a9c4dc 100%)",
    "--card-bg": "rgba(180,210,235,0.55)",
    "--header-bg": "rgba(180,210,235,0.7)",
    "--chat-bg": "linear-gradient(135deg, #36546f 0%, #a4bccf 100%)",
    "--composer-bg": "rgba(180,210,235,0.6)",
    "--text": "#0f1b2a",
    "--muted": "#33485c",
    "--bubble-me-bg": "#0f1b3a",
    "--bubble-me-text": "#ffffff",
    "--bubble-them-bg": "#33485c",
    "--bubble-them-text": "#ffffff",
    "--send-bg": "#7fb0c9",
    "--send-text": "#0f1b2a",
    "--input-bg": "rgba(255,255,255,0.6)",
    "--input-text": "#0f1b2a",
    "--border": "rgba(15,27,42,0.15)",
  },
  hearts: {
    "--page-bg": "linear-gradient(180deg, #fbe2e2 0%, #f3a7a7 100%)",
    "--card-bg": "rgba(255,220,220,0.7)",
    "--header-bg": "rgba(255,220,220,0.85)",
    "--chat-bg": "linear-gradient(180deg, #e85a5a 0%, #e8a0a0 100%)",
    "--composer-bg": "rgba(255,220,220,0.85)",
    "--text": "#3a0d0d",
    "--muted": "#6b2a2a",
    "--bubble-me-bg": "#4a1a14",
    "--bubble-me-text": "#ffffff",
    "--bubble-them-bg": "#4a1a14",
    "--bubble-them-text": "#ffffff",
    "--send-bg": "#e94560",
    "--send-text": "#ffffff",
    "--input-bg": "#ffffff",
    "--input-text": "#3a0d0d",
    "--border": "rgba(58,13,13,0.15)",
  },
  bestie: {
    "--page-bg": "linear-gradient(135deg, #f5b5d4 0%, #c9b8ec 100%)",
    "--card-bg": "rgba(255,200,220,0.75)",
    "--header-bg": "rgba(255,180,200,0.85)",
    "--chat-bg": "linear-gradient(135deg, #f7b8d8 0%, #c4d3f5 100%)",
    "--composer-bg": "rgba(255,200,220,0.85)",
    "--text": "#3a1a2a",
    "--muted": "#6b3a52",
    "--bubble-me-bg": "#0f3a3f",
    "--bubble-me-text": "#ffffff",
    "--bubble-them-bg": "#3a1a2a",
    "--bubble-them-text": "#ffffff",
    "--send-bg": "#e07ba8",
    "--send-text": "#ffffff",
    "--input-bg": "#ffffff",
    "--input-text": "#3a1a2a",
    "--border": "rgba(58,26,42,0.15)",
  },
  unicorn: {
    "--page-bg": "linear-gradient(135deg, #f7a8a8 0%, #f5b8d4 50%, #c4b8ec 100%)",
    "--card-bg": "rgba(255,210,200,0.7)",
    "--header-bg": "rgba(255,200,180,0.85)",
    "--chat-bg": "linear-gradient(135deg, #f5a8a8 0%, #f0b8d4 50%, #c4b8ec 100%)",
    "--composer-bg": "rgba(255,210,200,0.85)",
    "--text": "#3a1a2a",
    "--muted": "#6b3a52",
    "--bubble-me-bg": "#3a1a3a",
    "--bubble-me-text": "#ffffff",
    "--bubble-them-bg": "#5a1a2a",
    "--bubble-them-text": "#ffffff",
    "--send-bg": "#f47ba8",
    "--send-text": "#ffffff",
    "--input-bg": "#ffffff",
    "--input-text": "#3a1a2a",
    "--border": "rgba(58,26,42,0.15)",
  },
  galaxy: {
    "--page-bg": "linear-gradient(135deg, #1a1a3a 0%, #d4b8ec 100%)",
    "--card-bg": "rgba(220,200,240,0.75)",
    "--header-bg": "rgba(220,200,240,0.85)",
    "--chat-bg": "linear-gradient(135deg, #2a2a5a 0%, #b8a8d4 100%)",
    "--composer-bg": "rgba(230,210,245,0.85)",
    "--text": "#1a1a3a",
    "--muted": "#3a3a6a",
    "--bubble-me-bg": "#1a1a3a",
    "--bubble-me-text": "#ffffff",
    "--bubble-them-bg": "#2a2a4a",
    "--bubble-them-text": "#ffffff",
    "--send-bg": "#8a7ed4",
    "--send-text": "#ffffff",
    "--input-bg": "#ffffff",
    "--input-text": "#1a1a3a",
    "--border": "rgba(26,26,58,0.15)",
  },
};

const STORAGE_KEY = "chatterbox.messages.v1";
const THEME_KEY = "chatterbox.theme.v1";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function ChatterBox() {
  const [theme, setTheme] = useState<Theme>("unicorn");
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const t = localStorage.getItem(THEME_KEY) as Theme | null;
      if (t && THEME_VARS[t]) setTheme(t);
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setMessages(JSON.parse(raw));
      } else {
        setMessages([
          { id: uid(), text: "Hello! 👋", who: "them", ts: Date.now() },
        ]);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }, [theme]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: uid(), text, who: "me", ts: Date.now() }]);
    setDraft("");
    setTimeout(() => {
      const replies = ["Hello! 👋", "Nice to chat ✨", "Tell me more!", "😊", "I hear you."];
      const r = replies[Math.floor(Math.random() * replies.length)];
      setMessages((m) => [...m, { id: uid(), text: r, who: "them", ts: Date.now() }]);
    }, 600);
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearChat = () => {
    if (confirm("Clear all messages?")) setMessages([]);
  };

  const vars = THEME_VARS[theme] as React.CSSProperties;

  return (
    <div
      style={{ ...vars, background: "var(--page-bg)", minHeight: "100vh" }}
      className="flex items-center justify-center p-4 sm:p-8 font-sans"
    >
      <main
        style={{
          background: "var(--card-bg)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          backdropFilter: "blur(10px)",
        }}
        className="w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        <header
          style={{ background: "var(--header-bg)", borderBottom: "1px solid var(--border)" }}
          className="flex items-center justify-between px-6 py-4"
        >
          <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
            ChatterBox
          </h1>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium" style={{ color: "var(--text)" }}>Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
              className="rounded-md border px-2 py-1 text-sm bg-white/80 text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-1"
              style={{ borderColor: "var(--border)" }}
            >
              {THEMES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <button
              onClick={clearChat}
              className="rounded-md border px-3 py-1 text-sm bg-white/70 hover:bg-white text-slate-900 transition"
              style={{ borderColor: "var(--border)" }}
            >
              Clear Chat
            </button>
          </div>
        </header>

        <div
          ref={scrollRef}
          style={{ background: "var(--chat-bg)" }}
          className="h-[60vh] overflow-y-auto px-6 py-5 space-y-3"
        >
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.who === "me" ? "justify-end" : "justify-start"}`}>
              <div
                style={{
                  background: m.who === "me" ? "var(--bubble-me-bg)" : "var(--bubble-them-bg)",
                  color: m.who === "me" ? "var(--bubble-me-text)" : "var(--bubble-them-text)",
                }}
                className="max-w-[75%] rounded-xl px-4 py-2 shadow-md"
              >
                <div className="text-base whitespace-pre-wrap break-words">{m.text}</div>
                <div className="text-xs opacity-70 mt-1">{formatTime(m.ts)}</div>
              </div>
            </div>
          ))}
        </div>

        <footer
          style={{ background: "var(--composer-bg)", borderTop: "1px solid var(--border)" }}
          className="p-4 flex items-end gap-3"
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKey}
            placeholder="Type a message — press Enter to send (Shift+Enter for newline)"
            rows={2}
            style={{
              background: "var(--input-bg)",
              color: "var(--input-text)",
              borderColor: "var(--border)",
            }}
            className="flex-1 resize-y rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2"
          />
          <button
            onClick={send}
            style={{ background: "var(--send-bg)", color: "var(--send-text)" }}
            className="rounded-xl px-5 py-2 font-semibold shadow-md hover:opacity-90 transition"
          >
            Send
          </button>
        </footer>
      </main>
    </div>
  );
}
