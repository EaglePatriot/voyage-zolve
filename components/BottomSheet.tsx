"use client";
import { motion, AnimatePresence } from "motion/react";
import { ReactNode } from "react";
import { X } from "lucide-react";

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(6px)",
              zIndex: 40,
            }}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 50,
              background: "linear-gradient(180deg, #1a0933 0%, #0d0015 100%)",
              border: "1px solid rgba(168,85,247,0.25)",
              borderBottom: "none",
              borderRadius: "28px 28px 0 0",
              maxHeight: "88%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(168,85,247,0.4)" }} />
            </div>
            {/* header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px 12px" }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#f0e6ff", letterSpacing: "-0.01em" }}>{title}</span>
              <button
                onClick={onClose}
                style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={14} color="#a78bbc" />
              </button>
            </div>
            {/* content */}
            <div style={{ overflowY: "auto", flex: 1, padding: "0 20px 32px" }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}