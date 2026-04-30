"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, CheckCircle, Zap, Lock } from "lucide-react";
import { BottomSheet } from "@/components/BottomSheet";
import { AIShortcut } from "@/components/AIShortcut";

const ease = [0.22, 1, 0.36, 1] as const;
function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease, delay },
  };
}

const WHY_MAP: { [key: string]: string } = {
  payment: "Payment history is 35% of your FICO score — the single biggest factor. One on-time payment moves the needle immediately.",
  utilization: "At 62% you're in the danger zone. Getting under 30% is the fastest single thing you can do to improve your score.",
  education: "Most international freshmen lose points on things they didn't know mattered. This takes 10 minutes and saves months.",
};

const ACTIVE_QUESTS = [
  { id: "q1", title: "Pay your May statement by May 12", xp: 60, progress: 0, deadline: "Due May 12", category: "payment", why: "Payment history is 35% of your FICO score — the single biggest factor. One on-time payment moves the needle immediately." },
  { id: "q2", title: "Bring utilization under 30% this week", xp: 80, progress: 0.2, deadline: "Due May 7", category: "utilization", why: "At 62% utilization you're losing significant points. Getting under 30% could add 40-60 points to your score within 30 days." },
  { id: "q3", title: "Learn: How credit scores actually work", xp: 25, progress: 0, deadline: "Due May 10", category: "education", why: "Most freshmen lose points on things they don't know matter. 10 minutes here saves months of recovery." },
];

const COMPLETED = [
  { id: "q4", title: "Set up your first US credit card", xp: 50, completedOn: "2026-02-14" },
  { id: "q5", title: "Make your first on-time payment", xp: 75, completedOn: "2026-03-01" },
];

const BADGES = [
  { name: "First Statement", emoji: "📄", earned: true },
  { name: "UTD Anchor", emoji: "🎓", earned: true },
  { name: "On-Time Starter", emoji: "⏱️", earned: true },
  { name: "Limit Climber", emoji: "📈", earned: false },
  { name: "Streak King", emoji: "🔥", earned: false },
  { name: "Homesender", emoji: "🏠", earned: false },
  { name: "30% Club", emoji: "💎", earned: false },
  { name: "Credit Ready", emoji: "🚀", earned: false },
];

export default function QuestPage() {
  const [started, setStarted] = useState<string[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<typeof ACTIVE_QUESTS[0] | null>(null);
  const [questSuccess, setQuestSuccess] = useState(false);

  function openQuest(q: typeof ACTIVE_QUESTS[0]) {
    setQuestSuccess(false);
    setSelectedQuest(q);
  }

  function startQuest() {
    if (!selectedQuest) return;
    setStarted(prev => [...prev, selectedQuest.id]);
    setQuestSuccess(true);
  }

  const totalXP = 340;
  const nextLevel = 500;
  const progress = 0.68;

  return (
    <main className="flex flex-col flex-1 overflow-y-auto pb-28" style={{ scrollbarWidth: "none" }}>
      <style>{`main::-webkit-scrollbar { display: none; }`}</style>

      {/* Header */}
      <motion.header {...fade(0)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "32px 24px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a855f7", boxShadow: "0 0 10px #a855f7" }} />
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.28em", color: "#c2b3d9", fontWeight: 600 }}>ZETA Quests</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)" }}>
          <Zap size={12} color="#c5a3ff" />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#c5a3ff" }}>{totalXP} XP</span>
        </div>
      </motion.header>

      <div style={{ margin: "0 24px", height: 1, background: "linear-gradient(90deg,transparent,rgba(168,85,247,0.18),transparent)" }} />

      <div style={{ padding: "24px 24px 0" }}>
        {/* Level */}
        <motion.div {...fade(0.08)}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#7a6e8e", fontWeight: 600, marginBottom: 4 }}>Level 2 of 5</div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 44, lineHeight: 0.95, color: "#f0e6ff", marginBottom: 16 }}>Explorer</h1>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#7a6e8e", marginBottom: 6, fontWeight: 500 }}>
            <span>{totalXP} XP</span>
            <span>Next: Builder — {nextLevel - totalXP} XP to go</span>
          </div>
          <div className="breathing-card" style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: 24 }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress * 100}%` }} transition={{ duration: 1, ease }}
              style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#7c3aed,#a855f7,#e879f9)", position: "relative" }}>
              <div style={{ position: "absolute", right: 0, top: "50%", transform: "translate(50%,-50%)", width: 12, height: 12, borderRadius: "50%", background: "#e879f9", boxShadow: "0 0 8px #e879f9" }} />
            </motion.div>
          </div>
        </motion.div>

        {/* Active quests */}
        <motion.div {...fade(0.16)}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#7a6e8e", fontWeight: 600, marginBottom: 12 }}>Active Quests</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {ACTIVE_QUESTS.map((q, i) => (
              <motion.div key={q.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
                <div className="interactive-card lively-card" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${started.includes(q.id) ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{ fontSize: 10, color: "#7a6e8e", fontWeight: 500 }}>{q.deadline}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#c5a3ff", background: "rgba(168,85,247,0.12)", padding: "2px 8px", borderRadius: 999 }}>+{q.xp} XP</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#f0e6ff", marginBottom: 10 }}>{q.title}</div>
                  {(q.progress ?? 0) > 0 && (
                    <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: 10 }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(q.progress ?? 0) * 100}%` }} transition={{ duration: 0.8 }}
                        style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg,#a855f7,#e879f9)" }} />
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => openQuest(q)}
                      className="premium-button"
                      style={{
                        fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 8,
                        background: started.includes(q.id) ? "rgba(74,222,128,0.15)" : "rgba(168,85,247,0.15)",
                        border: `1px solid ${started.includes(q.id) ? "rgba(74,222,128,0.3)" : "rgba(168,85,247,0.3)"}`,
                        color: started.includes(q.id) ? "#4ade80" : "#c5a3ff", cursor: "pointer",
                      }}>
                      {started.includes(q.id) ? "✓ Started" : "→ Start"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Completed */}
        <motion.div {...fade(0.3)}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#7a6e8e", fontWeight: 600, marginBottom: 12 }}>Completed</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {COMPLETED.map(q => (
              <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14 }}>
                <CheckCircle size={16} color="#4ade80" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#c2b3d9" }}>{q.title}</div>
                  <div style={{ fontSize: 10, color: "#5b4d6e", marginTop: 2 }}>Completed {q.completedOn}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#4ade80" }}>+{q.xp} XP</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div {...fade(0.4)}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#7a6e8e", fontWeight: 600, marginBottom: 12 }}>Badges</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
            {BADGES.map((b, i) => (
              <div key={i} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "16px 8px",
                background: b.earned ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${b.earned ? "rgba(168,85,247,0.25)" : "rgba(255,255,255,0.05)"}`,
                borderRadius: 14, opacity: b.earned ? 1 : 0.5,
              }}>
                {b.earned ? (
                  <span style={{ fontSize: 28 }}>{b.emoji}</span>
                ) : (
                  <Lock size={24} color="#5b4d6e" />
                )}
                <span style={{ fontSize: 10, fontWeight: 600, color: b.earned ? "#c5a3ff" : "#5b4d6e", textAlign: "center", letterSpacing: "0.05em" }}>{b.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quest detail sheet */}
      <BottomSheet open={!!selectedQuest} onClose={() => setSelectedQuest(null)} title="Quest Details">
        {selectedQuest && !questSuccess && (
          <>
            <div style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 16, padding: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: "#7a6e8e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em" }}>{selectedQuest.deadline}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#c5a3ff" }}>+{selectedQuest.xp} XP</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#f0e6ff", marginBottom: 10 }}>{selectedQuest.title}</div>
              {selectedQuest.progress > 0 && (
                <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ width: `${selectedQuest.progress * 100}%`, height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#a855f7,#e879f9)" }} />
                </div>
              )}
            </div>
            <div style={{ fontSize: 11, color: "#7a6e8e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>Why This Matters</div>
            <p style={{ fontSize: 14, color: "#c2b3d9", lineHeight: 1.6, marginBottom: 24 }}>{selectedQuest.why ?? WHY_MAP[selectedQuest.category]}</p>
            <button onClick={startQuest}
              style={{ width: "100%", padding: 16, borderRadius: 16, background: "linear-gradient(135deg,#a855f7,#e879f9)", color: "#fff", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer" }}>
              {started.includes(selectedQuest.id) ? "Mark First Step Done" : "Start Quest"}
            </button>
          </>
        )}
        {questSuccess && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎯</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#f0e6ff", marginBottom: 8 }}>You&rsquo;re on it.</div>
            <div style={{ fontSize: 14, color: "#a78bbc", lineHeight: 1.6, marginBottom: 20 }}>Completing this moves your score closer to 700. <span style={{ color: "#c5a3ff", fontWeight: 600 }}>+{selectedQuest?.xp} XP</span> when done.</div>
            <Trophy size={32} color="#a855f7" style={{ margin: "0 auto" }} />
          </motion.div>
        )}
      </BottomSheet>

      <AIShortcut context="quest" />
    </main>
  );
}