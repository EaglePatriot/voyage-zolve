"use client";

import { motion } from "motion/react";
import { Users } from "lucide-react";
import { cohort } from "@/lib/world";
import { Card } from "@/components/primitives";

const ease = [0.22, 1, 0.36, 1] as const;
function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease, delay },
  };
}

const METRICS = [
  { label: "Credit utilization", percentile: 72, position: "top 28%" },
  { label: "On-time payments", percentile: 82, position: "top 18%" },
  { label: "Savings rate", percentile: 35, position: "bottom 35%" },
  { label: "Spending discipline", percentile: 59, position: "top 41%" },
];

export default function CohortPage() {
  return (
    <main className="flex flex-col flex-1 overflow-y-auto pb-28">
      {/* Header */}
      <motion.section {...fade(0)} className="px-6 pt-7 pb-2">
        <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500 font-medium mb-2">
          Your cohort
        </div>
        <h1 className="font-serif italic text-4xl text-stone-100 leading-[1.05] mb-2">
          ASU Intl Grads
        </h1>
        <p className="text-sm text-stone-300">
          Class of '26 · 47 members · 60% India · 20% China · 10% Brazil · 10% other
        </p>
      </motion.section>

      {/* Percentiles */}
      <motion.section {...fade(0.1)} className="px-6 mt-6">
        <div className="text-[10px] uppercase tracking-[0.14em] text-stone-500 font-medium mb-3">
          Where you stand
        </div>
        <Card>
          <div className="space-y-5">
            {METRICS.map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-stone-100">{m.label}</span>
                  <span className="text-xs font-mono text-[var(--color-teal)]">
                    {m.position}
                  </span>
                </div>
                <div className="relative h-1.5 bg-[var(--color-edge)] rounded-full">
                  {/* tick marks at 25/50/75 */}
                  {[25, 50, 75].map((p) => (
                    <div
                      key={p}
                      className="absolute top-1/2 -translate-y-1/2 w-px h-2 bg-stone-500/60"
                      style={{ left: `${p}%` }}
                    />
                  ))}
                  {/* user position */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4, ease }}
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--color-teal)]"
                    style={{
                      left: `${m.percentile}%`,
                      transform: "translate(-50%, -50%)",
                      boxShadow: "0 0 12px rgba(77,212,172,0.7)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.section>

      {/* Group challenge */}
      <motion.section {...fade(0.2)} className="px-6 mt-7">
        <div className="text-[10px] uppercase tracking-[0.14em] text-stone-500 font-medium mb-3">
          Active challenge
        </div>
        <Card glow>
          <h2 className="font-serif italic text-2xl text-stone-100 leading-tight mb-2">
            Save $500 by Spring Break
          </h2>
          <p className="text-xs text-stone-300 mb-4">
            12 of 47 joined · Pool $3,840 / $6,000
          </p>
          <div className="relative h-2 bg-[var(--color-edge)] rounded-full overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "64%" }}
              transition={{ delay: 0.5, duration: 1, ease }}
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--color-teal-deep)] to-[var(--color-teal)]"
              style={{ boxShadow: "0 0 12px rgba(77,212,172,0.5)" }}
            />
          </div>
          <div className="flex items-center gap-1 mb-4">
            {["AS", "RM", "PK", "JL", "CW", "DV"].map((init, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border border-[var(--color-edge)] bg-[var(--color-surface)] flex items-center justify-center text-[10px] text-stone-300 font-medium -ml-1 first:ml-0"
              >
                {init}
              </div>
            ))}
            <div className="ml-2 text-xs text-stone-500">+6 more</div>
          </div>
          <button
            className="w-full py-3 rounded-full bg-[var(--color-teal)] text-[var(--color-canvas)] text-sm font-medium hover:bg-[var(--color-cream)] transition-colors active:scale-[0.98]"
          >
            Join challenge
          </button>
        </Card>
      </motion.section>

      {/* Recent activity */}
      <motion.section {...fade(0.3)} className="px-6 mt-7">
        <div className="text-[10px] uppercase tracking-[0.14em] text-stone-500 font-medium mb-3">
          Cohort activity
        </div>
        <div className="space-y-2 text-sm text-stone-500">
          <div>Member from India just paid statement on time · 2h ago</div>
          <div>Savings challenge crossed 60% · 5h ago</div>
          <div>3 new members joined this week · 1d ago</div>
        </div>
      </motion.section>
    </main>
  );
}