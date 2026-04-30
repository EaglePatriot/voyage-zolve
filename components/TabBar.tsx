"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Trophy, Users } from "lucide-react";

const tabs = [
  { href: "/",       icon: Map,    label: "ZETA"   },
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
              <Icon size={18} style={{ color: active ? "#a855f7" : "#5b4d6e", filter: active ? "drop-shadow(0 0 6px rgba(168,85,247,0.8))" : "none", transition: "all 0.3s ease" }} />
            </div>
            <span className="text-[9px] uppercase tracking-[0.16em] font-medium transition-all duration-300"
              style={{ color: active ? "#a855f7" : "#5b4d6e", textShadow: active ? "0 0 8px rgba(168,85,247,0.6)" : "none" }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
