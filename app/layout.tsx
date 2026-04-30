import type { Metadata } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Voyage — your US journey, together",
  description: "Built for Zolve. An engagement layer for global citizens.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="font-sans antialiased min-h-screen bg-[#0a0e0d] text-stone-100">
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
          <div
            className="
              w-full max-w-[420px] min-h-[844px]
              bg-[#111817]
              rounded-[44px]
              border border-[#1f2a28]
              shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(77,212,172,0.06)]
              overflow-hidden
              relative
              flex flex-col
            "
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
