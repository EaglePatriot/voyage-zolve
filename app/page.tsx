"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { CreditCard, TrendingUp, Send, AlertCircle, ChevronRight, Sparkles, X, Check, Trophy, Users, Activity } from "lucide-react";
import { JourneyPath } from "@/components/primitives";

function capitalizeFirst(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const ease = [0.22, 1, 0.36, 1] as const;
function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease, delay },
  };
}

const BASE = "https://voyage-zolve.vercel.app";

type PanelType = "pay" | "boost" | "sendHome" | "headsUp" | "buddy" | "profile" | null;

type Insight = { headline: string; body: string; cta?: { label: string; action: string } | null };
type Transaction = { id: string; date: string; amount: number; category: string; merchant: string };
type UserData = { name: string; daysInUS: number; stage: string; creditScore: number };
type CohortSnapshot = {
  cohortName: string; subtitle: string; size: number;
  userPercentiles: { creditUtil: number; savingsRate: number; onTimePayments: number; creditScore: number };
};

const COUNTRIES = [
  { code: "IN", name: "India", currency: "INR", flag: "🇮🇳", rate: 83.12, symbol: "₹" },
  { code: "BR", name: "Brazil", currency: "BRL", flag: "🇧🇷", rate: 4.97, symbol: "R$" },
  { code: "PK", name: "Pakistan", currency: "PKR", flag: "🇵🇰", rate: 278.5, symbol: "₨" },
  { code: "MX", name: "Mexico", currency: "MXN", flag: "🇲🇽", rate: 17.15, symbol: "$" },
  { code: "PH", name: "Philippines", currency: "PHP", flag: "🇵🇭", rate: 56.4, symbol: "₱" },
  { code: "NG", name: "Nigeria", currency: "NGN", flag: "🇳🇬", rate: 1580, symbol: "₦" },
  { code: "BD", name: "Bangladesh", currency: "BDT", flag: "🇧🇩", rate: 109.5, symbol: "৳" },
  { code: "CO", name: "Colombia", currency: "COP", flag: "🇨🇴", rate: 3920, symbol: "$" },
];

const PAYMENT_METHODS = [
  { id: "apple", label: "Apple Pay", icon: "🍎" },
  { id: "debit", label: "Debit Card", icon: "💳" },
  { id: "ach", label: "Bank Transfer / ACH", icon: "🏦" },
  { id: "google", label: "Google Pay", icon: "🔵" },
  { id: "upi", label: "UPI", icon: "🇮🇳" },
];

const FALLBACK_TRANSACTIONS: Transaction[] = [
  { id: "f1", date: "2026-04-29", amount: 21.28, category: "Transport", merchant: "Uber" },
  { id: "f2", date: "2026-04-28", amount: 81.58, category: "Shopping", merchant: "Amazon" },
  { id: "f3", date: "2026-04-27", amount: 17.81, category: "Food", merchant: "Dutch Bros Coffee" },
];

const FALLBACK_USER: UserData = { name: "Rishi", daysInUS: 87, stage: "Finding My Footing", creditScore: 642 };

const FALLBACK_COHORT: CohortSnapshot = {
  cohortName: "UTD Global Freshmen '28",
  subtitle: "Class of '28",
  size: 52,
  userPercentiles: { creditUtil: 62, savingsRate: 30, onTimePayments: 88, creditScore: 40 },
};

const BOOST_OPPORTUNITIES = [
  { title: "Use ZETA for your next grocery run", req: "Spend $40 on groceries", reward: "+$50 limit", progress: 0.3, status: "In Progress" },
  { title: "Pay this month's statement early", req: "Pay before May 12", reward: "+$75 limit", progress: 1, status: "Ready" },
  { title: "Keep utilization under 30%", req: "Maintain for 14 days", reward: "+$100 limit", progress: 3 / 14, status: "3 / 14 days" },
  { title: "Make 3 on-time payments", req: "3 consecutive payments", reward: "+$150 limit", progress: 1 / 3, status: "1 / 3" },
];

// Shared bottom sheet wrapper — absolute positioned inside phone frame
function Sheet({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {/* Overlay is the positioning parent — flex + alignItems:flex-end pushes sheet to bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 110,
          background: "rgba(5,0,12,0.56)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "flex-end",  // ← this pushes the sheet to the bottom
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Sheet is a CHILD of the overlay — not a sibling absolute element */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          style={{
            width: "100%",
            maxHeight: "82%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: "28px 28px 0 0",
            background: "linear-gradient(180deg,#1a0933 0%,#0d0015 100%)",
            border: "1px solid rgba(168,85,247,0.25)",
            borderBottom: "none",
            boxShadow: "0 -16px 60px rgba(168,85,247,0.2)",
            flexShrink: 0,
          }}
        >
          {/* handle */}
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px", flexShrink: 0 }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(168,85,247,0.4)" }} />
          </div>
          {/* header — single close button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 20px 12px", borderBottom: "1px solid rgba(168,85,247,0.1)", flexShrink: 0 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#f0e6ff" }}>{title}</span>
            <button
              onClick={onClose}
              style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <X size={14} color="#a78bbc" />
            </button>
          </div>
          {/* scrollable content */}
          <div style={{ overflowY: "auto", flex: 1, padding: "16px 20px 32px", scrollbarWidth: "none", minHeight: 0 }}>
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Buddy chat inside a Sheet
function BuddyPanel({ initialMessage, onClose }: { initialMessage?: string; onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hey Rishi. What's on your mind today?" }
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialSent = useRef(false);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (initialMessage && !initialSent.current) {
      initialSent.current = true;
      setTimeout(() => send(initialMessage), 400);
    }
  }, []);

  async function send(text: string) {
    if (!text.trim() || streaming) return;
    const userMsg = { role: "user" as const, content: text.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages([...newMsgs, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);
    try {
      const res = await fetch(`${BASE}/api/buddy/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs }),
      });
      if (!res.ok || !res.body) throw new Error("failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const event of events) {
          if (!event.startsWith("data: ")) continue;
          try {
            const payload = JSON.parse(event.slice(6));
            if (payload.type === "text") {
              acc += payload.delta;
              setMessages(prev => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch { /* skip */ }
        }
      }
    } catch {
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: "Zolvi hit a snag. Try again in a sec." };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, scrollbarWidth: "none", marginBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "85%", padding: "10px 14px",
            borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            background: m.role === "user" ? "linear-gradient(135deg,#a855f7,#e879f9)" : "rgba(255,255,255,0.05)",
            border: m.role === "assistant" ? "1px solid rgba(168,85,247,0.15)" : "none",
            fontSize: 13, fontStyle: m.role === "assistant" ? "italic" : "normal",
            fontFamily: m.role === "assistant" ? "var(--font-serif)" : "inherit",
            color: "#f0e6ff", lineHeight: 1.5,
          }}>
            {m.content}
            {streaming && i === messages.length - 1 && m.role === "assistant" && (
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }}
                style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#a855f7", marginLeft: 4, verticalAlign: "middle" }} />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 14, padding: "8px 8px 8px 14px", flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); send(input); } }}
          placeholder="Ask Zolvi anything…"
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#f0e6ff", fontSize: 13, fontWeight: 500 }} />
        <button onClick={() => send(input)} disabled={!input.trim() || streaming}
          style={{ width: 34, height: 34, borderRadius: "50%", background: input.trim() ? "linear-gradient(135deg,#a855f7,#e879f9)" : "rgba(255,255,255,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Send size={14} color={input.trim() ? "#fff" : "#7a6e8e"} />
        </button>
      </div>
    </>
  );
}

export default function VoyageHome() {
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [buddyInitialMsg, setBuddyInitialMsg] = useState<string | undefined>();
  const [toast, setToast] = useState<string | null>(null);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [insightLoading, setInsightLoading] = useState(true);
  const [transactions] = useState<Transaction[]>(FALLBACK_TRANSACTIONS);
  const [userData] = useState<UserData>(FALLBACK_USER);
  const [cohortData] = useState<CohortSnapshot>(FALLBACK_COHORT);
  const [selectedPayment, setSelectedPayment] = useState("apple");
  const [paySuccess, setPaySuccess] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [sendAmount, setSendAmount] = useState("100");
  const [sendSuccess, setSendSuccess] = useState(false);
  const insightFetched = useRef(false);
  const router = useRouter();

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  function openPanel(panel: PanelType, buddyMsg?: string) {
    setActivePanel(panel);
    if (buddyMsg) setBuddyInitialMsg(buddyMsg);
  }

  function closePanel() {
    setActivePanel(null);
    setBuddyInitialMsg(undefined);
  }

  useEffect(() => {
    if (insightFetched.current) return;
    insightFetched.current = true;
    fetch(`${BASE}/api/insights/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scope: "daily_nudge" }),
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setInsight(data); setInsightLoading(false); })
      .catch(() => setInsightLoading(false));
  }, []);

  const displayUser = userData;
  const displayCohort = cohortData;
  const fee = 2.99;
  const sendAmountNum = parseFloat(sendAmount) || 0;
  const recipientAmount = ((sendAmountNum - fee) * selectedCountry.rate).toFixed(0);

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden relative">
      <style>{`
        @keyframes spin-ring { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes float-card { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-4px)} }
        .spin-ring { animation: spin-ring 4s linear infinite; }
        .float-c { animation: float-card 6s ease-in-out infinite; }
        .float-c2 { animation: float-card 6s ease-in-out infinite; animation-delay: -2s; }
        main::-webkit-scrollbar { display: none; }
      `}</style>
      <main className="flex flex-col flex-1 overflow-y-auto pb-28" style={{ scrollbarWidth: "none" }}>

      {/* Top bar */}
      <motion.header {...fade(0)} className="flex items-center justify-between px-6 pt-8 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full" style={{ background: "#a855f7", boxShadow: "0 0 10px #a855f7" }} />
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.28em", color: "#c2b3d9", fontWeight: 600 }}>ZETA</span>
        </div>
        <button onClick={() => openPanel("profile")}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.25),rgba(232,121,249,0.12))", border: "1px solid rgba(168,85,247,0.4)" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#f0e6ff" }}>R</span>
        </button>
      </motion.header>

      <div className="mx-6" style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(168,85,247,0.18),transparent)" }} />

      {/* Stage banner */}
      <motion.section {...fade(0.08)} className="px-6 pt-6 pb-5">
        <div className="flex items-center gap-2 mb-3">
          <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 999, background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.32)", color: "#c5a3ff", fontWeight: 600 }}>
            Day {displayUser.daysInUS}
          </span>
          <span style={{ fontSize: 10, color: "#7a6e8e", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 500 }}>in your US journey</span>
        </div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 48, lineHeight: 0.95, color: "#f0e6ff", textShadow: "0 0 40px rgba(168,85,247,0.3)", marginBottom: 8 }}>
          {displayUser.stage}
        </h1>
        <div style={{ height: 1, width: "75%", background: "linear-gradient(90deg,#a855f7,#e879f9,transparent)", marginBottom: 20 }} />
        <div className="relative mb-2">
          <JourneyPath />
          <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full"
            style={{ left: "65%", background: "radial-gradient(circle,#e879f9,#a855f7)", boxShadow: "0 0 16px #a855f7" }} />
        </div>
        <div className="flex justify-between" style={{ fontSize: 10, color: "#7a6e8e", fontWeight: 500 }}>
          <span>Arrival</span>
          <span style={{ color: "#e879f9", fontWeight: 600 }}>You</span>
          <span>Financial Freedom</span>
        </div>
      </motion.section>

      <div className="px-6 space-y-4">
        {/* Buddy card */}
        <motion.div {...fade(0.16)} className="float-c">
          <div className="relative rounded-2xl p-5 interactive-card breathing-glow"
            style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.08),rgba(232,121,249,0.04))", border: "1px solid rgba(168,85,247,0.2)" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "linear-gradient(135deg,rgba(255,255,255,0.06),transparent 50%)", pointerEvents: "none" }} />
            <div className="flex items-start gap-4 relative">
              <div className="relative w-12 h-12 shrink-0">
                <div className="absolute inset-0 rounded-full spin-ring" style={{ background: "conic-gradient(from 0deg,#a855f7,#e879f9,#38bdf8,#a855f7)" }} />
                <div className="absolute inset-[2px] rounded-full flex items-center justify-center" style={{ background: "#08001f" }}>
                  <Sparkles size={14} style={{ color: "#e879f9", filter: "drop-shadow(0 0 4px #e879f9)" }} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#c5a3ff", fontWeight: 600 }}>Zolvi</span>
                  <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 999, background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.22)", color: "#c5a3ff", fontWeight: 500 }}>just now</span>
                </div>
                <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 15, lineHeight: 1.4, color: "#f0e6ff", marginBottom: 14 }}>
                  &ldquo;Rishi — your utilization is at 62%. That&rsquo;s the #1 thing hurting your score right now. Want me to walk you through fixing it this week?&rdquo;
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openPanel("buddy", "my credit utilization is at 62% and i know thats bad — what are the fastest ways to bring it down this week?")}
                    className="breathing-glow transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{ padding: "8px 16px", borderRadius: 999, background: "linear-gradient(135deg,#a855f7,#e879f9)", color: "#fff", fontSize: 12, fontWeight: 600 }}>
                    Walk me through
                  </button>
                  <button onClick={() => showToast("We'll remind you tomorrow")}
                    className="transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{ padding: "8px 16px", borderRadius: 999, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#c2b3d9", fontSize: 12, fontWeight: 500 }}>
                    Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div {...fade(0.24)}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#7a6e8e", marginBottom: 12, fontWeight: 600 }}>Quick actions</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: CreditCard, top: "Pay", bottom: "April bill", color: "#a855f7", onClick: () => { setPaySuccess(false); openPanel("pay"); } },
              { icon: TrendingUp, top: "Boost", bottom: "Limit", color: "#e879f9", onClick: () => openPanel("boost") },
              { icon: Send, top: "Send", bottom: "Home", color: "#38bdf8", onClick: () => { setSendSuccess(false); openPanel("sendHome"); } },
            ].map(({ icon: Icon, top, bottom, color, onClick }) => (
              <button key={top} onClick={onClick}
                className="interactive-card flex flex-col items-center gap-2 rounded-2xl py-4 px-2"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = `0 0 20px ${color}33`; el.style.borderColor = `${color}44`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.borderColor = "rgba(255,255,255,0.06)"; }}>
                <Icon size={18} style={{ color, filter: `drop-shadow(0 0 4px ${color})` }} />
                <div className="text-center">
                  <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.14em", color: "#7a6e8e", fontWeight: 600 }}>{top}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#f0e6ff" }}>{bottom}</div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cohort */}
        <motion.div {...fade(0.32)} className="float-c2">
          <button onClick={() => router.push("/cohort")}
            className="interactive-card relative rounded-2xl p-5 w-full text-left"
            style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#7a6e8e", marginBottom: 8, fontWeight: 600 }}>Your cohort</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 20, color: "#f0e6ff" }}>{displayCohort.cohortName}</div>
                  <div style={{ fontSize: 11, color: "#7a6e8e", marginTop: 2, fontWeight: 500 }}>{displayCohort.subtitle} · {displayCohort.size} members</div>
                </div>
                <ChevronRight size={16} style={{ color: "#7a6e8e" }} />
              </div>
              <div style={{ fontSize: 10, display: "flex", justifyContent: "space-between", marginBottom: 8, fontWeight: 500 }}>
                <span style={{ color: "#7a6e8e" }}>Credit utilization</span>
                <span style={{ color: "#c5a3ff", fontWeight: 600 }}>Top {100 - displayCohort.userPercentiles.creditUtil}%</span>
              </div>
              <div className="relative h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                {[25, 50, 75].map(p => <div key={p} className="absolute top-0 bottom-0 w-px" style={{ left: `${p}%`, background: "rgba(255,255,255,0.08)" }} />)}
                <div className="absolute top-0 left-0 h-full rounded-full" style={{ width: `${displayCohort.userPercentiles.creditUtil}%`, background: "linear-gradient(90deg,rgba(168,85,247,0.3),rgba(168,85,247,0.6))" }} />
                <div className="absolute w-3 h-3 rounded-full" style={{ left: `${displayCohort.userPercentiles.creditUtil}%`, top: "50%", transform: "translateX(-50%) translateY(-50%)", background: "radial-gradient(circle,#e879f9,#a855f7)", boxShadow: "0 0 10px #a855f7" }} />
              </div>
              <div style={{ fontSize: 11, color: "#c5a3ff", marginTop: 8, fontWeight: 500 }}>Better than {displayCohort.userPercentiles.creditUtil}% of your cohort</div>
            </div>
          </button>
        </motion.div>

        {/* Insight */}
        <motion.div {...fade(0.4)}>
          <div className="interactive-card relative rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-start gap-3">
              <AlertCircle size={15} style={{ color: "#fb923c", flexShrink: 0, marginTop: 2 }} />
              <div className="flex-1 min-w-0">
                {insightLoading ? (
                  <div style={{ fontSize: 12, color: "#a78bbc" }}>Zolvi is reading your week…</div>
                ) : insight ? (
                  <>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#f0e6ff", marginBottom: 4 }}>{capitalizeFirst(insight.headline)}</div>
                    <div style={{ fontSize: 12, color: "#a78bbc", lineHeight: 1.5 }}>{insight.body}</div>
                  </>
                ) : (
                  <div style={{ fontSize: 12, color: "#a78bbc" }}>Your utilization is 62% — above the 30% sweet spot. This is the fastest thing you can fix to improve your score.</div>
                )}
              </div>
              <button
                onClick={() => openPanel("headsUp")}
                style={{ fontSize: 11, fontWeight: 600, color: "#c5a3ff", flexShrink: 0 }}>
                View
              </button>
            </div>
          </div>
        </motion.div>

        {/* Recent transactions */}
        <motion.div {...fade(0.48)}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#7a6e8e", marginBottom: 12, fontWeight: 600 }}>Recent</div>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            {transactions.length > 0 ? transactions.map((tx, i) => (
              <div key={tx.id} className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: i < transactions.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#f0e6ff" }}>{tx.merchant}</div>
                  <div style={{ fontSize: 11, color: "#7a6e8e", fontWeight: 500 }}>{tx.date}</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#c2b3d9" }}>−${tx.amount.toFixed(2)}</div>
              </div>
            )) : [1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <div style={{ height: 12, width: 120, borderRadius: 4, background: "rgba(255,255,255,0.06)" }} />
                <div style={{ height: 12, width: 60, borderRadius: 4, background: "rgba(255,255,255,0.06)" }} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div key="toast"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute", bottom: 100, left: "50%", transform: "translateX(-50%)",
              background: "rgba(20,10,40,0.95)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(168,85,247,0.3)", color: "#f0e6ff",
              fontSize: 12, fontWeight: 500, padding: "10px 18px", borderRadius: 999,
              zIndex: 60, whiteSpace: "nowrap",
            }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ALL PANELS — only one renders at a time */}
      <AnimatePresence>

        {/* PAY */}
        {activePanel === "pay" && (
          <Sheet key="pay" title="Pay April Balance" onClose={closePanel}>
            {!paySuccess ? (
              <>
                <div style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.15),rgba(232,121,249,0.08))", border: "1px solid rgba(168,85,247,0.25)", borderRadius: 16, padding: 20, marginBottom: 20, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#7a6e8e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>Current Balance</div>
                  <div style={{ fontSize: 40, fontWeight: 700, color: "#f0e6ff", fontFamily: "var(--font-mono)", letterSpacing: "-0.02em" }}>$312.45</div>
                  <div style={{ fontSize: 12, color: "#fb923c", marginTop: 6, fontWeight: 500 }}>Minimum due: $38.00 by May 12</div>
                </div>
                <div style={{ fontSize: 11, color: "#7a6e8e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 10 }}>Payment Method</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {PAYMENT_METHODS.map(m => (
                    <button key={m.id} onClick={() => setSelectedPayment(m.id)}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderRadius: 14, background: selectedPayment === m.id ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${selectedPayment === m.id ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.07)"}`, cursor: "pointer" }}>
                      <span style={{ fontSize: 20 }}>{m.icon}</span>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "#f0e6ff", flex: 1, textAlign: "left" }}>{m.label}</span>
                      {selectedPayment === m.id && <Check size={16} color="#a855f7" />}
                    </button>
                  ))}
                </div>
                <button onClick={() => setPaySuccess(true)}
                  style={{ width: "100%", padding: 16, borderRadius: 16, background: "linear-gradient(135deg,#a855f7,#e879f9)", color: "#fff", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer" }}>
                  Pay $312.45
                </button>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#a855f7,#e879f9)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <Check size={28} color="#fff" />
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#f0e6ff", marginBottom: 8 }}>Payment Scheduled</div>
                <div style={{ fontSize: 14, color: "#a78bbc", lineHeight: 1.6 }}>Your balance payment of $312.45 is being processed. It will reflect within 1–2 business days.</div>
              </motion.div>
            )}
          </Sheet>
        )}

        {/* BOOST */}
        {activePanel === "boost" && (
          <Sheet key="boost" title="Boost Your Limit" onClose={closePanel}>
            <div style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 16, padding: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#7a6e8e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Current</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#f0e6ff", fontFamily: "var(--font-mono)" }}>$500</div>
                </div>
                <ChevronRight size={16} color="#7a6e8e" />
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#7a6e8e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Potential</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#c5a3ff", fontFamily: "var(--font-mono)" }}>$650</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#7a6e8e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>Opportunities</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {BOOST_OPPORTUNITIES.map((o, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f0e6ff", flex: 1, marginRight: 8 }}>{o.title}</div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#c5a3ff", whiteSpace: "nowrap" }}>{o.reward}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#7a6e8e", marginBottom: 10 }}>{o.req}</div>
                  <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", marginBottom: 10, overflow: "hidden" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${o.progress * 100}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                      style={{ height: "100%", borderRadius: 2, background: o.progress >= 1 ? "linear-gradient(90deg,#4ade80,#22c55e)" : "linear-gradient(90deg,#a855f7,#e879f9)" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: o.progress >= 1 ? "#4ade80" : "#a78bbc", fontWeight: 500 }}>{o.status}</span>
                    <button style={{ fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 8, background: o.progress >= 1 ? "rgba(74,222,128,0.15)" : "rgba(168,85,247,0.15)", border: `1px solid ${o.progress >= 1 ? "rgba(74,222,128,0.3)" : "rgba(168,85,247,0.3)"}`, color: o.progress >= 1 ? "#4ade80" : "#c5a3ff", cursor: "pointer" }}>
                      {o.progress >= 1 ? "Claim" : "Start"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Sheet>
        )}

        {/* SEND HOME */}
        {activePanel === "sendHome" && (
          <Sheet key="sendHome" title="Send Money Home" onClose={closePanel}>
            {!sendSuccess ? (
              <>
                <div style={{ fontSize: 11, color: "#7a6e8e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 10 }}>Select Destination</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
                  {COUNTRIES.map(c => (
                    <button key={c.code} onClick={() => setSelectedCountry(c)}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 12, background: selectedCountry.code === c.code ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${selectedCountry.code === c.code ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.06)"}`, cursor: "pointer" }}>
                      <span style={{ fontSize: 18 }}>{c.flag}</span>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#f0e6ff" }}>{c.name}</div>
                        <div style={{ fontSize: 10, color: "#7a6e8e" }}>{c.currency}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "#7a6e8e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>Amount (USD)</div>
                <input value={sendAmount} onChange={e => setSendAmount(e.target.value)} type="number"
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 14, fontSize: 24, fontWeight: 700, fontFamily: "var(--font-mono)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(168,85,247,0.25)", color: "#f0e6ff", outline: "none", marginBottom: 16, boxSizing: "border-box" }} />
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 16, marginBottom: 20 }}>
                  {[
                    ["Transfer fee", `$${fee.toFixed(2)}`],
                    ["Exchange rate", `1 USD = ${selectedCountry.rate} ${selectedCountry.currency}`],
                    ["Total charged", `$${(sendAmountNum + fee).toFixed(2)}`],
                    ["Recipient gets", `${selectedCountry.symbol}${Number(recipientAmount).toLocaleString()}`],
                    ["Delivery", "Within 24 hours"],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: "#7a6e8e", fontWeight: 500 }}>{label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: label === "Recipient gets" ? "#c5a3ff" : "#f0e6ff" }}>{value}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setSendSuccess(true)}
                  style={{ width: "100%", padding: 16, borderRadius: 16, background: "linear-gradient(135deg,#38bdf8,#0ea5e9)", color: "#fff", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer" }}>
                  Send to Recipient {selectedCountry.flag}
                </button>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{selectedCountry.flag}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#f0e6ff", marginBottom: 8 }}>Transfer Created</div>
                <div style={{ fontSize: 14, color: "#a78bbc", lineHeight: 1.6 }}>
                  Your recipient will receive approximately{" "}
                  <span style={{ color: "#c5a3ff", fontWeight: 600 }}>{selectedCountry.symbol}{Number(recipientAmount).toLocaleString()} {selectedCountry.currency}</span>.
                </div>
              </motion.div>
            )}
          </Sheet>
        )}

        {/* HEADS UP */}
        {activePanel === "headsUp" && (
          <Sheet key="headsUp" title="Heads Up" onClose={closePanel}>
            <div style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 14, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#f0e6ff", marginBottom: 8 }}>
                {insight?.headline ? capitalizeFirst(insight.headline) : "Utilization is your fastest fix"}
              </div>
              <div style={{ fontSize: 13, color: "#c2b3d9", lineHeight: 1.6 }}>
                {insight?.body ?? "Your utilization is 62% — above the 30% sweet spot. This is the fastest thing you can fix to improve your score."}
              </div>
            </div>
            <div style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 14, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#4ade80", marginBottom: 4 }}>Nice work 🎉</div>
              <div style={{ fontSize: 13, color: "#c2b3d9", lineHeight: 1.6 }}>You're spending less than usual this week. That's real savings adding up.</div>
            </div>
            <div style={{ fontSize: 11, color: "#7a6e8e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>What would you like to do?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {["Show me how to fix this", "Add to my savings goal", "Ask Zolvi why"].map(action => (
                <button key={action}
                  onClick={() => {
                    if (action === "Ask Zolvi why") {
                      closePanel();
                      setTimeout(() => openPanel("buddy", "why is my utilization at 62% considered bad? what does it actually do to my credit score?"), 100);
                    } else if (action === "Show me how to fix this") {
                      closePanel();
                      setTimeout(() => openPanel("buddy", "walk me through getting my utilization from 62% down to under 30% — what do i pay and when?"), 100);
                    } else {
                      showToast("Savings linked to your Spring Finals challenge");
                      closePanel();
                    }
                  }}
                  style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(168,85,247,0.2)", color: "#d0b8ff", fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left" }}>
                  {action}
                </button>
              ))}
            </div>
            <button onClick={closePanel}
              style={{ width: "100%", padding: 14, borderRadius: 14, background: "linear-gradient(135deg,#a855f7,#e879f9)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>
              Got it
            </button>
          </Sheet>
        )}

        {/* BUDDY */}
        {activePanel === "buddy" && (
          <Sheet key="buddy" title="Zolvi" onClose={closePanel}>
            <BuddyPanel initialMessage={buddyInitialMsg} onClose={closePanel} />
          </Sheet>
        )}

        {/* PROFILE */}
        {activePanel === "profile" && (
          <Sheet key="profile" title="Your Profile" onClose={closePanel}>
            {/* Identity header */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#a855f7,#e879f9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 24px rgba(168,85,247,0.4)", flexShrink: 0 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>R</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#f0e6ff", marginBottom: 2 }}>Rishi</div>
                <div style={{ fontSize: 12, color: "#a78bbc", lineHeight: 1.4 }}>UTD Cybersecurity · Freshman · F-1</div>
              </div>
            </div>

            {/* Credit health card */}
            <div style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.1),rgba(232,121,249,0.04))", border: "1px solid rgba(168,85,247,0.25)", borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <CreditCard size={14} style={{ color: "#c5a3ff" }} />
                <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.18em", color: "#c5a3ff", fontWeight: 600 }}>Credit health</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: "#f0e6ff", fontFamily: "var(--font-mono)", lineHeight: 1 }}>642</div>
                  <div style={{ fontSize: 10, color: "#7a6e8e", marginTop: 4 }}>Credit score</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#fb923c", fontFamily: "var(--font-mono)", lineHeight: 1 }}>62%</div>
                  <div style={{ fontSize: 10, color: "#7a6e8e", marginTop: 4 }}>Utilization</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#a78bbc", marginTop: 10, fontWeight: 500 }}>+0 pts this month (just starting)</div>
            </div>

            {/* Journey card */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Activity size={14} style={{ color: "#c5a3ff" }} />
                <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.18em", color: "#c5a3ff", fontWeight: 600 }}>Journey</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 18, color: "#f0e6ff" }}>Finding My Footing</div>
                <span style={{ fontSize: 11, color: "#c5a3ff", fontWeight: 600 }}>Day 87 / 365</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${(87 / 365) * 100}%` }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg,#a855f7,#e879f9)" }} />
              </div>
            </div>

            {/* XP card */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Trophy size={14} style={{ color: "#c5a3ff" }} />
                <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.18em", color: "#c5a3ff", fontWeight: 600 }}>Level</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 18, color: "#f0e6ff" }}>Level 2 · Explorer</div>
                <span style={{ fontSize: 11, color: "#c5a3ff", fontWeight: 600 }}>340 / 500 XP</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: "68%" }} transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg,#7c3aed,#a855f7,#e879f9)" }} />
              </div>
            </div>

            {/* Cohort card */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Users size={14} style={{ color: "#c5a3ff" }} />
                <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.18em", color: "#c5a3ff", fontWeight: 600 }}>Cohort</span>
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 18, color: "#f0e6ff", marginBottom: 8 }}>UTD Global Freshmen &lsquo;28</div>
              <div style={{ display: "flex", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#f0e6ff", fontFamily: "var(--font-mono)" }}>#18</div>
                  <div style={{ fontSize: 10, color: "#7a6e8e" }}>of 52</div>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#4ade80", fontFamily: "var(--font-mono)" }}>$45</div>
                  <div style={{ fontSize: 10, color: "#7a6e8e" }}>saved</div>
                </div>
              </div>
            </div>

            {/* Action rows */}
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#7a6e8e", fontWeight: 600, marginBottom: 10 }}>Manage</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "View credit journey", onClick: () => showToast("Opening your credit timeline") },
                { label: "Savings history", onClick: () => showToast("$45 saved toward Spring Finals goal") },
                { label: "Manage cohort", onClick: () => { closePanel(); router.push("/cohort"); } },
                { label: "Settings", onClick: () => showToast("Settings coming soon") },
              ].map(row => (
                <button key={row.label} onClick={row.onClick}
                  className="interactive-card"
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(168,85,247,0.18)", color: "#d0b8ff", fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left" }}>
                  <span>{row.label}</span>
                  <ChevronRight size={14} style={{ color: "#7a6e8e" }} />
                </button>
              ))}
            </div>
          </Sheet>
        )}

      </AnimatePresence>
    </div>
  );
}
