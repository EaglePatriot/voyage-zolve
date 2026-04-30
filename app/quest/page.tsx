"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { quests } from "@/lib/world";
import { Trophy, Lock, CheckCircle, Zap } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;
function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease, delay },
  };
}

export default function QuestPage() {
  const [celebrated, setCelebrated] = useState<string | null>(null);
  const xpPercent = Math.round((quests.totalXP / quests.nextLevelAt) * 100);

  function handleStart(id: string) {
    setCelebrated(id);
    setTimeout(() => setCelebrated(null), 2000);
    if (typeof window !== "undefined") {
      import("canvas-confetti").then(m => {
        m.default({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.7 },
          colors: ["#a855f7", "#e879f9", "#38bdf8", "#f0e6ff"],
        });
      });
    }
  }

  return (
    <main className="flex flex-col flex-1 overflow-y-auto pb-28">
      <style>{`
        @keyframes xp-fill { from{width:0%} to{width:${xpPercent}%} }
        .xp-bar { animation: xp-fill 1.2s cubic-bezier(0.22,1,0.36,1) 0.5s both; }
      `}</style>

      {/* Header */}
      <motion.header {...fade(0)} className="flex items-center justify-between px-6 pt-7 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full"
            style={{ background: "#a855f7", boxShadow: "0 0 8px #a855f7" }} />
          <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.24em", color: "#a78bbc", fontWeight: 500 }}>
            Quest
          </span>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 rounded-full"
          style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
          <Zap size={11} style={{ color: "#a855f7" }} />
          <span style={{ fontSize: "11px", color: "#a855f7", fontWeight: 600 }}>{quests.totalXP} XP</span>
        </div>
      </motion.header>

      {/* Level banner */}
      <motion.section {...fade(0.08)} className="px-6 pt-8 pb-6">
        <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em", color: "#5b4d6e", marginBottom: "8px" }}>
          Level {quests.level} of 5
        </div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "52px", lineHeight: 0.95, color: "#f0e6ff", textShadow: "0 0 40px rgba(168,85,247,0.3)", marginBottom: "8px" }}>
          {quests.levelName}
        </h1>
        <div style={{ height: "1px", width: "60%", background: "linear-gradient(90deg,#a855f7,#e879f9,transparent)", marginBottom: "20px" }} />

        {/* XP Bar */}
        <div>
          <div className="flex justify-between mb-2" style={{ fontSize: "10px", color: "#5b4d6e" }}>
            <span>{quests.totalXP} XP</span>
            <span>Next: {quests.nextLevelName} — {quests.nextLevelAt - quests.totalXP} XP to go</span>
          </div>
          <div className="relative h-2 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="xp-bar h-full rounded-full"
              style={{ background: "linear-gradient(90deg,#7c3aed,#a855f7,#e879f9)", boxShadow: "0 0 12px rgba(168,85,247,0.6)" }} />
            {/* Glow dot at leading edge */}
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
              style={{ left: `calc(${xpPercent}% - 6px)`, background: "#e879f9", boxShadow: "0 0 10px #e879f9, 0 0 20px rgba(232,121,249,0.5)" }} />
          </div>
        </div>
      </motion.section>

      <div className="px-6 space-y-5">

        {/* Active quests */}
        <motion.div {...fade(0.18)}>
          <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#5b4d6e", marginBottom: "12px" }}>
            Active quests
          </div>
          <div className="space-y-3">
            {quests.active.map((q, i) => (
              <motion.div key={q.id} {...fade(0.2 + i * 0.08)}
                className="relative rounded-2xl p-4 float-c"
                style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))", border: "1px solid rgba(255,255,255,0.07)", animationDelay: `${i * -1.5}s` }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "16px", background: "linear-gradient(135deg,rgba(255,255,255,0.04),transparent 50%)", pointerEvents: "none" }} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-3">
                      <div style={{ fontSize: "11px", color: "#5b4d6e", marginBottom: "4px" }}>Due {q.deadline}</div>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "#f0e6ff", lineHeight: 1.3 }}>{q.title}</div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full shrink-0"
                      style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
                      <Zap size={10} style={{ color: "#a855f7" }} />
                      <span style={{ fontSize: "10px", color: "#a855f7", fontWeight: 600 }}>+{q.xp}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {(q.progress ?? 0) > 0 && (
                    <div className="mb-3">
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${(q.progress ?? 0) * 100}%`, background: "linear-gradient(90deg,#a855f7,#e879f9)", boxShadow: "0 0 8px rgba(168,85,247,0.4)" }} />
                      </div>
                      <div style={{ fontSize: "10px", color: "#5b4d6e", marginTop: "4px" }}>{Math.round((q.progress ?? 0) * 100)}% complete</div>
                    </div>
                  )}

                  <button
                    onClick={() => handleStart(q.id)}
                    className="transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{
                      padding: "6px 16px", borderRadius: "999px", fontSize: "12px", fontWeight: 500,
                      background: celebrated === q.id ? "linear-gradient(135deg,#a855f7,#e879f9)" : "rgba(168,85,247,0.1)",
                      border: "1px solid rgba(168,85,247,0.25)",
                      color: celebrated === q.id ? "#fff" : "#a855f7",
                      boxShadow: celebrated === q.id ? "0 0 20px rgba(168,85,247,0.4)" : "none",
                      transition: "all 0.3s ease",
                    }}>
                    {celebrated === q.id ? "✓ Quest accepted!" : "→ Start"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Completed quests */}
        <motion.div {...fade(0.44)}>
          <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#5b4d6e", marginBottom: "12px" }}>
            Completed
          </div>
          <div className="space-y-2">
            {quests.completed.map((q, i) => (
              <motion.div key={q.id} {...fade(0.46 + i * 0.06)}
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <CheckCircle size={16} style={{ color: "#a855f7", filter: "drop-shadow(0 0 4px rgba(168,85,247,0.5))", flexShrink: 0 }} />
                <div className="flex-1">
                  <div style={{ fontSize: "13px", color: "#a78bbc", textDecoration: "line-through", textDecorationColor: "rgba(168,85,247,0.3)" }}>{q.title}</div>
                  <div style={{ fontSize: "10px", color: "#5b4d6e" }}>Completed {q.completedOn}</div>
                </div>
                <div style={{ fontSize: "11px", color: "#a855f7", fontWeight: 600 }}>+{q.xp} XP</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Badge gallery */}
        <motion.div {...fade(0.56)}>
          <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#5b4d6e", marginBottom: "12px" }}>
            Badges
          </div>
          <div className="grid grid-cols-3 gap-3">
            {quests.badges.map((badge, i) => (
              <motion.div key={badge.id} {...fade(0.58 + i * 0.05)}
                className="flex flex-col items-center gap-2 rounded-2xl p-4"
                style={{
                  background: badge.earned ? "linear-gradient(135deg,rgba(168,85,247,0.1),rgba(232,121,249,0.05))" : "rgba(255,255,255,0.02)",
                  border: badge.earned ? "1px solid rgba(168,85,247,0.2)" : "1px solid rgba(255,255,255,0.04)",
                  boxShadow: badge.earned ? "0 0 20px rgba(168,85,247,0.1)" : "none",
                  opacity: badge.earned ? 1 : 0.4,
                }}>
                {badge.earned ? (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.2),rgba(232,121,249,0.1))", border: "1px solid rgba(168,85,247,0.3)", boxShadow: "0 0 16px rgba(168,85,247,0.2)" }}>
                    {badge.emoji}
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <Lock size={16} style={{ color: "#5b4d6e" }} />
                  </div>
                )}
                <div style={{ fontSize: "10px", textAlign: "center", color: badge.earned ? "#a78bbc" : "#5b4d6e", letterSpacing: "0.05em", lineHeight: 1.3 }}>
                  {badge.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </main>
  );
}
