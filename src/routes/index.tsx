import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Send, Trash2, MessageSquare, Search, Plus, Settings, Phone, Video, MoreHorizontal, Check, CheckCheck, Palette } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ChatterBox — Modern Messaging" },
      { name: "description", content: "A polished, themeable messaging workspace." },
      { property: "og:title", content: "ChatterBox" },
      { property: "og:description", content: "A polished, themeable messaging workspace." },
    ],
  }),
  component: ChatterBox,
});

type Theme = "light" | "dark" | "midnight" | "hearts" | "bestie" | "unicorn" | "galaxy" | "emerald" | "slate";

type Message = {
  id: string;
  text: string;
  who: "me" | "them";
  ts: number;
};

type Conversation = {
  id: string;
  name: string;
  initials: string;
  accent: string;
  preview: string;
  unread?: number;
  online?: boolean;
};

const THEMES: { value: Theme; label: string; swatch: string[] }[] = [
  { value: "light", label: "Light", swatch: ["#f8fafc", "#3b82f6"] },
  { value: "dark", label: "Dark", swatch: ["#0a0a0a", "#4f46e5"] },
  { value: "midnight", label: "Midnight", swatch: ["#0f1b3d", "#3b6fa0"] },
  { value: "slate", label: "Slate", swatch: ["#2d3748", "#a0aec0"] },
  { value: "emerald", label: "Emerald", swatch: ["#064e3b", "#c9a84c"] },
  { value: "hearts", label: "Hearts", swatch: ["#e94560", "#fbe2e2"] },
  { value: "bestie", label: "Bestie", swatch: ["#e07ba8", "#c4d3f5"] },
  { value: "unicorn", label: "Unicorn", swatch: ["#f5a8a8", "#c4b8ec"] },
  { value: "galaxy", label: "Galaxy", swatch: ["#1a1a3a", "#d4b8ec"] },
];

// Each theme defines a full token set. App is fully restyled per theme.
const T: Record<Theme, Record<string, string>> = {
  light: {
    appBg: "#f1f5f9",
    sidebarBg: "#ffffff",
    sidebarBorder: "#e2e8f0",
    panelBg: "#ffffff",
    chatBg: "#f8fafc",
    text: "#0f172a",
    textMuted: "#64748b",
    textSubtle: "#94a3b8",
    accent: "#3b82f6",
    accentText: "#ffffff",
    bubbleMe: "#3b82f6",
    bubbleMeText: "#ffffff",
    bubbleThem: "#ffffff",
    bubbleThemText: "#0f172a",
    bubbleThemBorder: "#e2e8f0",
    inputBg: "#f1f5f9",
    inputText: "#0f172a",
    hover: "#f1f5f9",
    activeItem: "#eff6ff",
    activeItemText: "#1d4ed8",
    headerAccent: "#0f172a",
  },
  dark: {
    appBg: "#0a0a0a",
    sidebarBg: "#111111",
    sidebarBorder: "#1f1f1f",
    panelBg: "#0f0f0f",
    chatBg: "#0a0a0a",
    text: "#f5f5f5",
    textMuted: "#a3a3a3",
    textSubtle: "#737373",
    accent: "#6366f1",
    accentText: "#ffffff",
    bubbleMe: "#4f46e5",
    bubbleMeText: "#ffffff",
    bubbleThem: "#1c1c1c",
    bubbleThemText: "#f5f5f5",
    bubbleThemBorder: "#262626",
    inputBg: "#1a1a1a",
    inputText: "#f5f5f5",
    hover: "#1a1a1a",
    activeItem: "#1e1b4b",
    activeItemText: "#a5b4fc",
    headerAccent: "#f5f5f5",
  },
  midnight: {
    appBg: "#0a1628",
    sidebarBg: "#0f1b3d",
    sidebarBorder: "#1e2f5c",
    panelBg: "#0c1430",
    chatBg: "#0a1628",
    text: "#e8edf3",
    textMuted: "#94a8c4",
    textSubtle: "#5a6b8a",
    accent: "#3b6fa0",
    accentText: "#ffffff",
    bubbleMe: "#3b6fa0",
    bubbleMeText: "#ffffff",
    bubbleThem: "#1a2847",
    bubbleThemText: "#e8edf3",
    bubbleThemBorder: "#243559",
    inputBg: "#0f1b3d",
    inputText: "#e8edf3",
    hover: "#162447",
    activeItem: "#1e3a5f",
    activeItemText: "#a4c4e8",
    headerAccent: "#e8edf3",
  },
  slate: {
    appBg: "#1a202c",
    sidebarBg: "#2d3748",
    sidebarBorder: "#4a5568",
    panelBg: "#252d3a",
    chatBg: "#1a202c",
    text: "#f7fafc",
    textMuted: "#a0aec0",
    textSubtle: "#718096",
    accent: "#90cdf4",
    accentText: "#1a202c",
    bubbleMe: "#4a5568",
    bubbleMeText: "#f7fafc",
    bubbleThem: "#2d3748",
    bubbleThemText: "#f7fafc",
    bubbleThemBorder: "#4a5568",
    inputBg: "#2d3748",
    inputText: "#f7fafc",
    hover: "#374151",
    activeItem: "#4a5568",
    activeItemText: "#f7fafc",
    headerAccent: "#f7fafc",
  },
  emerald: {
    appBg: "#022c22",
    sidebarBg: "#064e3b",
    sidebarBorder: "#0d7a5f",
    panelBg: "#053828",
    chatBg: "#022c22",
    text: "#f5f0e0",
    textMuted: "#b8c4a8",
    textSubtle: "#7a8a6a",
    accent: "#c9a84c",
    accentText: "#053828",
    bubbleMe: "#c9a84c",
    bubbleMeText: "#053828",
    bubbleThem: "#0d3a2c",
    bubbleThemText: "#f5f0e0",
    bubbleThemBorder: "#0d7a5f",
    inputBg: "#064e3b",
    inputText: "#f5f0e0",
    hover: "#0a4030",
    activeItem: "#0d7a5f",
    activeItemText: "#f5f0e0",
    headerAccent: "#f5f0e0",
  },
  hearts: {
    appBg: "#fef0f2",
    sidebarBg: "#ffffff",
    sidebarBorder: "#fbd5dc",
    panelBg: "#fff5f6",
    chatBg: "#fef0f2",
    text: "#3a0d18",
    textMuted: "#8b4a55",
    textSubtle: "#c98a95",
    accent: "#e94560",
    accentText: "#ffffff",
    bubbleMe: "#e94560",
    bubbleMeText: "#ffffff",
    bubbleThem: "#ffffff",
    bubbleThemText: "#3a0d18",
    bubbleThemBorder: "#fbd5dc",
    inputBg: "#fef0f2",
    inputText: "#3a0d18",
    hover: "#fde4e8",
    activeItem: "#fcdce2",
    activeItemText: "#a8243e",
    headerAccent: "#3a0d18",
  },
  bestie: {
    appBg: "#fdf2f8",
    sidebarBg: "#ffffff",
    sidebarBorder: "#fbcfe8",
    panelBg: "#fff5fa",
    chatBg: "#fdf2f8",
    text: "#3a1a2a",
    textMuted: "#8b5a72",
    textSubtle: "#c99ab0",
    accent: "#e07ba8",
    accentText: "#ffffff",
    bubbleMe: "#e07ba8",
    bubbleMeText: "#ffffff",
    bubbleThem: "#ffffff",
    bubbleThemText: "#3a1a2a",
    bubbleThemBorder: "#fbcfe8",
    inputBg: "#fdf2f8",
    inputText: "#3a1a2a",
    hover: "#fce7f3",
    activeItem: "#fbcfe8",
    activeItemText: "#a8245a",
    headerAccent: "#3a1a2a",
  },
  unicorn: {
    appBg: "#fdf2f4",
    sidebarBg: "#ffffff",
    sidebarBorder: "#f5c4d4",
    panelBg: "#fff5f8",
    chatBg: "linear-gradient(135deg, #fde2e4 0%, #fce0ec 50%, #e8dcf5 100%)",
    text: "#3a1a3a",
    textMuted: "#8b5a82",
    textSubtle: "#c99ac0",
    accent: "#c084fc",
    accentText: "#ffffff",
    bubbleMe: "#a855f7",
    bubbleMeText: "#ffffff",
    bubbleThem: "#ffffff",
    bubbleThemText: "#3a1a3a",
    bubbleThemBorder: "#f5c4d4",
    inputBg: "#ffffff",
    inputText: "#3a1a3a",
    hover: "#fce7f3",
    activeItem: "#f3e8ff",
    activeItemText: "#7c3aed",
    headerAccent: "#3a1a3a",
  },
  galaxy: {
    appBg: "#0f0a1f",
    sidebarBg: "#1a1235",
    sidebarBorder: "#2d2050",
    panelBg: "#15102a",
    chatBg: "linear-gradient(135deg, #1a1a3a 0%, #2a1f4a 50%, #3a2560 100%)",
    text: "#e8e0f5",
    textMuted: "#a89cc8",
    textSubtle: "#6b5a8a",
    accent: "#a78bfa",
    accentText: "#0f0a1f",
    bubbleMe: "#7c3aed",
    bubbleMeText: "#ffffff",
    bubbleThem: "#241a3f",
    bubbleThemText: "#e8e0f5",
    bubbleThemBorder: "#3a2860",
    inputBg: "#1a1235",
    inputText: "#e8e0f5",
    hover: "#241a45",
    activeItem: "#2d2050",
    activeItemText: "#c4b5fd",
    headerAccent: "#e8e0f5",
  },
};

const STORAGE_KEY = "chatterbox.messages.v2";
const THEME_KEY = "chatterbox.theme.v2";
const ACTIVE_KEY = "chatterbox.active.v2";

const CONVERSATIONS: Conversation[] = [
  { id: "alex", name: "Alex Morgan", initials: "AM", accent: "#3b82f6", preview: "Hello! 👋", unread: 2, online: true },
  { id: "design", name: "Design Team", initials: "DT", accent: "#a855f7", preview: "Shipping the new theme today.", online: true },
  { id: "priya", name: "Priya Patel", initials: "PP", accent: "#10b981", preview: "Sounds good — talk later." },
  { id: "marcus", name: "Marcus Lee", initials: "ML", accent: "#f59e0b", preview: "Sent you the file." },
  { id: "sam", name: "Sam Rivera", initials: "SR", accent: "#ef4444", preview: "🎉 congrats!" },
];

const DEMO_THREADS: Record<string, Message[]> = {
  alex: [
    { id: "1", text: "Hey! Did you get a chance to look at the new mockups?", who: "them", ts: Date.now() - 1000 * 60 * 60 * 2 },
    { id: "2", text: "Yes — the layout feels much cleaner now.", who: "me", ts: Date.now() - 1000 * 60 * 60 * 2 + 60000 },
    { id: "3", text: "Hello! 👋", who: "them", ts: Date.now() - 1000 * 60 * 5 },
  ],
};

function uid() { return Math.random().toString(36).slice(2, 10); }
function fmtTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function fmtDay(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const yest = new Date(); yest.setDate(yest.getDate() - 1);
  if (d.toDateString() === yest.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function ChatterBox() {
  const [theme, setTheme] = useState<Theme>("light");
  const [activeId, setActiveId] = useState<string>("alex");
  const [threads, setThreads] = useState<Record<string, Message[]>>({});
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [showThemes, setShowThemes] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const t = localStorage.getItem(THEME_KEY) as Theme | null;
      if (t && T[t]) setTheme(t);
      const a = localStorage.getItem(ACTIVE_KEY);
      if (a) setActiveId(a);
      const raw = localStorage.getItem(STORAGE_KEY);
      setThreads(raw ? JSON.parse(raw) : DEMO_THREADS);
    } catch { setThreads(DEMO_THREADS); }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(threads)); } catch {}
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [threads, activeId]);

  useEffect(() => { try { localStorage.setItem(THEME_KEY, theme); } catch {} }, [theme]);
  useEffect(() => { try { localStorage.setItem(ACTIVE_KEY, activeId); } catch {} }, [activeId]);

  const c = T[theme];
  const active = CONVERSATIONS.find(x => x.id === activeId) ?? CONVERSATIONS[0];
  const messages = threads[activeId] ?? [];

  const filtered = useMemo(
    () => CONVERSATIONS.filter(x => x.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setThreads(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), { id: uid(), text, who: "me", ts: Date.now() }],
    }));
    setDraft("");
    setTimeout(() => {
      const replies = ["Got it! ✨", "Makes sense.", "Tell me more.", "👍", "Sounds great!", "On it."];
      const r = replies[Math.floor(Math.random() * replies.length)];
      setThreads(prev => ({
        ...prev,
        [activeId]: [...(prev[activeId] ?? []), { id: uid(), text: r, who: "them", ts: Date.now() }],
      }));
    }, 700);
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clearChat = () => {
    if (confirm(`Clear conversation with ${active.name}?`)) {
      setThreads(prev => ({ ...prev, [activeId]: [] }));
    }
  };

  return (
    <div
      style={{ background: c.appBg, color: c.text, fontFamily: "'Manrope', system-ui, sans-serif" }}
      className="h-screen w-full flex overflow-hidden"
    >
      {/* Sidebar */}
      <aside
        style={{ background: c.sidebarBg, borderColor: c.sidebarBorder }}
        className="hidden md:flex w-72 lg:w-80 flex-col border-r"
      >
        <div className="px-5 py-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${c.sidebarBorder}` }}>
          <div className="flex items-center gap-2.5">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center"
              style={{ background: c.accent, color: c.accentText }}
            >
              <MessageSquare className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Sora', sans-serif", color: c.headerAccent }} className="text-lg font-bold leading-none">ChatterBox</h1>
              <p style={{ color: c.textSubtle }} className="text-[11px] mt-0.5 font-medium">Workspace</p>
            </div>
          </div>
          <button
            className="h-8 w-8 rounded-lg flex items-center justify-center transition"
            style={{ color: c.textMuted }}
            onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            title="New chat"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-3">
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2"
            style={{ background: c.inputBg }}
          >
            <Search className="h-4 w-4" style={{ color: c.textSubtle }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations"
              className="bg-transparent flex-1 text-sm focus:outline-none"
              style={{ color: c.inputText }}
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-2">
          <p className="px-3 py-2 text-[11px] uppercase tracking-wider font-semibold" style={{ color: c.textSubtle }}>
            Conversations
          </p>
          {filtered.map((conv) => {
            const isActive = conv.id === activeId;
            return (
              <button
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition text-left"
                style={{
                  background: isActive ? c.activeItem : "transparent",
                  color: isActive ? c.activeItemText : c.text,
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = c.hover; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <div className="relative shrink-0">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                    style={{ background: conv.accent }}
                  >
                    {conv.initials}
                  </div>
                  {conv.online && (
                    <span
                      className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2"
                      style={{ background: "#10b981", boxShadow: `0 0 0 2px ${isActive ? c.activeItem : c.sidebarBg}` }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold truncate" style={{ fontFamily: "'Sora', sans-serif" }}>{conv.name}</p>
                    {conv.unread && (
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: c.accent, color: c.accentText }}
                      >
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs truncate mt-0.5" style={{ color: isActive ? c.activeItemText : c.textMuted }}>
                    {conv.preview}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Theme picker */}
        <div className="px-3 py-3" style={{ borderTop: `1px solid ${c.sidebarBorder}` }}>
          <button
            onClick={() => setShowThemes(v => !v)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition"
            style={{ color: c.text }}
            onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Palette className="h-4 w-4" />
            <span className="flex-1 text-left">Theme</span>
            <span className="text-xs capitalize" style={{ color: c.textMuted }}>{theme}</span>
          </button>
          {showThemes && (
            <div className="grid grid-cols-3 gap-2 mt-2 px-1">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  title={t.label}
                  className="aspect-square rounded-lg overflow-hidden ring-2 transition"
                  style={{
                    background: `linear-gradient(135deg, ${t.swatch[0]} 50%, ${t.swatch[1]} 50%)`,
                    boxShadow: theme === t.value ? `0 0 0 2px ${c.accent}` : "none",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main panel */}
      <section className="flex-1 flex flex-col min-w-0" style={{ background: c.panelBg }}>
        {/* Header */}
        <header
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: `1px solid ${c.sidebarBorder}` }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                style={{ background: active.accent }}
              >
                {active.initials}
              </div>
              {active.online && (
                <span
                  className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full"
                  style={{ background: "#10b981", boxShadow: `0 0 0 2px ${c.panelBg}` }}
                />
              )}
            </div>
            <div className="min-w-0">
              <h2 style={{ fontFamily: "'Sora', sans-serif", color: c.headerAccent }} className="text-base font-semibold truncate">
                {active.name}
              </h2>
              <p className="text-xs" style={{ color: c.textMuted }}>
                {active.online ? "Active now" : "Last seen recently"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[Phone, Video, Settings].map((Icon, i) => (
              <button
                key={i}
                className="h-9 w-9 rounded-lg flex items-center justify-center transition"
                style={{ color: c.textMuted }}
                onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Icon className="h-4.5 w-4.5" />
              </button>
            ))}
            <button
              onClick={clearChat}
              title="Clear chat"
              className="h-9 w-9 rounded-lg flex items-center justify-center transition"
              style={{ color: c.textMuted }}
              onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Chat */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 sm:px-8 py-6"
          style={{ background: c.chatBg }}
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center" style={{ color: c.textMuted }}>
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: c.hover, color: c.accent }}
              >
                <MessageSquare className="h-7 w-7" />
              </div>
              <p style={{ fontFamily: "'Sora', sans-serif", color: c.text }} className="font-semibold">No messages yet</p>
              <p className="text-sm mt-1">Say hi to {active.name} 👋</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-2">
              <div className="flex justify-center my-3">
                <span
                  className="text-[11px] font-medium px-3 py-1 rounded-full"
                  style={{ background: c.hover, color: c.textMuted }}
                >
                  {fmtDay(messages[0].ts)}
                </span>
              </div>
              {messages.map((m, i) => {
                const prev = messages[i - 1];
                const grouped = prev && prev.who === m.who && m.ts - prev.ts < 60000 * 5;
                return (
                  <div key={m.id} className={`flex ${m.who === "me" ? "justify-end" : "justify-start"} ${grouped ? "mt-1" : "mt-3"}`}>
                    {m.who === "them" && !grouped && (
                      <div
                        className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white mr-2 mt-auto shrink-0"
                        style={{ background: active.accent }}
                      >
                        {active.initials}
                      </div>
                    )}
                    {m.who === "them" && grouped && <div className="w-7 mr-2 shrink-0" />}
                    <div className="flex flex-col" style={{ maxWidth: "70%" }}>
                      <div
                        className="px-4 py-2.5 rounded-2xl shadow-sm"
                        style={{
                          background: m.who === "me" ? c.bubbleMe : c.bubbleThem,
                          color: m.who === "me" ? c.bubbleMeText : c.bubbleThemText,
                          border: m.who === "them" ? `1px solid ${c.bubbleThemBorder}` : "none",
                          borderTopLeftRadius: m.who === "them" && grouped ? "0.75rem" : undefined,
                          borderTopRightRadius: m.who === "me" && grouped ? "0.75rem" : undefined,
                        }}
                      >
                        <p className="text-[14.5px] leading-relaxed whitespace-pre-wrap break-words">{m.text}</p>
                      </div>
                      <div
                        className={`flex items-center gap-1 mt-1 px-1 text-[10.5px] ${m.who === "me" ? "justify-end" : "justify-start"}`}
                        style={{ color: c.textSubtle }}
                      >
                        <span>{fmtTime(m.ts)}</span>
                        {m.who === "me" && (i === messages.length - 1 ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Composer */}
        <footer className="px-4 sm:px-8 py-4 shrink-0" style={{ borderTop: `1px solid ${c.sidebarBorder}`, background: c.panelBg }}>
          <div className="max-w-3xl mx-auto">
            <div
              className="flex items-end gap-2 rounded-2xl px-3 py-2"
              style={{ background: c.inputBg, border: `1px solid ${c.sidebarBorder}` }}
            >
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKey}
                placeholder={`Message ${active.name}…`}
                rows={1}
                className="flex-1 bg-transparent resize-none px-2 py-2 text-sm focus:outline-none max-h-40"
                style={{ color: c.inputText, fontFamily: "'Manrope', sans-serif" }}
              />
              <button
                onClick={send}
                disabled={!draft.trim()}
                className="h-9 w-9 rounded-xl flex items-center justify-center transition disabled:opacity-40 shrink-0"
                style={{ background: c.accent, color: c.accentText }}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[11px] mt-2 px-2" style={{ color: c.textSubtle }}>
              Press <kbd className="font-mono">Enter</kbd> to send · <kbd className="font-mono">Shift+Enter</kbd> for newline
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
}
