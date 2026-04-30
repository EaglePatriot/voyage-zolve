"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, Send } from "lucide-react";

type ContextEntry = {
  label: string;
  greeting: string;
  suggestions: string[];
};

const CONTEXT_DATA: { [key: string]: ContextEntry } = {
  "/": {
    label: "ZETA Home",
    greeting: "Hey Rishi — your utilization is at 62%. I can help you bring that down fast, boost your limit, or send money home.",
    suggestions: [
      "How do I fix my 62% utilization?",
      "Can I increase my $500 limit?",
      "Cheapest way to send money to India?",
    ],
  },
  "/quest": {
    label: "ZETA Quests",
    greeting: "You're 160 XP away from Level 3. I can help you pick the right quest to get there fastest.",
    suggestions: [
      "Which quest helps my score the most?",
      "How do I earn XP faster?",
      "What happens at Level 3?",
    ],
  },
  "/cohort": {
    label: "UTD Cohort",
    greeting: "14 of your UTD peers are already in the Spring Finals savings challenge. I can help you join and build a streak.",
    suggestions: [
      "How do I climb the cohort ranking?",
      "What's the best saving challenge for me?",
      "How does saving with peers actually work?",
    ],
  },
  "/start": {
    label: "Welcome to ZETA",
    greeting: "Hey — I'm Zolvi, your financial co-pilot. I know it's early in your US journey. Ask me anything.",
    suggestions: [
      "What should I do first to build credit?",
      "How do I send money home cheaply?",
      "What is ZETA?",
    ],
  },
};

export function GlobalAIShortcut() {
  const pathname = usePathname() ?? "/";
  const ctx = CONTEXT_DATA[pathname] ?? CONTEXT_DATA["/"];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [typing, setTyping] = useState(false);

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: "user", text }]);
    setInput("");
    setTyping(true);

    const conversationMessages = [...messages, { role: "user" as const, text }].map(m => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.text,
    }));

    try {
      const res = await fetch("https://voyage-zolve.vercel.app/api/buddy/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationMessages }),
      });

      if (!res.ok || !res.body) throw new Error("failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";

      setMessages(prev => [...prev, { role: "ai", text: "" }]);
      setTyping(false);

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
                copy[copy.length - 1] = { role: "ai", text: acc };
                return copy;
              });
            }
          } catch { /* skip */ }
        }
      }
    } catch {
      setMessages(prev => {
        const copy = [...prev];
        if (copy[copy.length - 1]?.role === "ai") {
          copy[copy.length - 1] = { role: "ai", text: "Zolvi hit a snag. Try again in a sec." };
        } else {
          copy.push({ role: "ai", text: "Zolvi hit a snag. Try again in a sec." });
        }
        return copy;
      });
      setTyping(false);
    }
  }

  function handleOpen() {
    setMessages([]);
    setInput("");
    setOpen(true);
  }

  return (
    <>
      {/* 
        ONE clean button. No ring. No halo. No pulse div. No nested circles.
        Just the button + icon + shadow.
      */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.08 }}
        onClick={handleOpen}
        style={{
          position: "absolute",
          right: 18,
          bottom: 86,
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #b84cff, #f06cff)",
          border: "1px solid rgba(255,255,255,0.18)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 12px 34px rgba(200,80,255,0.38)",
          zIndex: 80,
          overflow: "hidden",
        }}
      >
        <Sparkles size={22} color="#fff" />
      </motion.button>

      {/* Panel — overlay is parent, sheet is child → sheet anchors to bottom */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 90,
              background: "rgba(5,0,12,0.55)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
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
                background: "rgba(28,8,45,0.97)",
                border: "1px solid rgba(168,85,247,0.28)",
                borderBottom: "none",
                boxShadow: "0 -16px 60px rgba(168,85,247,0.25)",
                flexShrink: 0,
              }}
            >
              {/* handle */}
              <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px", flexShrink: 0 }}>
                <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(168,85,247,0.4)" }} />
              </div>

              {/* header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px 12px", borderBottom: "1px solid rgba(168,85,247,0.1)", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#a855f7,#e879f9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sparkles size={14} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#f0e6ff" }}>Zolvi AI Coach</div>
                    <div style={{ fontSize: 10, color: "#7a6e8e", fontWeight: 500 }}>{ctx.label}</div>
                  </div>
                </div>
                <button onClick={() => setOpen(false)}
                  style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <X size={14} color="#a78bbc" />
                </button>
              </div>

              {/* body */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", scrollbarWidth: "none", minHeight: 0 }}>
                {/* greeting */}
                <div style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.18)", borderRadius: 14, padding: "12px 14px", marginBottom: 16 }}>
                  <p style={{ fontSize: 14, color: "#e0d0ff", lineHeight: 1.5, fontStyle: "italic", fontFamily: "var(--font-serif)", margin: 0 }}>
                    &ldquo;{ctx.greeting}&rdquo;
                  </p>
                </div>

                {/* suggestions */}
                {messages.length === 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#7a6e8e", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>Try asking</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {ctx.suggestions.map(s => (
                        <button key={s} onClick={() => sendMessage(s)}
                          style={{ textAlign: "left", padding: "11px 14px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(168,85,247,0.2)", color: "#d0b8ff", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(168,85,247,0.1)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}>
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
                      <div key={i}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(168,85,247,0.2)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                        style={{
                          alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                          maxWidth: "85%", padding: "10px 14px",
                          borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                          background: m.role === "user" ? "linear-gradient(135deg,#a855f7,#e879f9)" : "rgba(255,255,255,0.05)",
                          border: m.role === "ai" ? "1px solid rgba(168,85,247,0.15)" : "none",
                          fontSize: 13, fontStyle: m.role === "ai" ? "italic" : "normal",
                          fontFamily: m.role === "ai" ? "var(--font-serif)" : "inherit",
                          color: "#f0e6ff", lineHeight: 1.5,
                          transition: "transform 200ms ease, box-shadow 200ms ease",
                        }}>
                        {m.text}
                      </div>
                    ))}
                    {typing && (
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }}
                        style={{ alignSelf: "flex-start", padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.15)", fontSize: 13, color: "#a78bbc" }}>
                        Zolvi is thinking…
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* input */}
              <div style={{ padding: "10px 16px 20px", borderTop: "1px solid rgba(168,85,247,0.1)", flexShrink: 0 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 14, padding: "8px 8px 8px 14px" }}>
                  <input value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                    placeholder="Ask Zolvi anything…"
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#f0e6ff", fontSize: 13, fontWeight: 500 }} />
                  <button onClick={() => sendMessage(input)}
                    style={{ width: 34, height: 34, borderRadius: "50%", background: input.trim() ? "linear-gradient(135deg,#a855f7,#e879f9)" : "rgba(255,255,255,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}>
                    <Send size={14} color={input.trim() ? "#fff" : "#7a6e8e"} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}