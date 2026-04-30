"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { CreditCard, TrendingUp, Send, AlertCircle, ChevronRight, Sparkles } from "lucide-react";
import { user, cohort, transactions } from "@/lib/world";
import { JourneyPath } from "@/components/primitives";
import { BuddySheet } from "@/components/BuddySheet";
import { quests } from "@/lib/world";

const ease = [0.22, 1, 0.36, 1] as const;
function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease, delay },
  };
}

export default function VoyageHome() {
  const [buddyOpen, setBuddyOpen] = useState(false);
  const recentTx = [...transactions].slice(-3).reverse();
  const today = new Date("2026-04-29");
  const oneWeekAgo = new Date(today); oneWeekAgo.setDate(today.getDate() - 7);
  const fourWeeksAgo = new Date(today); fourWeeksAgo.setDate(today.getDate() - 28);
  const weekDining = transactions.filter(t => t.category === "Dining" && new Date(t.date) >= oneWeekAgo).reduce((s,t) => s+t.amount, 0);
  const monthDining = transactions.filter(t => t.category === "Dining" && new Date(t.date) >= fourWeeksAgo).reduce((s,t) => s+t.amount, 0);
  const monthlyAvgDining = monthDining / 4;
  const diningDelta = monthlyAvgDining > 0
  ? Math.round(((weekDining - monthlyAvgDining) / monthlyAvgDining) * 100)
  : 0;

  return (
    <main className="flex flex-col flex-1 overflow-y-auto pb-28">
      <style>{`
        @keyframes spin-ring { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes float-card { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-4px)} }
        .spin-ring { animation: spin-ring 4s linear infinite; }
        .float-c { animation: float-card 6s ease-in-out infinite; }
        .float-c2 { animation: float-card 6s ease-in-out infinite; animation-delay: -2s; }
      `}</style>

      {/* Top bar */}
      <motion.header {...fade(0)} className="flex items-center justify-between px-6 pt-7 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background:"#a855f7", boxShadow:"0 0 8px #a855f7, 0 0 16px rgba(168,85,247,0.5)" }} />
          <span style={{ fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.24em", color:"#a78bbc", fontWeight:500 }}>Voyage</span>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background:"linear-gradient(135deg,rgba(168,85,247,0.2),rgba(232,121,249,0.1))", border:"1px solid rgba(168,85,247,0.3)", boxShadow:"0 0 16px rgba(168,85,247,0.2)" }}>
          <span style={{ fontSize:"14px", fontWeight:600, color:"#e879f9" }}>{user.initials}</span>
        </div>
      </motion.header>

      {/* Stage banner */}
      <motion.section {...fade(0.08)} className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <span style={{ fontSize:"10px", padding:"2px 8px", borderRadius:"999px", background:"rgba(168,85,247,0.1)", border:"1px solid rgba(168,85,247,0.3)", color:"#a855f7", fontWeight:500 }}>
            Day {user.daysInUS}
          </span>
          <span style={{ fontSize:"10px", color:"#5b4d6e", textTransform:"uppercase", letterSpacing:"0.1em" }}>in your US journey</span>
        </div>
        <h1 style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:"52px", lineHeight:0.95, color:"#f0e6ff", textShadow:"0 0 40px rgba(168,85,247,0.3), 0 0 80px rgba(168,85,247,0.15)", marginBottom:"8px" }}>
          {user.stage}
        </h1>
        <div style={{ height:"1px", width:"75%", background:"linear-gradient(90deg,#a855f7,#e879f9,transparent)", boxShadow:"0 0 8px rgba(168,85,247,0.4)", marginBottom:"24px" }} />
        <div className="relative mb-2">
          <JourneyPath />
          <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full"
            style={{ left:`${user.stageProgress*100}%`, background:"radial-gradient(circle,#e879f9,#a855f7)", boxShadow:"0 0 16px #a855f7, 0 0 32px rgba(168,85,247,0.5)" }} />
        </div>
        <div className="flex justify-between" style={{ fontSize:"10px", color:"#5b4d6e" }}>
          <span>Arrival</span>
          <span style={{ color:"#e879f9", textShadow:"0 0 8px rgba(232,121,249,0.5)" }}>You</span>
          <span>{user.nextStage}</span>
        </div>
      </motion.section>

      <div className="px-6 space-y-4">

        {/* Buddy card */}
        <motion.div {...fade(0.16)} className="float-c">
          <div className="relative rounded-2xl p-5"
            style={{ background:"linear-gradient(135deg,rgba(168,85,247,0.08),rgba(232,121,249,0.04))", border:"1px solid rgba(168,85,247,0.2)", boxShadow:"0 0 40px -12px rgba(168,85,247,0.3)" }}>
            <div style={{ position:"absolute", inset:0, borderRadius:"16px", background:"linear-gradient(135deg,rgba(255,255,255,0.06),transparent 50%)", pointerEvents:"none" }} />
            <div className="flex items-start gap-4 relative">
              <div className="relative w-12 h-12 shrink-0">
                <div className="absolute inset-0 rounded-full spin-ring"
                  style={{ background:"conic-gradient(from 0deg,#a855f7,#e879f9,#38bdf8,#a855f7)" }} />
                <div className="absolute inset-[2px] rounded-full flex items-center justify-center" style={{ background:"#08001f" }}>
                  <Sparkles size={14} style={{ color:"#e879f9", filter:"drop-shadow(0 0 4px #e879f9)" }} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize:"10px", textTransform:"uppercase", letterSpacing:"0.2em", color:"#a855f7" }}>Zolvi</span>
                  <span style={{ fontSize:"9px", padding:"1px 6px", borderRadius:"999px", background:"rgba(168,85,247,0.1)", border:"1px solid rgba(168,85,247,0.2)", color:"#a855f7" }}>just now</span>
                </div>
                <p style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:"16px", lineHeight:1.4, color:"#f0e6ff", marginBottom:"16px" }}>
                  "Yash — you're 8 days from your credit anniversary. Want me to walk you through requesting a limit increase?"
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setBuddyOpen(true)}
                    className="transition-all duration-300 hover:scale-105"
                    style={{ padding:"8px 16px", borderRadius:"999px", background:"linear-gradient(135deg,#a855f7,#e879f9)", color:"#fff", fontSize:"12px", fontWeight:600, boxShadow:"0 0 20px rgba(168,85,247,0.4)" }}>
                    Walk me through
                  </button>
                  <button className="transition-all duration-300 hover:scale-105"
                    style={{ padding:"8px 16px", borderRadius:"999px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#a78bbc", fontSize:"12px" }}>
                    Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div {...fade(0.24)}>
          <div style={{ fontSize:"10px", textTransform:"uppercase", letterSpacing:"0.2em", color:"#5b4d6e", marginBottom:"12px" }}>Quick actions</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: CreditCard, top:"Pay",   bottom:"April bill", color:"#a855f7" },
              { icon: TrendingUp, top:"Boost", bottom:"Limit",      color:"#e879f9" },
              { icon: Send,       top:"Send",  bottom:"Home",       color:"#38bdf8" },
            ].map(({ icon: Icon, top, bottom, color }) => (
              <button key={top}
                className="flex flex-col items-center gap-2 rounded-2xl py-4 px-2 transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow=`0 0 20px ${color}33`; el.style.borderColor=`${color}44`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow="none"; el.style.borderColor="rgba(255,255,255,0.06)"; }}>
                <Icon size={18} style={{ color, filter:`drop-shadow(0 0 4px ${color})` }} />
                <div className="text-center">
                  <div style={{ fontSize:"9px", textTransform:"uppercase", letterSpacing:"0.14em", color:"#5b4d6e" }}>{top}</div>
                  <div style={{ fontSize:"12px", fontWeight:500, color:"#f0e6ff" }}>{bottom}</div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cohort */}
        <motion.div {...fade(0.32)} className="float-c2">
          <div className="relative rounded-2xl p-5"
            style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))", border:"1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ position:"absolute", inset:0, borderRadius:"16px", background:"linear-gradient(135deg,rgba(255,255,255,0.04),transparent 50%)", pointerEvents:"none" }} />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div style={{ fontSize:"10px", textTransform:"uppercase", letterSpacing:"0.2em", color:"#5b4d6e", marginBottom:"8px" }}>Your cohort</div>
                  <div style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:"20px", color:"#f0e6ff" }}>{cohort.name}</div>
                  <div style={{ fontSize:"11px", color:"#5b4d6e", marginTop:"2px" }}>{cohort.subtitle} · {cohort.size} members</div>
                </div>
                <ChevronRight size={16} style={{ color:"#5b4d6e" }} />
              </div>
              <div style={{ fontSize:"10px", display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
                <span style={{ color:"#5b4d6e" }}>Credit utilization</span>
                <span style={{ color:"#a855f7", textShadow:"0 0 8px rgba(168,85,247,0.4)" }}>Top {100-cohort.userPercentiles.creditUtil}%</span>
              </div>
              <div className="relative h-1.5 rounded-full" style={{ background:"rgba(255,255,255,0.05)" }}>
                {[25,50,75].map(p => <div key={p} className="absolute top-0 bottom-0 w-px" style={{ left:`${p}%`, background:"rgba(255,255,255,0.08)" }} />)}
                <div className="absolute top-0 left-0 h-full rounded-full"
                  style={{ width:`${cohort.userPercentiles.creditUtil}%`, background:"linear-gradient(90deg,rgba(168,85,247,0.3),rgba(168,85,247,0.6))" }} />
                <div className="absolute w-3 h-3 rounded-full"
                  style={{ left:`${cohort.userPercentiles.creditUtil}%`, top:"50%", transform:"translateX(-50%) translateY(-50%)", background:"radial-gradient(circle,#e879f9,#a855f7)", boxShadow:"0 0 10px #a855f7, 0 0 20px rgba(168,85,247,0.5)" }} />
              </div>
              <div style={{ fontSize:"11px", color:"#a855f7", marginTop:"8px" }}>Better than {cohort.userPercentiles.creditUtil}% of your cohort</div>
            </div>
          </div>
        </motion.div>

        {/* Insight */}
        <motion.div {...fade(0.40)}>
          <div className="relative rounded-2xl p-4"
            style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-start gap-3">
              <AlertCircle size={15} style={{ color:"#fb923c", filter:"drop-shadow(0 0 4px #fb923c)", flexShrink:0, marginTop:"2px" }} />
              <div className="flex-1">
                <div style={{ fontSize:"12px", fontWeight:600, color:"#f0e6ff", marginBottom:"4px" }}>Heads up</div>
                <div style={{ fontSize:"12px", color:"#a78bbc", lineHeight:1.5 }}>
                  Your dining spend this week is{" "}
                  <span style={{ color:"#fb923c", textShadow:"0 0 8px rgba(251,146,60,0.4)" }}>
                    {Math.abs(diningDelta)}% {diningDelta > 0 ? "above" : "below"}
                  </span>{" "}your 4-week average.
                </div>
              </div>
              <button style={{ fontSize:"11px", fontWeight:500, color:"#a855f7" }}>View</button>
            </div>
          </div>
        </motion.div>

        {/* Recent transactions */}
        <motion.div {...fade(0.48)}>
          <div style={{ fontSize:"10px", textTransform:"uppercase", letterSpacing:"0.2em", color:"#5b4d6e", marginBottom:"12px" }}>Recent</div>
          <div className="rounded-2xl overflow-hidden" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)" }}>
            {recentTx.map((tx, i) => (
              <div key={tx.id} className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: i < recentTx.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <div>
                  <div style={{ fontSize:"13px", fontWeight:500, color:"#f0e6ff" }}>{tx.merchant}</div>
                  <div style={{ fontSize:"11px", color:"#5b4d6e" }}>{tx.date}</div>
                </div>
                <div style={{ fontFamily:"var(--font-mono)", fontSize:"13px", color:"#a78bbc" }}>−${tx.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Buddy sheet */}
      <BuddySheet open={buddyOpen} onClose={() => setBuddyOpen(false)} />
    </main>
  );
}
