"use client";
import { ReactNode } from "react";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Map, Trophy, Users } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

type RouteMeta = {
  label: string;
  tip: string;
  icon: typeof Sparkles;
};

const ROUTE_META: { [key: string]: RouteMeta } = {
  "/": {
    label: "ZETA Home",
    tip: "Tap 'Walk me through' — Zolvi knows Rishi's real credit data and responds live.",
    icon: Map,
  },
  "/quest": {
    label: "Credit Quests",
    tip: "Every quest targets a real credit factor. Tap Start to see why it matters.",
    icon: Trophy,
  },
  "/cohort": {
    label: "UTD Cohort",
    tip: "52 peers, one cohort. Anonymous percentiles + real savings challenges.",
    icon: Users,
  },
  "/start": {
    label: "Welcome",
    tip: "Tap 'Continue as Rishi' to start the demo.",
    icon: Sparkles,
  },
};

export function DesktopShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const meta = ROUTE_META[pathname] ?? ROUTE_META["/"];
  const Icon = meta.icon;

  const valueProps = [
    { k: "01", t: "Credit that grows with you", d: "From 642 to credit-ready, one quest at a time." },
    { k: "02", t: "Your cohort has your back", d: "52 UTD peers on the same journey." },
    { k: "03", t: "Zolvi, powered by Claude", d: "Real AI coaching, grounded in your data." },
  ];

  const shortcuts = [
    { href: "/", label: "ZETA", icon: Map },
    { href: "/quest", label: "Quest", icon: Trophy },
    { href: "/cohort", label: "Cohort", icon: Users },
  ];

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-3 py-4 sm:px-6 sm:py-8 lg:px-12">
      <div className="w-full max-w-[1480px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-12 xl:gap-16 items-center">
        {/* LEFT — editorial product copy (desktop only) */}
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
          className="hidden lg:flex flex-col gap-8 xl:gap-10 max-w-[380px] justify-self-end"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: "#a855f7",
                boxShadow: "0 0 8px #a855f7, 0 0 16px rgba(168,85,247,0.5)",
                animation: "pulse-soft 2.4s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.32em",
                color: "#a78bbc",
                fontWeight: 500,
              }}
            >
              ZETA × Zolve
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "clamp(56px, 5.5vw, 76px)",
              lineHeight: 0.92,
              color: "#f0e6ff",
              letterSpacing: "-0.02em",
              textShadow:
                "0 0 60px rgba(168,85,247,0.3), 0 0 120px rgba(168,85,247,0.15)",
            }}
          >
            Your US financial journey,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a855f7, #e879f9, #38bdf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              unlocked.
            </span>
          </h1>

          <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#a78bbc", maxWidth: "340px" }}>
            ZETA is a financial co-pilot for international students. Build credit, send money home, save with your cohort, and learn through quests — all in one place.
          </p>

          <div className="flex flex-col gap-4">
            {valueProps.map((v, i) => (
              <motion.div
                key={v.k}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease, delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "#5b4d6e",
                    paddingTop: "3px",
                    minWidth: "20px",
                    letterSpacing: "0.05em",
                  }}
                >
                  {v.k}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#f0e6ff", marginBottom: "2px" }}>
                    {v.t}
                  </div>
                  <div style={{ fontSize: "12px", color: "#7a6e8e" }}>{v.d}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-8 border-t" style={{ borderColor: "rgba(168,85,247,0.12)" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.24em", color: "#5b4d6e" }}>
              INFORMS × Zolve Hackathon 2026
            </div>
          </div>
        </motion.aside>

        {/* CENTER — phone (responsive scale) */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease }}
          className="relative justify-self-center w-full max-w-[420px]"
        >
          <div
            className="absolute -inset-6 sm:-inset-8 rounded-[60px] opacity-50 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(168,85,247,0.25), transparent 65%)",
              filter: "blur(40px)",
            }}
          />
          <div className="relative">{children}</div>
        </motion.div>

        {/* RIGHT — live demo metadata (desktop only) */}
        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
          className="hidden lg:flex flex-col gap-6 max-w-[320px] justify-self-start"
        >
          <div
            className="rounded-2xl p-5"
            style={{
              background: "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(232,121,249,0.04))",
              border: "1px solid rgba(168,85,247,0.2)",
              boxShadow: "0 0 40px -16px rgba(168,85,247,0.4)",
            }}
          >
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.24em", color: "#5b4d6e", marginBottom: "10px" }}>
              Now showing
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(232,121,249,0.12))",
                  border: "1px solid rgba(168,85,247,0.35)",
                }}
              >
                <Icon size={16} style={{ color: "#e879f9", filter: "drop-shadow(0 0 4px #e879f9)" }} />
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "22px", color: "#f0e6ff", lineHeight: 1.1 }}>
                {meta.label}
              </div>
            </div>
            <p style={{ fontSize: "12px", lineHeight: 1.6, color: "#a78bbc" }}>{meta.tip}</p>
          </div>

          <div className="flex flex-col gap-2">
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.24em", color: "#5b4d6e", marginBottom: "4px" }}>
              Jump to
            </div>
            {shortcuts.map((s, i) => {
              const SIcon = s.icon;
              const active = pathname === s.href;
              return (
                <motion.button
                  key={s.href}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.5 + i * 0.08 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(s.href)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors duration-300 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a855f7] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  style={{
                    background: active ? "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(232,121,249,0.06))" : "rgba(255,255,255,0.02)",
                    border: active ? "1px solid rgba(168,85,247,0.35)" : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <SIcon size={14} style={{ color: active ? "#e879f9" : "#7a6e8e", filter: active ? "drop-shadow(0 0 4px #e879f9)" : "none" }} />
                    <span style={{ fontSize: "13px", fontWeight: 500, color: active ? "#f0e6ff" : "#a78bbc" }}>{s.label}</span>
                  </div>
                  <ArrowRight size={12} style={{ color: active ? "#e879f9" : "#5b4d6e" }} />
                </motion.button>
              );
            })}
          </div>

          <div className="rounded-2xl p-5 mt-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.24em", color: "#5b4d6e", marginBottom: "12px" }}>
              Built on
            </div>
            <div className="flex flex-col gap-3">
              {[
                { k: "52", v: "UTD cohort members" },
                { k: "642", v: "Rishi's starting credit score" },
                { k: "Live", v: "Claude Sonnet streaming" },
              ].map((s) => (
                <div key={s.v} className="flex items-baseline justify-between">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "18px", color: "#e879f9", textShadow: "0 0 8px rgba(232,121,249,0.4)" }}>
                    {s.k}
                  </span>
                  <span style={{ fontSize: "11px", color: "#7a6e8e", letterSpacing: "0.02em" }}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}