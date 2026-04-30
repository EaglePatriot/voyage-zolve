"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, Send } from "lucide-react";
import { BottomSheet } from "./BottomSheet";

type PageContext = "voyage" | "quest" | "cohort";

const CONTEXT_DATA = {
  voyage: {
    greeting: "I can help you manage payments, boost your limit, or send money home.",
    suggestions: [
      "How can I pay my balance?",
      "How do I boost my limit?",
      "What is the best way to send money home today?",
    ],
  },
  quest: {
    greeting: "I can help you choose the best quest to improve your financial health.",
    suggestions: [
      "Which quest should I start?",
      "How do I earn more XP?",
      "How does this help my credit?",
    ],
  },
  cohort: {
    greeting: "I can help you join challenges, save money, and climb your cohort ranking.",
    suggestions: [
      "Which challenge should I join?",
      "How much can I save this week?",
      "How do I improve my cohort rank?",
    ],
  },
};

const MOCK_RESPONSES: Record<string, string> = {
  "How can I pay my balance?": "Tap the Pay button on Voyage. You can pay via Apple Pay, Debit Card, Bank Transfer, or UPI. Your current balance is $428.72 with a minimum due of $52.00 by May 12.",
  "How do I boost my limit?": "Complete the boost opportunities on Voyage — like buying groceries with Zolve or paying your statement early. Each action unlocks a limit increase up to $375 total.",
  "What is the best way to send money home today?": "India has strong rates right now — 1 USD = 83.12 INR. Use the Send Home button to transfer. Fees are $2.99 flat and delivery is within 24 hours.",
  "Which quest should I start?": "Start with 'Keep utilization under 30% this week' — you're already at 65% progress and it gives +30 XP. Quick win.",
  "How do I earn more XP?": "Complete active quests and pay statements on time. Your next milestone is 1000 XP to reach Level 4 — you're 270 XP away.",
  "How does this help my credit?": "On-time payments (35%) and low utilization (30%) are the two biggest FICO factors. Every quest here targets one of them directly.",
  "Which challenge should I join?": "The 'Save $500 by Spring Break' challenge has 12 members and is 64% to goal. Join now and every dollar you save stays yours.",
  "How much can I save this week?": "Based on your dining trend being 22% below average, you're already saving ~$18 this week. A no-spend weekend could add another $30.",
  "How do I improve my cohort rank?": "You're top 28% on credit utilization. Improve your savings rate — you're currently bottom 35% there. Even $50/month saved moves you up significantly.",
};

export function AIShortcut({ context }: { context: PageContext }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [typing, setTyping] = useState(false);
  const ctx = CONTEXT_DATA[context];

  function handleSuggestion(s: string) {
    sendMessage(s);
  }

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg = { role: "user" as const, text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = MOCK_RESPONSES[text] ?? "Great question. Based on your profile, I'd focus on keeping utilization low and paying on time — those two factors drive 65% of your FICO score.";
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
      setTyping(false);
    }, 900);
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08 }}
        onClick={() => setOpen(true)}
        style={{
          position: "absolute",
          bottom: "88px",
          right: "16px",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #a855f7, #e879f9)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 30,
          boxShadow: "0 0 24px rgba(168,85,247,0.6), 0 0 48px rgba(168,85,247,0.3)",
        }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={22} color="#fff" />
        </motion.div>
        {/* pulse ring */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            border: "2px solid rgba(168,85,247,0.5)",
            pointerEvents: "none",
          }}
        />
      </motion.button>

      {/* AI Panel */}
      <BottomSheet open={open} onClose={() => setOpen(false)} title="Zolvi AI Coach">
        {/* greeting */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.12), rgba(232,121,249,0.06))",
            border: "1px solid rgba(168,85,247,0.2)",
            borderRadius: 16,
            padding: "14px 16px",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div
              style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "linear-gradient(135deg, #a855f7, #e879f9)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Sparkles size={12} color="#fff" />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#c5a3ff", textTransform: "uppercase", letterSpacing: "0.2em" }}>Zolvi</span>
          </div>
          <p style={{ fontSize: 14, color: "#e0d0ff", lineHeight: 1.5, fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
            &ldquo;{ctx.greeting}&rdquo;
          </p>
        </div>

        {/* suggested actions */}
        {messages.length === 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#7a6e8e", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>
              Suggested
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ctx.suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  style={{
                    textAlign: "left",
                    padding: "11px 14px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(168,85,247,0.2)",
                    color: "#d0b8ff",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(168,85,247,0.1)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* messages */}
        {messages.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "10px 14px",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.role === "user"
                    ? "linear-gradient(135deg, #a855f7, #e879f9)"
                    : "rgba(255,255,255,0.05)",
                  border: m.role === "ai" ? "1px solid rgba(168,85,247,0.15)" : "none",
                  fontSize: 13,
                  fontStyle: m.role === "ai" ? "italic" : "normal",
                  fontFamily: m.role === "ai" ? "var(--font-serif)" : "inherit",
                  color: "#f0e6ff",
                  lineHeight: 1.5,
                }}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div style={{
                alignSelf: "flex-start",
                padding: "10px 14px",
                borderRadius: "16px 16px 16px 4px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(168,85,247,0.15)",
              }}>
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ fontSize: 13, color: "#a78bbc" }}
                >
                  Zolvi is thinking…
                </motion.div>
              </div>
            )}
          </div>
        )}

        {/* input */}
        <div style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(168,85,247,0.2)",
          borderRadius: 16,
          padding: "8px 8px 8px 14px",
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask Zolvi anything…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#f0e6ff",
              fontSize: 13,
              fontWeight: 500,
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            style={{
              width: 34, height: 34, borderRadius: "50%",
              background: input.trim() ? "linear-gradient(135deg, #a855f7, #e879f9)" : "rgba(255,255,255,0.06)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            <Send size={14} color={input.trim() ? "#fff" : "#7a6e8e"} />
          </button>
        </div>
      </BottomSheet>
    </>
  );
}