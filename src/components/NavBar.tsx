import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { user, profile, isOwner, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { visible, atTop } = useScrollDirection();

  const navLinks = [
    { label: "SCHOOL", path: "/school", live: false },
    { label: "LAB", path: "/lab", live: false },
    { label: "CREATION HUB", path: "/projects", live: false },
    { label: "PROJECTS", path: "/projects", live: false },
    { label: "GEOPOLITICS", path: "/geopolitics", live: false },
    { label: "INVESTOR BRIEFING", path: "/investor/deltaspine-nl", live: false },
    { label: t("nav_about"), path: "/about", live: false },
  ];

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -80 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Navegação principal"
        role="navigation"
        className={`fixed top-0 left-0 right-0 z-[999] h-12 flex items-center px-5 md:px-8 transition-all duration-300 border-b ${
          atTop
            ? "bg-abyssal/50 backdrop-blur-md border-white/[0.04]"
            : "bg-abyssal/80 backdrop-blur-xl border-white/[0.06]"
        }`}
      >
        {/* Signature */}
        <Link to="/" className="flex-shrink-0 relative inline-flex items-center gap-1.5 select-none">
          <span className="font-sans text-[0.6rem] font-medium text-paper/40 tracking-[0.22em] uppercase">RUBERRA</span>
          <span className="text-paper/15 text-[0.5rem]">·</span>
          <span className="font-mono text-[0.52rem] text-paper/25 tracking-[0.16em] uppercase">ETERNAL NEXUS OS</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5 ml-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`font-sans text-[0.6rem] tracking-[0.1em] uppercase transition-colors duration-200 ${
                location.pathname === link.path
                  ? "text-paper/90"
                  : "text-paper/35 hover:text-paper/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-4">
          {isOwner && (
            <Link
              to="/owner"
              className="font-mono text-[0.52rem] tracking-[0.1em] text-burnt-gold/70 border border-burnt-gold/30 px-2 py-1 hover:border-burnt-gold/60 transition-colors flex items-center gap-1"
            >
              <Shield className="w-2.5 h-2.5" />
              OWNER
            </Link>
          )}

          <div className="w-px h-4 bg-white/8" />

          {user ? (
            <div className="flex items-center gap-3">
              {profile && (
                <span className="font-mono text-[0.48rem] tracking-[0.08em] text-paper/25 max-w-[100px] truncate">
                  {profile.institution}
                </span>
              )}
              <button
                onClick={() => signOut()}
                className="font-mono text-[0.52rem] tracking-[0.1em] text-paper/30 hover:text-paper/60 transition-colors"
              >
                EXIT
              </button>
            </div>
          ) : (
            <Link
              to="/access"
              className="font-mono text-[0.52rem] tracking-[0.12em] text-paper/40 hover:text-paper/80 transition-colors"
            >
              ENTER
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden ml-3 text-foreground">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-12 left-0 right-0 bg-abyssal/96 backdrop-blur-xl border-b border-white/[0.06] p-6 flex flex-col gap-5 md:hidden"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="font-sans text-[0.65rem] tracking-[0.12em] uppercase text-paper/40 hover:text-paper/80 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-white/6 my-1" />
              <Link
                to="/access"
                onClick={() => setMobileOpen(false)}
                className="font-mono text-[0.6rem] tracking-[0.12em] text-paper/40 hover:text-paper/80 transition-colors"
              >
                {user ? (profile?.institution ?? "ACCOUNT") : "ENTER"}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </AnimatePresence>
  );
};

export default NavBar;
