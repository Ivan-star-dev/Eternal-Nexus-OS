/**
 * WaitlistBanner.tsx
 * Sticky bottom bar for public users browsing premium sections.
 *
 * - Shown on /lab, /school, /workshop for unauthenticated users
 * - Dismiss persisted to localStorage
 * - Opens EmailCaptureModal on CTA click
 * - Height ~56px, never obstructs work
 *
 * Canon: V8-DUAL-ACCESS-001 · K-04+K-07
 * @framer+@cursor | 2026-03-28
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import EmailCaptureModal from "./EmailCaptureModal";

const EASE = [0.22, 1, 0.36, 1] as const;
const DISMISS_KEY = "nexus_waitlist_banner_dismissed";
const PREMIUM_ROUTES = ["/lab", "/school", "/workshop"];

export default function WaitlistBanner() {
  const { user } = useAuth();
  const location = useLocation();
  const [dismissed, setDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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

  const isPremiumRoute = PREMIUM_ROUTES.includes(location.pathname);
  const shouldShow = mounted && !user && isPremiumRoute && !dismissed;

  return (
    <>
      <AnimatePresence>
        {shouldShow && (
          <motion.aside
            key="waitlist-banner"
            role="complementary"
            aria-label="Get Lab access"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              height: "56px",
              zIndex: 200,
              background: "rgba(10,10,26,0.92)",
              backdropFilter: "blur(12px)",
              borderTop: "0.5px solid rgba(200,164,78,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(12px, 3vw, 24px)",
              padding: "0 clamp(16px, 4vw, 40px)",
            }}
          >
            {/* Text */}
            <p
              style={{
                fontFamily: "Syne, system-ui, sans-serif",
                fontSize: "clamp(11px, 2.5vw, 13px)",
                color: "rgba(228,235,240,0.65)",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flexShrink: 1,
              }}
            >
              Get full Lab access — join the researcher waitlist
            </p>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setModalOpen(true)}
              style={{
                flexShrink: 0,
                background: "hsl(42 78% 52%)",
                color: "hsl(216 50% 5%)",
                border: "none",
                padding: "8px 20px",
                fontFamily: "Syne, system-ui, sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "hsl(42 78% 62%)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "hsl(42 78% 52%)";
              }}
            >
              Join Waitlist
            </motion.button>

            {/* Dismiss */}
            <button
              onClick={handleDismiss}
              aria-label="Dismiss banner"
              style={{
                flexShrink: 0,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "rgba(228,235,240,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(228,235,240,0.7)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(228,235,240,0.3)";
              }}
            >
              <X size={14} />
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      <EmailCaptureModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
