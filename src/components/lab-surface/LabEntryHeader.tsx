/**
 * LabEntryHeader.tsx
 * Premium experience indicator for authenticated Lab users.
 *
 * - Shows avatar initials + user name + "Creation Lab" label + "Premium" badge
 * - Only visible when user is authenticated
 * - Dismissible — stored in localStorage
 * - Minimal height, never competes with work bay
 *
 * Canon: V8-DUAL-ACCESS-001 · K-04+K-07
 * @framer+@cursor | 2026-03-28
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const EASE = [0.22, 1, 0.36, 1] as const;
const DISMISS_KEY = "nexus_lab_entry_header_dismissed";

function getInitials(email: string): string {
  const parts = email.split("@")[0].split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function getDisplayName(email: string): string {
  return email.split("@")[0].replace(/[._-]/g, " ");
}

export default function LabEntryHeader() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(DISMISS_KEY);
    if (stored === "1") setDismissed(true);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore storage errors
    }
  };

  const shouldShow = mounted && !!user && !dismissed;

  const initials = user?.email ? getInitials(user.email) : "US";
  const displayName = user?.email ? getDisplayName(user.email) : "Researcher";

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          key="lab-entry-header"
          role="banner"
          aria-label="Lab access confirmed"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{
            background: "hsl(var(--background) / 0.94)",
            borderBottom: "0.5px solid rgba(0,170,255,0.12)",
            backdropFilter: "blur(8px)",
            padding: "0 clamp(16px, 4vw, 60px)",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* Left: avatar + name + label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              minWidth: 0,
            }}
          >
            {/* Avatar initials */}
            <div
              aria-hidden="true"
              style={{
                flexShrink: 0,
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, hsl(42 78% 45%), hsl(172 48% 45%))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "rgba(10,10,26,0.9)",
                  letterSpacing: "0.05em",
                }}
              >
                {initials}
              </span>
            </div>

            {/* Name */}
            <span
              style={{
                fontFamily: "Syne, system-ui, sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                color: "rgba(228,235,240,0.7)",
                textTransform: "capitalize",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayName}
            </span>

            {/* Separator */}
            <span
              aria-hidden="true"
              style={{
                color: "rgba(228,235,240,0.15)",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "10px",
              }}
            >
              ·
            </span>

            {/* Lab label */}
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "9px",
                letterSpacing: "0.22em",
                color: "rgba(0,170,255,0.55)",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Creation Lab
            </span>
          </div>

          {/* Right: Premium badge + dismiss */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "8px",
                letterSpacing: "0.2em",
                color: "hsl(42 78% 52%)",
                textTransform: "uppercase",
                border: "0.5px solid hsl(42 78% 52% / 0.3)",
                padding: "2px 7px",
              }}
            >
              Premium
            </span>

            <button
              onClick={handleDismiss}
              aria-label="Dismiss Lab header"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "rgba(228,235,240,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "3px",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(228,235,240,0.65)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(228,235,240,0.25)";
              }}
            >
              <X size={12} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
