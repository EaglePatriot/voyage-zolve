import { ReactNode } from "react";

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Card({
  children,
  className,
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-[#1f2a28] bg-[#1a2322] p-5",
        glow && "shadow-[0_0_40px_-12px_rgba(77,212,172,0.3)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatPill({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: "up" | "down" | "flat";
}) {
  const trendColor =
    trend === "up"
      ? "text-[#4dd4ac]"
      : trend === "down"
      ? "text-[#e89478]"
      : "text-stone-300";

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-[0.14em] text-stone-500 font-medium">
        {label}
      </span>
      <span className={cn("font-mono text-lg tabular-nums font-medium", trendColor)}>
        {value}
      </span>
    </div>
  );
}

export function JourneyPath({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-[2px] w-full journey-dots opacity-60", className)}
      aria-hidden="true"
    />
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500 font-medium mb-3">
      {children}
    </div>
  );
}