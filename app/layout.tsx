import type { Metadata } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TabBar } from "@/components/TabBar";

const serif = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-serif", style: ["normal", "italic"] });
const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Voyage — your US journey, together",
  description: "Built for Zolve.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans antialiased min-h-screen overflow-x-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)", top: "-200px", left: "-100px", animation: "float-blob-1 8s ease-in-out infinite alternate" }} />
          <div className="absolute w-[400px] h-[400px] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #e879f9, transparent 70%)", bottom: "-100px", right: "-80px", animation: "float-blob-2 10s ease-in-out infinite alternate" }} />
          <div className="absolute w-[300px] h-[300px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #38bdf8, transparent 70%)", top: "40%", right: "10%", animation: "float-blob-1 14s ease-in-out infinite alternate-reverse" }} />
        </div>
        <style>{`
          @keyframes float-blob-1 { from{transform:translate(0px,0px) scale(1)} to{transform:translate(30px,-20px) scale(1.1)} }
          @keyframes float-blob-2 { from{transform:translate(0px,0px) scale(1)} to{transform:translate(-20px,15px) scale(0.95)} }
          @keyframes float-card { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-4px)} }
          @keyframes spin-ring { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          .float-card { animation: float-card 6s ease-in-out infinite; }
          .float-c { animation: float-card 6s ease-in-out infinite; }
          .float-c2 { animation: float-card 6s ease-in-out infinite; animation-delay: -2s; }
          .spin-ring { animation: spin-ring 4s linear infinite; }
        `}</style>
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-[420px] min-h-[844px] relative flex flex-col overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              borderRadius: "44px",
              border: "1px solid rgba(168,85,247,0.15)",
              boxShadow: "0 0 0 1px rgba(168,85,247,0.08), 0 40px 120px -20px rgba(0,0,0,0.9), 0 0 80px rgba(168,85,247,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}>
            <div className="absolute top-0 left-[20%] right-[20%] h-px z-10"
              style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.6), rgba(232,121,249,0.6), transparent)" }} />
            {children}
            <TabBar />
          </div>
        </div>
      </body>
    </html>
  );
}
