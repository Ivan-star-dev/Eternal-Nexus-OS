/**
 * EmailCaptureModal.tsx
 * Simple waitlist email capture modal.
 *
 * - Dark theme, Framer Motion entrance
 * - Success state after submission
 * - Supabase insert to `waitlist` table — silent fail if table absent
 *
 * Canon: V8-DUAL-ACCESS-001 · K-04+K-07
 * @framer+@cursor | 2026-03-28
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type ModalState = "idle" | "loading" | "success";

export default function EmailCaptureModal({ isOpen, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<ModalState>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setState("loading");
    setError(null);

    try {
      if (supabase) {
        await (supabase as NonNullable<typeof supabase>)
          .from("waitlist" as never)
          .insert([{ email: email.trim() }] as never);
      }
    } catch {
      // silent fail — table may not exist yet
    }

    setState("success");
  };

  const handleClose = () => {
    onClose();
    // Reset state after animation out
    setTimeout(() => {
      setState("idle");
      setEmail("");
      setError(null);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.72)",
              backdropFilter: "blur(4px)",
              zIndex: 9998,
            }}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "16px",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                pointerEvents: "auto",
                background: "hsl(var(--background))",
                border: "0.5px solid rgba(200,164,78,0.18)",
                padding: "clamp(28px, 5vw, 44px)",
                width: "100%",
                maxWidth: "460px",
                position: "relative",
              }}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                aria-label="Close modal"
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "hsl(var(--rx-text-ghost))",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "hsl(var(--rx-text-dim))";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "hsl(var(--rx-text-ghost))";
                }}
              >
                <X size={16} />
              </button>

              <AnimatePresence mode="wait">
                {state === "success" ? (
                  /* ── Success state ── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      gap: "16px",
                      paddingTop: "8px",
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
                      style={{ color: "hsl(42 78% 52%)" }}
                    >
                      <CheckCircle size={40} strokeWidth={1.5} />
                    </motion.div>
                    <div>
                      <p
                        style={{
                          fontFamily: "Syne, system-ui, sans-serif",
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "hsl(var(--foreground))",
                          marginBottom: "8px",
                        }}
                      >
                        You're on the list.
                      </p>
                      <p
                        style={{
                          fontFamily: "Syne, system-ui, sans-serif",
                          fontSize: "14px",
                          color: "hsl(var(--rx-text-dim))",
                          lineHeight: 1.6,
                        }}
                      >
                        We'll reach out soon.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  /* ── Form state ── */
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Header */}
                    <div style={{ marginBottom: "24px" }}>
                      <span
                        style={{
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "9px",
                          letterSpacing: "0.28em",
                          color: "rgba(200,164,78,0.55)",
                          textTransform: "uppercase",
                          display: "block",
                          marginBottom: "10px",
                        }}
                      >
                        Researcher Waitlist
                      </span>
                      <h2
                        id="waitlist-modal-title"
                        style={{
                          fontFamily: "Syne, system-ui, sans-serif",
                          fontSize: "clamp(18px, 4vw, 22px)",
                          fontWeight: 700,
                          color: "hsl(var(--foreground))",
                          margin: 0,
                          lineHeight: 1.3,
                        }}
                      >
                        Get full Lab access
                      </h2>
                      <p
                        style={{
                          fontFamily: "Syne, system-ui, sans-serif",
                          fontSize: "13px",
                          color: "hsl(var(--rx-text-dim))",
                          marginTop: "8px",
                          lineHeight: 1.6,
                        }}
                      >
                        Join the researcher waitlist and we'll notify you when
                        your access is ready.
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                      <div style={{ position: "relative", marginBottom: "12px" }}>
                        <Mail
                          size={14}
                          style={{
                            position: "absolute",
                            left: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "hsl(var(--rx-text-ghost))",
                            pointerEvents: "none",
                          }}
                        />
                        <input
                          type="email"
                          required
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          aria-label="Email address"
                          style={{
                            width: "100%",
                            background: "rgba(255,255,255,0.04)",
                            border: "0.5px solid rgba(255,255,255,0.1)",
                            color: "hsl(var(--foreground))",
                            fontFamily: "JetBrains Mono, monospace",
                            fontSize: "13px",
                            padding: "13px 14px 13px 38px",
                            outline: "none",
                            transition: "border-color 0.2s",
                            boxSizing: "border-box",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor =
                              "rgba(200,164,78,0.4)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor =
                              "rgba(255,255,255,0.1)";
                          }}
                        />
                      </div>

                      {error && (
                        <p
                          style={{
                            fontFamily: "JetBrains Mono, monospace",
                            fontSize: "11px",
                            color: "hsl(0 70% 55%)",
                            marginBottom: "10px",
                          }}
                        >
                          {error}
                        </p>
                      )}

                      <motion.button
                        type="submit"
                        disabled={state === "loading"}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        style={{
                          width: "100%",
                          background: "hsl(42 78% 52%)",
                          color: "hsl(var(--background))",
                          border: "none",
                          padding: "14px",
                          fontFamily: "Syne, system-ui, sans-serif",
                          fontSize: "12px",
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          cursor: state === "loading" ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          opacity: state === "loading" ? 0.7 : 1,
                          transition: "background 0.2s, opacity 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (state !== "loading") {
                            (e.currentTarget as HTMLElement).style.background =
                              "hsl(42 78% 62%)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background =
                            "hsl(42 78% 52%)";
                        }}
                      >
                        {state === "loading" ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Joining…
                          </>
                        ) : (
                          "Join Waitlist"
                        )}
                      </motion.button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
