import type { Metadata } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TabBar } from "@/components/TabBar";

const serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
});

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Voyage — your US journey, together",
  description: "Built for Zolve.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans antialiased min-h-screen overflow-x-hidden">
        {/* Floating ambient light blobs */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, #a855f7, transparent 70%)",
              top: "-200px",
              left: "-100px",
              animation: "float-blob-1 8s ease-in-out infinite alternate",
            }}
          />
          <div
            className="absolute w-[400px] h-[400px] rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle, #e879f9, transparent 70%)",
              bottom: "-100px",
              right: "-80px",
              animation: "float-blob-2 10s ease-in-out infinite alternate",
            }}
          />
          <div
            className="absolute w-[300px] h-[300px] rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, #38bdf8, transparent 70%)",
              top: "40%",
              right: "10%",
            }}
          />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-[420px] min-h-[844px] bg-[var(--color-surface)] rounded-[44px] border border-[var(--color-edge)] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col">
            {children}
            <TabBar />
          </div>
        </div>
      </body>
    </html>
  );
}