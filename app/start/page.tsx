"use client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function StartPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col flex-1 items-center justify-between px-8 pt-16 pb-12">
      <style>{`
        @keyframes spin-ring { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes drift {
          0%,100%{transform:translateY(0px) scale(1)}
          50%{transform:translateY(-8px) scale(1.02)}
        }
        .drift { animation: drift 4s ease-in-out infinite; }
      `}</style>

      {/* Top wordmark */}
      <motion.div
        initial={{ opacity:0, y:-10 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.6, ease }}
        className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full"
          style={{ background:"#a855f7", boxShadow:"0 0 8px #a855f7, 0 0 16px rgba(168,85,247,0.5)" }} />
        <span style={{ fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.28em", color:"#a78bbc", fontWeight:500 }}>
          Voyage × Zolve
        </span>
      </motion.div>

      {/* Central hero */}
      <div className="flex flex-col items-center gap-8 drift">
        {/* Big spinning avatar */}
        <motion.div
          initial={{ opacity:0, scale:0.8 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ duration:0.8, ease, delay:0.2 }}
          className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full"
            style={{ background:"conic-gradient(from 0deg,#a855f7,#e879f9,#38bdf8,#a855f7)", animation:"spin-ring 4s linear infinite" }} />
          <div className="absolute inset-[3px] rounded-full flex items-center justify-center"
            style={{ background:"#08001f" }}>
            <Sparkles size={28} style={{ color:"#e879f9", filter:"drop-shadow(0 0 8px #e879f9)" }} />
          </div>
        </motion.div>

        {/* Headline */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.8, ease, delay:0.35 }}
            style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:"56px", lineHeight:0.95, color:"#f0e6ff", textShadow:"0 0 40px rgba(168,85,247,0.4), 0 0 80px rgba(168,85,247,0.2)", marginBottom:"16px" }}>
            Voyage.
          </motion.h1>

          {/* Animated underline */}
          <motion.div
            initial={{ width:0 }}
            animate={{ width:"80%" }}
            transition={{ duration:1.0, ease, delay:0.7 }}
            className="mx-auto h-px"
            style={{ background:"linear-gradient(90deg,transparent,#a855f7,#e879f9,transparent)", boxShadow:"0 0 8px rgba(168,85,247,0.4)", marginBottom:"16px" }}
          />

          <motion.p
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ duration:0.6, delay:0.9 }}
            style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:"16px", color:"#a78bbc", textAlign:"center" }}>
            Your US journey, together.
          </motion.p>
        </div>

        {/* Journey dots */}
        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ duration:0.8, delay:1.1 }}
          className="w-full flex items-center gap-1 justify-center">
          {Array.from({length:9}).map((_,i) => (
            <motion.div key={i}
              initial={{ scale:0, opacity:0 }}
              animate={{ scale:1, opacity: i === 4 ? 1 : 0.3 }}
              transition={{ duration:0.3, delay:1.1 + i*0.08 }}
              className="rounded-full"
              style={{
                width: i === 4 ? "10px" : "5px",
                height: i === 4 ? "10px" : "5px",
                background: i === 4 ? "#e879f9" : "#a855f7",
                boxShadow: i === 4 ? "0 0 12px #e879f9, 0 0 24px rgba(232,121,249,0.4)" : "none",
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* CTA */}
      <div className="w-full space-y-3">
        <motion.button
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6, ease, delay:1.3 }}
          onClick={() => router.push("/")}
          className="w-full py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{ background:"linear-gradient(135deg,#a855f7,#e879f9)", color:"#fff", fontSize:"15px", boxShadow:"0 0 30px rgba(168,85,247,0.4), 0 8px 20px rgba(168,85,247,0.2)" }}>
          Continue as Yash (demo)
        </motion.button>

        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:1.5 }}
          style={{ fontSize:"10px", color:"#5b4d6e", textAlign:"center" }}>
          Indian · ASU M.S. '26 · F-1 · Day 260
        </motion.div>
      </div>
    </main>
  );
}
