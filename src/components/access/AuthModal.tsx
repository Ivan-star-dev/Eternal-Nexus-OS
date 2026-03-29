/**
 * AuthModal.tsx
 * Lightweight sign-in modal for DualEntryGate Lab CTA.
 *
 * - Email + password login
 * - On success: redirects to /lab
 * - Dark theme, Framer Motion entrance
 * - Falls back gracefully if Supabase not configured
 *
 * Canon: V8-DUAL-ACCESS-001 · K-04+K-07
 * @framer+@cursor | 2026-03-28
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: Props) {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      await signIn(email.trim(), password);
      onClose();
      navigate("/lab");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Authentication failed.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setEmail("");
      setPassword("");
      setErrorMsg(null);
    }, 300);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    color: "rgba(228,235,240,0.88)",
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "13px",
    padding: "13px 14px 13px 38px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="auth-backdrop"
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
            key="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
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
                background: "#0d0e1f",
                border: "0.5px solid rgba(200,164,78,0.18)",
                padding: "clamp(28px, 5vw, 44px)",
                width: "100%",
                maxWidth: "440px",
                position: "relative",
              }}
            >
              {/* Close */}
              <button
                onClick={handleClose}
                aria-label="Close"
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(228,235,240,0.35)",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "rgba(228,235,240,0.75)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "rgba(228,235,240,0.35)";
                }}
              >
                <X size={16} />
              </button>

              {/* Header */}
              <div style={{ marginBottom: "28px" }}>
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
                  Heaven Lab · Access
                </span>
                <h2
                  id="auth-modal-title"
                  style={{
                    fontFamily: "Syne, system-ui, sans-serif",
                    fontSize: "clamp(20px, 4vw, 24px)",
                    fontWeight: 700,
                    color: "rgba(228,235,240,0.92)",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Enter the Lab
                </h2>
                <p
                  style={{
                    fontFamily: "Syne, system-ui, sans-serif",
                    fontSize: "13px",
                    color: "rgba(228,235,240,0.4)",
                    marginTop: "8px",
                    lineHeight: 1.6,
                  }}
                >
                  Sign in with your researcher credentials to access the
                  Creation Lab.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate>
                {/* Email field */}
                <div
                  style={{ position: "relative", marginBottom: "12px" }}
                >
                  <Mail
                    size={14}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "rgba(228,235,240,0.25)",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="researcher@institution.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email address"
                    style={inputStyle}
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

                {/* Password field */}
                <div
                  style={{ position: "relative", marginBottom: "20px" }}
                >
                  <Lock
                    size={14}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "rgba(228,235,240,0.25)",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label="Password"
                    style={inputStyle}
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

                {/* Error */}
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                      color: "hsl(0 70% 58%)",
                    }}
                  >
                    <AlertCircle size={13} />
                    <span
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "11px",
                      }}
                    >
                      {errorMsg}
                    </span>
                  </motion.div>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.99 }}
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
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    opacity: loading ? 0.7 : 1,
                    transition: "background 0.2s, opacity 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      (e.currentTarget as HTMLElement).style.background =
                        "hsl(42 78% 62%)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "hsl(42 78% 52%)";
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Authenticating…
                    </>
                  ) : (
                    "Sign In to Lab"
                  )}
                </motion.button>

                {/* Link to full auth page */}
                <p
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "11px",
                    color: "rgba(228,235,240,0.25)",
                    textAlign: "center",
                    marginTop: "16px",
                  }}
                >
                  No account?{" "}
                  <a
                    href="/access"
                    onClick={handleClose}
                    style={{
                      color: "rgba(200,164,78,0.6)",
                      textDecoration: "none",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(200,164,78,0.9)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(200,164,78,0.6)";
                    }}
                  >
                    Request access →
                  </a>
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
