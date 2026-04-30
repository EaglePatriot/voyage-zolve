import type { Metadata } from "next";
import { Instrument_Serif, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TabBar } from "@/components/TabBar";
import { DesktopShell } from "@/components/DesktopShell";
import { GlobalAIShortcut } from "@/components/GlobalAIShortcut";

const serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ZETA — your US financial journey, unlocked",
  description: "Built for INFORMS × Zolve Hackathon 2026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body
        className="font-sans antialiased"
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "#030008",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Animated background blobs */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{
            position: "absolute", width: 900, height: 900, borderRadius: "50%",
            background: "radial-gradient(circle, #a855f7, transparent 65%)",
            top: -300, left: -200, opacity: 0.25, filter: "blur(40px)",
            animation: "drift-1 22s ease-in-out infinite alternate",
          }} />
          <div style={{
            position: "absolute", width: 700, height: 700, borderRadius: "50%",
            background: "radial-gradient(circle, #e879f9, transparent 65%)",
            bottom: -200, right: -150, opacity: 0.2, filter: "blur(40px)",
            animation: "drift-2 28s ease-in-out infinite alternate",
          }} />
          <div style={{
            position: "absolute", width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, #38bdf8, transparent 65%)",
            top: "30%", right: "20%", opacity: 0.15, filter: "blur(40px)",
            animation: "drift-3 32s ease-in-out infinite alternate",
          }} />
          {/* subtle grid */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.025,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
        </div>

        <DesktopShell>
          {/* iPhone 16 Pro Max frame */}
          <div
            style={{
              position: "relative",
              width: "min(430px, calc(100vw - 32px))",
              aspectRatio: "1320 / 2868",
              maxHeight: "calc(100vh - 32px)",
              overflow: "hidden",
              borderRadius: 46,
              border: "1px solid rgba(168,85,247,0.2)",
              background: "#0d0015",
              boxShadow: "0 60px 160px -20px rgba(0,0,0,0.95), 0 0 0 1px rgba(168,85,247,0.08), 0 0 80px -20px rgba(168,85,247,0.5)",
              flexShrink: 0,
            }}
          >
            {/* Dynamic Island */}
            <div style={{
              position: "absolute", top: 14, left: "50%",
              transform: "translateX(-50%)",
              width: 120, height: 34,
              background: "#000", borderRadius: 20,
              zIndex: 60,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
            }} />

            {/* Inner screen — flex column, overflow hidden */}
            {/* This is the scroll + tabbar + AI container */}
            {/* position: relative makes it the anchor for GlobalAIShortcut */}
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}>

              {/* Scrollable page content */}
              <div
                className="phone-scroll"
                style={{
                  flex: 1,
                  overflowY: "auto",
                  overflowX: "hidden",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                  paddingBottom: 110,
                }}
              >
                <style>{`.phone-scroll::-webkit-scrollbar { display: none; }`}</style>
                {children}
              </div>

              {/* Tab bar — sits at the bottom, above scroll content */}
              <div style={{ flexShrink: 0, zIndex: 30, position: "relative" }}>
                <TabBar />
              </div>

            </div>

            {/*
              GlobalAIShortcut is a direct child of the phone frame div.
              The phone frame has position: relative (implicit via the stacking context).
              GlobalAIShortcut uses position: absolute internally.
              overflow: hidden on the phone frame clips everything inside it.
              Result: the AI button + panel are always inside the iPhone — never escape.
            */}
            <GlobalAIShortcut />

          </div>
        </DesktopShell>
      </body>
    </html>
  );
}