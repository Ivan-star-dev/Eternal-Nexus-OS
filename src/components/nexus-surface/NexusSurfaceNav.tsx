/**
 * NexusSurfaceNav.tsx
 * Heaven Lab face — top navigation bar.
 *
 * Identity: "Nexus" logotype · Lab · Projects · About · CTA "Enter Lab"
 * Mobile-first: hamburger at 375px, horizontal layout from md breakpoint.
 * Dark theme: #0a0a1a base, Syne sans-serif, mono tracking.
 *
 * Canon: NS-1-001 · K-04 SURFACE · K-05 TYPOGRAPHY
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, FlaskConical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const NAV_LINKS = [
  { label: "Lab",      path: "/lab"      },
  { label: "Projects", path: "/projects" },
  { label: "About",    path: "/about"    },
] as const;

export default function NexusSurfaceNav() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[900]"
      role="banner"
    >
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        aria-label="Nexus Surface Navigation"
        className="relative flex items-center h-14 px-5 md:px-10 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(10, 10, 26, 0.88)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "0.5px solid rgba(255,255,255,0.06)"
            : "0.5px solid transparent",
        }}
      >
        {/* ── Logotype ─────────────────────────────────────── */}
        <Link
          to="/lab"
          className="flex-shrink-0 flex items-center gap-2 group"
          aria-label="Nexus — Go to Lab"
        >
          <motion.div
            whileHover={{ rotate: 12, scale: 1.08 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-center w-6 h-6"
          >
            <FlaskConical
              className="w-4 h-4"
              style={{ color: "hsl(42 78% 52%)" }}
            />
          </motion.div>
          <span
            className="font-sans font-[700] tracking-[0.08em] uppercase"
            style={{
              fontFamily: "Syne, system-ui, sans-serif",
              fontSize: "14px",
              color: "rgba(228, 235, 240, 0.92)",
              letterSpacing: "0.12em",
            }}
          >
            Nexus
          </span>
          <span
            className="hidden sm:inline font-mono"
            style={{
              fontSize: "8px",
              letterSpacing: "0.22em",
              color: "hsl(42 78% 45% / 0.5)",
              marginLeft: "2px",
              marginTop: "2px",
              alignSelf: "flex-start",
            }}
          >
            LAB
          </span>
        </Link>

        <div className="flex-1" />

        {/* ── Desktop nav links ─────────────────────────────── */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Primary links"
        >
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                className="relative font-sans font-[400] transition-colors duration-250 group"
                style={{
                  fontFamily: "Syne, system-ui, sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  color: isActive
                    ? "rgba(228,235,240,0.92)"
                    : "rgba(228,235,240,0.42)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(228,235,240,0.72)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(228,235,240,0.42)";
                }}
              >
                {link.label}
                {/* Active underline */}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute -bottom-[2px] left-0 right-0 h-px"
                    style={{
                      background:
                        "linear-gradient(to right, transparent, hsl(42 78% 45% / 0.8), transparent)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── CTA button ────────────────────────────────────── */}
        <motion.div
          className="hidden md:block ml-8"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            to="/lab"
            className="inline-flex items-center gap-2 font-sans font-[500] transition-all duration-200"
            style={{
              fontFamily: "Syne, system-ui, sans-serif",
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "hsl(216 50% 5%)",
              background: "hsl(42 78% 52%)",
              border: "none",
              padding: "8px 20px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "hsl(42 78% 60%)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "hsl(42 78% 52%)";
            }}
          >
            <FlaskConical className="w-3 h-3" />
            Enter Lab
          </Link>
        </motion.div>

        {/* ── Mobile hamburger ─────────────────────────────── */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 ml-4"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X
                  className="w-5 h-5"
                  style={{ color: "rgba(228,235,240,0.72)" }}
                />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Menu
                  className="w-5 h-5"
                  style={{ color: "rgba(228,235,240,0.72)" }}
                />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.nav>

      {/* ── Mobile drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="md:hidden"
            style={{
              background: "rgba(10, 10, 26, 0.97)",
              backdropFilter: "blur(24px)",
              borderBottom: "0.5px solid rgba(255,255,255,0.07)",
            }}
          >
            <nav
              className="flex flex-col px-5 py-4 gap-1"
              aria-label="Mobile navigation"
            >
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="flex items-center font-sans font-[400] py-3 px-3 transition-colors duration-200"
                    style={{
                      fontFamily: "Syne, system-ui, sans-serif",
                      fontSize: "13px",
                      letterSpacing: "0.08em",
                      color: isActive
                        ? "rgba(228,235,240,0.92)"
                        : "rgba(228,235,240,0.48)",
                      borderLeft: isActive
                        ? "1.5px solid hsl(42 78% 45% / 0.7)"
                        : "1.5px solid transparent",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* CTA in mobile */}
              <div className="pt-4 pb-2">
                <Link
                  to="/lab"
                  className="inline-flex items-center gap-2 font-sans font-[500]"
                  style={{
                    fontFamily: "Syne, system-ui, sans-serif",
                    fontSize: "11px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "hsl(216 50% 5%)",
                    background: "hsl(42 78% 52%)",
                    padding: "10px 22px",
                  }}
                >
                  <FlaskConical className="w-3 h-3" />
                  Enter Lab
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
