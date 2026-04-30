"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Check, Flame } from "lucide-react";
import { cohort } from "@/lib/world";
import { Card } from "@/components/primitives";
import { BottomSheet } from "@/components/BottomSheet";

type LiveActivity = { user: string; action: string; time: string; emoji: string };

const LIVE_ACTIVITIES: LiveActivity[] = [
  { user: "Maya", action: "saved $5 skipping her morning coffee", time: "just now", emoji: "☕" },
  { user: "Alex", action: "joined the 7-day savings streak", time: "1 min ago", emoji: "🔥" },
  { user: "Rina", action: "moved up 2 spots in the cohort", time: "3 min ago", emoji: "⬆️" },
  { user: "Carlos", action: "completed today's no-spend challenge", time: "5 min ago", emoji: "✅" },
  { user: "Priya", action: "added $8.25 to savings", time: "7 min ago", emoji: "💰" },
  { user: "James", action: "paid his statement 3 days early", time: "12 min ago", emoji: "📅" },
  { user: "Aisha", action: "hit 30% utilization for the first time", time: "18 min ago", emoji: "🎯" },
];

const LEADERBOARD = [
  { rank: 1, initial: "P", saved: "$67.50", streak: 8, isUser: false },
  { rank: 2, initial: "M", saved: "$54.00", streak: 6, isUser: false },
  { rank: 3, initial: "A", saved: "$48.75", streak: 5, isUser: false },
  { rank: 4, initial: "R", saved: "$45.00", streak: 4, isUser: true },
  { rank: 5, initial: "C", saved: "$38.25", streak: 3, isUser: false },
];

const ease = [0.22, 1, 0.36, 1] as const;
function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease, delay },
  };
}

const METRICS = [
  { label: "Credit utilization (lower is better)", percentile: 40, position: "bottom 40%" },
  { label: "On-time payment rate", percentile: 82, position: "top 18%" },
  { label: "Monthly savings rate", percentile: 35, position: "bottom 35%" },
  { label: "Current credit score", percentile: 48, position: "top 52%" },
];

const MINI_CHALLENGES = [
  "Skip eating out once this week — save $12",
  "Make coffee at home for 3 days — save $9",
  "Buy used textbooks instead of new — save $40",
  "Cook one meal instead of ordering — save $15",
  "Cancel one unused subscription this month",
];

export default function CohortPage() {
  const [joined, setJoined] = useState(false);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [saved, setSaved] = useState(45);
  const [streak, setStreak] = useState(3);
  const [rank, setRank] = useState(2);
  const [logSuccess, setLogSuccess] = useState(false);
  const [visibleActivities, setVisibleActivities] = useState<LiveActivity[]>(LIVE_ACTIVITIES.slice(0, 4));
  const [activeNow] = useState(12);
  const goal = 200;

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleActivities(prev => {
        const all = LIVE_ACTIVITIES;
        const currentFirst = all.indexOf(prev[0]);
        const nextStart = (currentFirst + 1) % all.length;
        return [
          all[nextStart % all.length],
          all[(nextStart + 1) % all.length],
          all[(nextStart + 2) % all.length],
          all[(nextStart + 3) % all.length],
        ];
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  function logWin() {
    setSaved(prev => Math.min(prev + 8.5, goal));
    setStreak(prev => prev + 1);
    setRank(prev => Math.max(1, prev - 1));
    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 2000);
  }

  return (
    <main className="flex flex-col flex-1 overflow-y-auto pb-28" style={{ scrollbarWidth: "none" }}>
      <style>{`main::-webkit-scrollbar { display: none; }`}</style>

      {/* Header */}
      <motion.header {...fade(0)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "32px 24px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a855f7", boxShadow: "0 0 10px #a855f7" }} />
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.28em", color: "#c2b3d9", fontWeight: 600 }}>Your Cohort</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)" }}>
          <Users size={12} color="#c5a3ff" />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#c5a3ff" }}>52 members</span>
        </div>
      </motion.header>

      <div style={{ margin: "0 24px", height: 1, background: "linear-gradient(90deg,transparent,rgba(168,85,247,0.18),transparent)" }} />

      <div style={{ padding: "24px 24px 0" }}>
        {/* Title */}
        <motion.div {...fade(0.08)} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#7a6e8e", fontWeight: 600, marginBottom: 6 }}>Your Cohort</div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 40, lineHeight: 1, color: "#f0e6ff", marginBottom: 6 }}>UTD Global Freshmen &lsquo;28</h1>
          <p style={{ fontSize: 12, color: "#7a6e8e", fontWeight: 500 }}>Class of &lsquo;28 · 52 members · 55% India · 20% China · 15% Latin America · 10% other</p>
        </motion.div>

        {/* Percentiles */}
        <motion.div {...fade(0.16)} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "#7a6e8e", fontWeight: 600, marginBottom: 12 }}>Where You Stand</div>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "16px 16px 8px" }}>
            {METRICS.map((m, i) => (
              <div key={m.label} style={{ marginBottom: i < METRICS.length - 1 ? 18 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#f0e6ff", fontWeight: 500 }}>{m.label}</span>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "#c5a3ff", fontWeight: 600 }}>{m.position}</span>
                </div>
                <div style={{ position: "relative", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3 }}>
                  {[25, 50, 75].map(p => (
                    <div key={p} style={{ position: "absolute", top: 0, bottom: 0, width: 1, left: `${p}%`, background: "rgba(255,255,255,0.08)" }} />
                  ))}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                    style={{
                      position: "absolute", top: "50%", width: 12, height: 12, borderRadius: "50%",
                      background: "radial-gradient(circle,#e879f9,#a855f7)",
                      transform: `translate(-50%, -50%)`,
                      left: `${m.percentile}%`,
                      boxShadow: "0 0 12px rgba(168,85,247,0.7)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 12, background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.22)" }}>
            <span style={{ fontSize: 12, color: "#fcd9b6", fontWeight: 500, lineHeight: 1.5 }}>You&rsquo;re in the bottom 40% on utilization. That&rsquo;s the #1 thing to fix.</span>
          </div>
        </motion.div>

        {/* Live Activity */}
        <motion.div {...fade(0.2)} style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "#7a6e8e", fontWeight: 600 }}>Live Activity</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 999, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)" }}>
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: "#4ade80" }}>{activeNow} active now</span>
            </div>
          </div>

          {/* Weekly group savings */}
          <div style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)", borderRadius: 14, padding: "12px 16px", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#c2b3d9", fontWeight: 500 }}>Together, your cohort saved this week</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#f0e6ff", fontFamily: "var(--font-mono)" }}>$184.50</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: "37%" }} transition={{ delay: 0.8, duration: 1, ease }}
                style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg,#a855f7,#e879f9)" }} />
            </div>
            <div style={{ fontSize: 10, color: "#7a6e8e", marginTop: 6 }}>$184.50 of $500 weekly group goal</div>
          </div>

          {/* Activity feed */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <AnimatePresence mode="popLayout">
              {visibleActivities.map((activity, i) => (
                <motion.div key={activity.user + activity.action}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{activity.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#f0e6ff" }}>{activity.user} </span>
                    <span style={{ fontSize: 12, color: "#a78bbc" }}>{activity.action}</span>
                  </div>
                  <span style={{ fontSize: 10, color: "#5b4d6e", flexShrink: 0 }}>{activity.time}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div {...fade(0.28)} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "#7a6e8e", fontWeight: 600, marginBottom: 12 }}>This Week&rsquo;s Leaderboard</div>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            {LEADERBOARD.map((entry, i) => (
              <div key={entry.rank} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                borderBottom: i < LEADERBOARD.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                background: entry.isUser ? "rgba(168,85,247,0.08)" : "transparent",
              }}>
                <div style={{ width: 24, textAlign: "center", fontSize: 12, fontWeight: 700, color: entry.rank <= 3 ? "#e879f9" : "#7a6e8e" }}>
                  {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}
                </div>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: entry.isUser ? "linear-gradient(135deg,#a855f7,#e879f9)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#f0e6ff" }}>
                  {entry.initial}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: entry.isUser ? 700 : 500, color: entry.isUser ? "#f0e6ff" : "#c2b3d9" }}>
                    {entry.isUser ? "You" : "Member"}
                    {entry.isUser && <span style={{ fontSize: 10, color: "#c5a3ff", marginLeft: 6 }}>← you</span>}
                  </div>
                  <div style={{ fontSize: 10, color: "#7a6e8e" }}>🔥 {entry.streak} day streak</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f0e6ff", fontFamily: "var(--font-mono)" }}>{entry.saved}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Challenge */}
        <motion.div {...fade(0.24)} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "#7a6e8e", fontWeight: 600, marginBottom: 12 }}>Active Challenge</div>
          <div className="interactive-card breathing-glow" style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.1),rgba(232,121,249,0.05))", border: "1px solid rgba(168,85,247,0.25)", borderRadius: 16, padding: 16 }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 22, color: "#f0e6ff", marginBottom: 6 }}>Save $200 before Spring Finals</h2>
            <p style={{ fontSize: 11, color: "#7a6e8e", marginBottom: 4, fontWeight: 500 }}>14 of 52 joined · Pool $1,840 / $4,000</p>
            <p style={{ fontSize: 11, color: "#7a6e8e", marginBottom: 14, fontWeight: 500 }}>Deadline: May 15, 2026</p>

            {/* Progress bar */}
            <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: 14 }}>
              <motion.div initial={{ width: 0 }} animate={{ width: "46%" }} transition={{ delay: 0.5, duration: 1, ease }}
                style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#7c3aed,#a855f7,#e879f9)", boxShadow: "0 0 8px rgba(168,85,247,0.5)" }} />
            </div>

            {/* Avatars */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 16 }}>
              {["AS", "RM", "PK", "JL", "CW", "DV"].map((init, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#c5a3ff", marginLeft: i > 0 ? -6 : 0 }}>{init}</div>
              ))}
              <span style={{ fontSize: 11, color: "#7a6e8e", marginLeft: 8 }}>+6 more</span>
            </div>

            {/* Encouragement */}
            <div style={{ fontSize: 12, color: "#a78bbc", lineHeight: 1.6, marginBottom: 16, fontStyle: "italic" }}>
              &ldquo;Every dollar you save is yours to keep. Small wins compound — just like interest.&rdquo;
            </div>

            {!joined ? (
              <button onClick={() => { setJoined(true); setChallengeOpen(true); }}
                className="transition-transform duration-200 active:scale-[0.98]"
                style={{ width: "100%", padding: 14, borderRadius: 14, background: "linear-gradient(135deg,#a855f7,#e879f9)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 0 20px rgba(168,85,247,0.4)" }}>
                Join the Challenge
              </button>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 12, marginBottom: 12 }}>
                  <Check size={16} color="#4ade80" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#4ade80" }}>Challenge Joined!</span>
                </div>
                {/* Progress card */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 14, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#7a6e8e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Saved</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "#f0e6ff", fontFamily: "var(--font-mono)" }}>${saved.toFixed(2)}</div>
                      <div style={{ fontSize: 10, color: "#7a6e8e" }}>of ${goal} goal</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", marginBottom: 4 }}>
                        <Flame size={12} color="#fb923c" />
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#fb923c" }}>{streak} day streak</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#4ade80", fontWeight: 600 }}>↑ +{rank} spots this week</div>
                    </div>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                    <motion.div animate={{ width: `${(saved / goal) * 100}%` }} transition={{ duration: 0.5 }}
                      style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#a855f7,#e879f9)" }} />
                  </div>
                </div>
                <AnimatePresence>
                  {logSuccess && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ textAlign: "center", fontSize: 13, fontWeight: 600, color: "#4ade80", marginBottom: 8 }}>
                      🎉 You just moved up {rank} spots!
                    </motion.div>
                  )}
                </AnimatePresence>
                <button onClick={logWin}
                  className="transition-transform duration-200 active:scale-[0.98]"
                  style={{ width: "100%", padding: 14, borderRadius: 14, background: "linear-gradient(135deg,#a855f7,#e879f9)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>
                  Log a Win Today
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Activity */}
        <motion.div {...fade(0.32)} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "#7a6e8e", fontWeight: 600, marginBottom: 12 }}>Cohort Activity</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "A member from India just paid their statement on time · 1h ago",
              "Spring Finals challenge crossed 45% funded · 3h ago",
              "New member from China joined the challenge · 6h ago",
            ].map((a, i) => (
              <div key={i} style={{ fontSize: 12, color: "#7a6e8e", padding: "10px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none", fontWeight: 500 }}>{a}</div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Challenge detail sheet */}
      <BottomSheet open={challengeOpen} onClose={() => setChallengeOpen(false)} title="Challenge Activities">
        <p style={{ fontSize: 14, color: "#a78bbc", lineHeight: 1.6, marginBottom: 16 }}>
          Complete any of these activities this week. Every dollar you save stays yours.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {MINI_CHALLENGES.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#c5a3ff", flexShrink: 0 }}>{i + 1}</div>
              <span style={{ fontSize: 13, color: "#f0e6ff", fontWeight: 500 }}>{c}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setChallengeOpen(false)}
          style={{ width: "100%", padding: 14, borderRadius: 14, background: "linear-gradient(135deg,#a855f7,#e879f9)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", marginTop: 20 }}>
          Got It — Let's Go!
        </button>
      </BottomSheet>
    </main>
  );
}