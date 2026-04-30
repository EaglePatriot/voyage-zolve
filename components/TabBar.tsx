"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Trophy, Users, Sparkles } from "lucide-react";

const tabs = [
  { href: "/",       icon: Map,    label: "Voyage" },
  { href: "/quest",  icon: Trophy, label: "Quest"  },
  { href: "/cohort", icon: Users,  label: "Cohort" },
];

export function TabBar() {
  const path = usePathname();
  return (
    <nav className="absolute bottom-0 left-0 right-0 h-20 flex items-center justify-around px-4"
      style={{ background: "linear-gradient(to top, rgba(3,0,10,0.95), rgba(3,0,10,0.6))", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(168,85,247,0.1)" }}>
      {tabs.map(({ href, icon: Icon, label }) => {
        const active = path === href;
        return (
          <Link key={href} href={href} className="flex flex-col items-center gap-1.5 flex-1">
            <div className="w-1 h-1 rounded-full transition-all duration-500"
              style={{ background: active ? "#a855f7" : "transparent", boxShadow: active ? "0 0 8px #a855f7" : "none" }} />
            <div className="p-2 rounded-xl transition-all duration-300"
              style={{ background: active ? "rgba(168,85,247,0.12)" : "transparent", boxShadow: active ? "0 0 20px rgba(168,85,247,0.15)" : "none" }}>
              <Icon size={18} style={{ color: active ? "#a855f7" : "#5b4d6e", filter: active ? "drop-shadow(0 0 6px #a855f7)" : "none", transition: "all 0.3s ease" }} />
            </div>
            <span className="text-[9px] uppercase tracking-[0.16em] font-medium transition-all duration-300"
              style={{ color: active ? "#a855f7" : "#5b4d6e", textShadow: active ? "0 0 12px rgba(168,85,247,0.6)" : "none" }}>
              {label}
            </span>
          </Link>
        );
      })}
      <button
        className="absolute transition-all duration-300 hover:scale-110"
        style={{ bottom: "72px", right: "16px", width: "52px", height: "52px", borderRadius: "50%", background: "conic-gradient(from 0deg,#a855f7,#e879f9,#38bdf8,#a855f7)", boxShadow: "0 0 20px rgba(168,85,247,0.5)", animation: "spin-ring 4s linear infinite", display: "flex", alignItems: "center", justifyContent: "center" }}
        onClick={() => window.dispatchEvent(new CustomEvent("open-buddy"))}>
        <div className="absolute inset-[3px] rounded-full flex items-center justify-center" style={{ background: "#08001f" }}>
          <Sparkles size={16} style={{ color: "#e879f9", filter: "drop-shadow(0 0 4px #e879f9)" }} />
        </div>
      </button>
    </nav>
  );
}
