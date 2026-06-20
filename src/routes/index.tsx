import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp, Trash2, Hash, Plus, CornerDownLeft } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CHATTERBOX // Dispatch" },
      { name: "description", content: "An unconventional brutalist transcript messenger." },
      { property: "og:title", content: "CHATTERBOX // Dispatch" },
      { property: "og:description", content: "An unconventional brutalist transcript messenger." },
    ],
  }),
  component: ChatterBox,
});

type Theme = "paper" | "terminal" | "blueprint" | "vapor" | "noir" | "riso" | "solar";

type Message = { id: string; text: string; who: "me" | "them"; ts: number };
type Channel = { id: string; name: string; tag: string; preview: string };

type Tokens = {
  bg: string; bgPattern?: string; ink: string; mute: string; faint: string;
  card: string; cardMe: string; cardThem: string; cardMeInk: string; cardThemInk: string;
  border: string; accent: string; accentInk: string; shadow: string;
  rule: string; tagBg: string; tagInk: string; activeTagBg: string; activeTagInk: string;
  serif: string; sans: string; mono: string;
  bigTime: string;
};

const SANS = "'Manrope', system-ui, sans-serif";
const SERIF = "'Instrument Serif', 'Times New Roman', serif";
const MONO = "'JetBrains Mono', 'Courier New', monospace";
const DISPLAY = "'Sora', system-ui, sans-serif";

const T: Record<Theme, Tokens> = {
  paper: {
    bg: "#f0ebe0", ink: "#1a1a1a", mute: "#5a544a", faint: "#a8a195",
    card: "#fdfaf2", cardMe: "#1a1a1a", cardThem: "#fdfaf2",
    cardMeInk: "#f0ebe0", cardThemInk: "#1a1a1a",
    border: "#1a1a1a", accent: "#d4451f", accentInk: "#fdfaf2",
    shadow: "#1a1a1a", rule: "#1a1a1a",
    tagBg: "#fdfaf2", tagInk: "#1a1a1a", activeTagBg: "#1a1a1a", activeTagInk: "#f0ebe0",
    serif: SERIF, sans: SANS, mono: MONO, bigTime: SERIF,
  },
  terminal: {
    bg: "#0a0e0a", ink: "#7fff9f", mute: "#4a8a5f", faint: "#2a5a3a",
    card: "#0f1410", cardMe: "#7fff9f", cardThem: "#0f1410",
    cardMeInk: "#0a0e0a", cardThemInk: "#7fff9f",
    border: "#7fff9f", accent: "#7fff9f", accentInk: "#0a0e0a",
    shadow: "#1a3a20", rule: "#2a5a3a",
    tagBg: "transparent", tagInk: "#7fff9f", activeTagBg: "#7fff9f", activeTagInk: "#0a0e0a",
    serif: MONO, sans: MONO, mono: MONO, bigTime: MONO,
  },
  blueprint: {
    bg: "#0a2540", bgPattern: "blueprint", ink: "#e0f0ff", mute: "#7aa0c4", faint: "#3a5a7a",
    card: "#0f3258", cardMe: "#ffd84d", cardThem: "#0f3258",
    cardMeInk: "#0a2540", cardThemInk: "#e0f0ff",
    border: "#5a8ab8", accent: "#ffd84d", accentInk: "#0a2540",
    shadow: "#04162a", rule: "#3a5a7a",
    tagBg: "transparent", tagInk: "#e0f0ff", activeTagBg: "#ffd84d", activeTagInk: "#0a2540",
    serif: SERIF, sans: SANS, mono: MONO, bigTime: MONO,
  },
  vapor: {
    bg: "linear-gradient(180deg,#1a0a3a 0%,#3a1a5a 50%,#ff6ec7 100%)", ink: "#fef0ff", mute: "#c8a8e8", faint: "#8a6ab0",
    card: "rgba(255,255,255,0.08)", cardMe: "#ff6ec7", cardThem: "rgba(255,255,255,0.08)",
    cardMeInk: "#1a0a3a", cardThemInk: "#fef0ff",
    border: "#ff6ec7", accent: "#7df9ff", accentInk: "#1a0a3a",
    shadow: "#7df9ff", rule: "#c8a8e8",
    tagBg: "rgba(255,255,255,0.08)", tagInk: "#fef0ff", activeTagBg: "#7df9ff", activeTagInk: "#1a0a3a",
    serif: SERIF, sans: SANS, mono: MONO, bigTime: SERIF,
  },
  noir: {
    bg: "#0a0a0a", ink: "#f5f5f5", mute: "#888", faint: "#444",
    card: "#141414", cardMe: "#f5f5f5", cardThem: "#141414",
    cardMeInk: "#0a0a0a", cardThemInk: "#f5f5f5",
    border: "#f5f5f5", accent: "#c9a84c", accentInk: "#0a0a0a",
    shadow: "#c9a84c", rule: "#333",
    tagBg: "transparent", tagInk: "#f5f5f5", activeTagBg: "#c9a84c", activeTagInk: "#0a0a0a",
    serif: SERIF, sans: SANS, mono: MONO, bigTime: SERIF,
  },
  riso: {
    bg: "#fef0e8", ink: "#1a1a3a", mute: "#5a4a6a", faint: "#a89ab0",
    card: "#ffffff", cardMe: "#ff5722", cardThem: "#ffffff",
    cardMeInk: "#ffffff", cardThemInk: "#1a1a3a",
    border: "#1a1a3a", accent: "#3a4ab8", accentInk: "#ffffff",
    shadow: "#3a4ab8", rule: "#1a1a3a",
    tagBg: "#ffffff", tagInk: "#1a1a3a", activeTagBg: "#3a4ab8", activeTagInk: "#ffffff",
    serif: SERIF, sans: SANS, mono: MONO, bigTime: SERIF,
  },
  solar: {
    bg: "#fdf6e3", ink: "#073642", mute: "#586e75", faint: "#93a1a1",
    card: "#eee8d5", cardMe: "#cb4b16", cardThem: "#eee8d5",
    cardMeInk: "#fdf6e3", cardThemInk: "#073642",
    border: "#073642", accent: "#268bd2", accentInk: "#fdf6e3",
    shadow: "#073642", rule: "#93a1a1",
    tagBg: "#eee8d5", tagInk: "#073642", activeTagBg: "#268bd2", activeTagInk: "#fdf6e3",
    serif: SERIF, sans: SANS, mono: MONO, bigTime: SERIF,
  },
};

const THEME_LIST: { value: Theme; label: string }[] = [
  { value: "paper", label: "Paper" },
  { value: "terminal", label: "Terminal" },
  { value: "blueprint", label: "Blueprint" },
  { value: "vapor", label: "Vapor" },
  { value: "noir", label: "Noir" },
  { value: "riso", label: "Riso" },
  { value: "solar", label: "Solar" },
];

const CHANNELS: Channel[] = [
  { id: "alex", name: "Alex Morgan", tag: "AM-01", preview: "the mockups feel cleaner" },
  { id: "design", name: "Design Bureau", tag: "DB-02", preview: "shipping the new theme today" },
  { id: "priya", name: "Priya Patel", tag: "PP-03", preview: "sounds good — talk later" },
  { id: "marcus", name: "Marcus Lee", tag: "ML-04", preview: "sent you the file" },
  { id: "sam", name: "Sam Rivera", tag: "SR-05", preview: "congrats!" },
];

const DEMO: Record<string, Message[]> = {
  alex: [
    { id: "1", text: "Hey — got a minute to look at the new mockups?", who: "them", ts: Date.now() - 7200000 },
    { id: "2", text: "Yeah. Layout reads much cleaner now. The hierarchy actually works.", who: "me", ts: Date.now() - 7140000 },
    { id: "3", text: "Hello! 👋", who: "them", ts: Date.now() - 300000 },
  ],
};

const STORAGE = "chatterbox.v3.threads";
const THEME_K = "chatterbox.v3.theme";
const ACTIVE_K = "chatterbox.v3.active";

function uid() { return Math.random().toString(36).slice(2, 10); }
function pad(n: number) { return String(n).padStart(2, "0"); }
function fmtTime(ts: number) {
  const d = new Date(ts);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fmtDate(ts: number) {
  const d = new Date(ts);
  return `${d.toLocaleDateString([], { weekday: "short" }).toUpperCase()} · ${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()}`;
}

function ChatterBox() {
  const [theme, setTheme] = useState<Theme>("paper");
  const [activeId, setActiveId] = useState("alex");
  const [threads, setThreads] = useState<Record<string, Message[]>>({});
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const t = localStorage.getItem(THEME_K) as Theme | null;
      if (t && T[t]) setTheme(t);
      const a = localStorage.getItem(ACTIVE_K);
      if (a) setActiveId(a);
      const raw = localStorage.getItem(STORAGE);
      setThreads(raw ? JSON.parse(raw) : DEMO);
    } catch { setThreads(DEMO); }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify(threads)); } catch {}
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [threads, activeId]);
  useEffect(() => { try { localStorage.setItem(THEME_K, theme); } catch {} }, [theme]);
  useEffect(() => { try { localStorage.setItem(ACTIVE_K, activeId); } catch {} }, [activeId]);

  const c = T[theme];
  const active = CHANNELS.find(x => x.id === activeId) ?? CHANNELS[0];
  const messages = threads[activeId] ?? [];
  const count = useMemo(() => messages.length, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setThreads(p => ({ ...p, [activeId]: [...(p[activeId] ?? []), { id: uid(), text, who: "me", ts: Date.now() }] }));
    setDraft("");
    setTimeout(() => {
      const replies = ["Noted.", "Copy that.", "Tell me more.", "On it.", "Understood — sending now.", "Good call."];
      const r = replies[Math.floor(Math.random() * replies.length)];
      setThreads(p => ({ ...p, [activeId]: [...(p[activeId] ?? []), { id: uid(), text: r, who: "them", ts: Date.now() }] }));
    }, 700);
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clearChat = () => {
    if (confirm(`Clear dispatch ${active.tag}?`)) setThreads(p => ({ ...p, [activeId]: [] }));
  };

  const isDark = ["terminal", "blueprint", "vapor", "noir"].includes(theme);
  const patternBg = theme === "blueprint"
    ? "linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)"
    : theme === "paper"
    ? "radial-gradient(rgba(0,0,0,.06) 1px,transparent 1px)"
    : undefined;

  return (
    <div
      style={{
        background: c.bg,
        color: c.ink,
        fontFamily: c.sans,
        backgroundImage: patternBg,
        backgroundSize: theme === "blueprint" ? "24px 24px" : theme === "paper" ? "4px 4px" : undefined,
      }}
      className="min-h-screen w-full flex flex-col"
    >
      {/* MASTHEAD */}
      <header
        className="px-4 sm:px-8 pt-6 pb-4 border-b-2"
        style={{ borderColor: c.rule }}
      >
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="flex items-baseline gap-3">
            <h1
              style={{ fontFamily: c.bigTime, color: c.ink, letterSpacing: theme === "terminal" ? "0.05em" : "-0.04em" }}
              className="text-5xl sm:text-7xl font-black leading-none lowercase"
            >
              chatterbox<span style={{ color: c.accent }}>.</span>
            </h1>
            <span style={{ fontFamily: c.mono, color: c.mute }} className="text-[10px] sm:text-xs tracking-widest uppercase">
              vol·03 / dispatch
            </span>
          </div>
          <div style={{ fontFamily: c.mono, color: c.mute }} className="text-[10px] sm:text-xs tracking-widest uppercase">
            {fmtDate(Date.now())} — ISSUE №{pad(count)}
          </div>
        </div>

        {/* THEME PRESETS — stamp row */}
        <div className="mt-5 flex items-center gap-2 flex-wrap">
          <span style={{ fontFamily: c.mono, color: c.faint }} className="text-[10px] tracking-widest uppercase mr-1">
            mode ›
          </span>
          {THEME_LIST.map((t) => {
            const sel = theme === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                style={{
                  fontFamily: c.mono,
                  background: sel ? c.activeTagBg : c.tagBg,
                  color: sel ? c.activeTagInk : c.tagInk,
                  border: `1.5px solid ${c.border}`,
                  boxShadow: sel ? `3px 3px 0 ${c.shadow}` : "none",
                  transform: sel ? "translate(-1px,-1px)" : "none",
                }}
                className="text-[10px] tracking-widest uppercase px-2.5 py-1 transition-all"
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* CHANNEL RAIL */}
      <nav
        className="px-4 sm:px-8 py-3 border-b-2 flex items-center gap-2 overflow-x-auto"
        style={{ borderColor: c.rule, fontFamily: c.mono }}
      >
        <Hash className="h-3.5 w-3.5 shrink-0" style={{ color: c.mute }} />
        {CHANNELS.map((ch) => {
          const sel = ch.id === activeId;
          return (
            <button
              key={ch.id}
              onClick={() => setActiveId(ch.id)}
              style={{
                background: sel ? c.activeTagBg : "transparent",
                color: sel ? c.activeTagInk : c.ink,
                border: `1.5px solid ${sel ? c.border : c.rule}`,
                boxShadow: sel ? `3px 3px 0 ${c.shadow}` : "none",
                transform: sel ? "translate(-1px,-1px)" : "none",
              }}
              className="shrink-0 px-3 py-1.5 text-[11px] tracking-widest uppercase transition-all whitespace-nowrap"
              title={ch.preview}
            >
              {ch.tag} · {ch.name}
            </button>
          );
        })}
        <button
          style={{ color: c.mute, border: `1.5px dashed ${c.rule}` }}
          className="shrink-0 h-7 w-7 flex items-center justify-center"
          title="New"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </nav>

      {/* TRANSCRIPT */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-10 py-10">
          {/* dispatch header */}
          <div className="mb-10 flex items-end justify-between gap-4 border-b-2 pb-4" style={{ borderColor: c.rule }}>
            <div>
              <p style={{ fontFamily: c.mono, color: c.mute }} className="text-[10px] tracking-widest uppercase">
                Open dispatch / {active.tag}
              </p>
              <h2
                style={{ fontFamily: c.bigTime, color: c.ink, letterSpacing: "-0.02em" }}
                className="text-4xl sm:text-5xl font-black leading-tight mt-1 lowercase"
              >
                to: {active.name}
              </h2>
            </div>
            <button
              onClick={clearChat}
              style={{ fontFamily: c.mono, color: c.mute, border: `1.5px solid ${c.rule}` }}
              className="text-[10px] tracking-widest uppercase px-2.5 py-1.5 flex items-center gap-1.5 shrink-0"
            >
              <Trash2 className="h-3 w-3" /> purge
            </button>
          </div>

          {count === 0 ? (
            <div className="py-20 text-center">
              <p style={{ fontFamily: c.bigTime, color: c.mute }} className="text-3xl italic lowercase">— silence on the wire —</p>
              <p style={{ fontFamily: c.mono, color: c.faint }} className="text-[11px] tracking-widest uppercase mt-3">
                begin transmission below
              </p>
            </div>
          ) : (
            <ol className="space-y-8">
              {messages.map((m, i) => {
                const isMe = m.who === "me";
                return (
                  <li
                    key={m.id}
                    className="grid grid-cols-[auto_1fr] gap-4 sm:gap-6"
                    style={{ direction: isMe ? "rtl" : "ltr" }}
                  >
                    {/* big timestamp gutter */}
                    <div style={{ direction: "ltr" }} className="text-right shrink-0 pt-1 w-16 sm:w-20">
                      <div
                        style={{ fontFamily: c.bigTime, color: isMe ? c.accent : c.ink, letterSpacing: "-0.04em" }}
                        className="text-3xl sm:text-4xl font-black leading-none tabular-nums"
                      >
                        {fmtTime(m.ts).split(":")[0]}
                      </div>
                      <div
                        style={{ fontFamily: c.mono, color: c.mute }}
                        className="text-[10px] tracking-widest tabular-nums mt-0.5"
                      >
                        :{fmtTime(m.ts).split(":")[1]} · №{pad(i + 1)}
                      </div>
                    </div>

                    {/* dispatch card */}
                    <div style={{ direction: "ltr" }} className="min-w-0">
                      <div
                        style={{ fontFamily: c.mono, color: c.mute }}
                        className="text-[10px] tracking-widest uppercase mb-1.5 flex items-center gap-2"
                      >
                        <span
                          className="inline-block h-1.5 w-1.5"
                          style={{ background: isMe ? c.accent : c.ink }}
                        />
                        {isMe ? "you" : active.tag} → {isMe ? active.tag : "you"}
                      </div>
                      <div
                        style={{
                          background: isMe ? c.cardMe : c.cardThem,
                          color: isMe ? c.cardMeInk : c.cardThemInk,
                          border: `2px solid ${c.border}`,
                          boxShadow: `5px 5px 0 ${c.shadow}`,
                          transform: `rotate(${(isMe ? -0.25 : 0.35)}deg)`,
                          backdropFilter: theme === "vapor" ? "blur(8px)" : undefined,
                        }}
                        className="px-5 py-4"
                      >
                        <p
                          style={{ fontFamily: c.serif }}
                          className="text-lg sm:text-xl leading-snug whitespace-pre-wrap break-words"
                        >
                          {m.text}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </main>

      {/* COMPOSER — bottom bar with stamped border */}
      <footer
        className="px-4 sm:px-8 py-4 border-t-2 shrink-0"
        style={{ borderColor: c.rule, background: isDark ? "transparent" : c.bg }}
      >
        <div className="max-w-4xl mx-auto">
          <div
            className="flex items-stretch gap-3"
            style={{ border: `2px solid ${c.border}`, boxShadow: `5px 5px 0 ${c.shadow}`, background: c.card }}
          >
            <div
              style={{ fontFamily: c.mono, color: c.mute, borderRight: `1.5px dashed ${c.rule}` }}
              className="px-3 py-3 text-[10px] tracking-widest uppercase flex flex-col items-start justify-between shrink-0"
            >
              <span>→ {active.tag}</span>
              <span style={{ color: c.faint }}>{fmtTime(Date.now())}</span>
            </div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKey}
              placeholder={`transmit to ${active.name.toLowerCase()}…`}
              rows={1}
              style={{ color: c.ink, fontFamily: c.serif, background: "transparent" }}
              className="flex-1 resize-none px-2 py-3 text-lg focus:outline-none max-h-40 placeholder:italic"
            />
            <button
              onClick={send}
              disabled={!draft.trim()}
              style={{ background: c.accent, color: c.accentInk, fontFamily: c.mono }}
              className="px-4 sm:px-6 text-[11px] tracking-widest uppercase font-bold flex items-center gap-2 disabled:opacity-30 transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]"
            >
              <ArrowUp className="h-4 w-4" /> send
            </button>
          </div>
          <div style={{ fontFamily: c.mono, color: c.faint }} className="text-[10px] tracking-widest uppercase mt-2 flex items-center gap-3">
            <span className="flex items-center gap-1"><CornerDownLeft className="h-3 w-3" /> transmit</span>
            <span>·</span>
            <span>shift+↵ newline</span>
            <span className="ml-auto">end of dispatch</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
