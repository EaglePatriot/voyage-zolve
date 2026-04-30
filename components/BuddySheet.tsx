"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTED_CHIPS = [
  "Should I get a limit increase?",
  "Why is my dining spend up?",
  "How do I send money home cheaply?",
];

const WELCOME: Message = {
  role: "assistant",
  content: "Hey Rishi. What's on your mind today?",
};

export function BuddySheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new content
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function send(text: string) {
    if (!text.trim() || streaming) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages([...newMessages, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/buddy/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok || !res.body) throw new Error("stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (err) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Buddy hit a snag. Try again in a sec.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 left-0 right-0 h-[85%] z-50
                       bg-[var(--color-surface)] border-t border-[var(--color-edge)]
                       rounded-t-3xl flex flex-col overflow-hidden"
          >
            {/* handle */}
            <div className="pt-3 pb-2 flex justify-center">
              <div className="w-10 h-1 rounded-full bg-[var(--color-edge)]" />
            </div>

            {/* header */}
            <div className="px-5 pb-3 flex items-center justify-between border-b border-[var(--color-edge)]">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-teal)] to-[var(--color-teal-deep)]" />
                  <div className="absolute inset-1 rounded-full bg-[var(--color-canvas)] flex items-center justify-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-[var(--color-teal)] animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="font-serif italic text-lg leading-tight text-stone-100">
                    Zolvi
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-teal)] animate-pulse" />
                    <span className="text-[10px] uppercase tracking-[0.14em] text-stone-500">
                      online
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center
                           text-stone-400 hover:text-stone-100 hover:bg-[var(--color-surface-2)]"
              >
                <X size={18} />
              </button>
            </div>

            {/* messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-5 py-4 space-y-3"
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(168,85,247,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  style={{ transition: "transform 200ms ease, box-shadow 200ms ease" }}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[80%] bg-[var(--color-teal-deep)] text-stone-100 rounded-2xl rounded-tr-sm px-4 py-2 text-sm"
                      : "mr-auto max-w-[85%] bg-[var(--color-surface-2)] text-stone-100 rounded-2xl rounded-tl-sm px-4 py-3 font-serif italic text-[15px] leading-snug"
                  }
                >
                  {m.content}
                  {streaming && i === messages.length - 1 && m.role === "assistant" && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-teal)] ml-1 align-middle animate-pulse" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* suggested chips */}
            {messages.length < 2 && (
              <div className="px-5 pb-2 flex gap-2 overflow-x-auto">
                {SUGGESTED_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => send(chip)}
                    className="shrink-0 px-3 py-1.5 rounded-full border border-[var(--color-edge)]
                               text-stone-300 text-xs hover:bg-[var(--color-surface-2)]
                               hover:border-[var(--color-teal)]/40 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* input */}
            <div className="border-t border-[var(--color-edge)] p-3 flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask Zolvi anything…"
                rows={1}
                className="flex-1 resize-none bg-[var(--color-surface-2)] border border-[var(--color-edge)]
                           rounded-2xl px-4 py-2.5 text-sm text-stone-100 placeholder:text-stone-500
                           focus:outline-none focus:border-[var(--color-teal)]/50 max-h-24"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || streaming}
                className="shrink-0 w-10 h-10 rounded-full bg-[var(--color-teal)]
                           text-[var(--color-canvas)] flex items-center justify-center
                           disabled:opacity-40 disabled:cursor-not-allowed
                           hover:bg-[var(--color-cream)] active:scale-95 transition-all"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}