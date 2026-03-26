import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, LogOut, Shield, Search, BarChart3, Globe, Brain } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_OUT } from "@/lib/motion/config";

const NavBar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { user, profile, isOwner, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { visible, atTop } = useScrollDirection();

  const navLinks = [
    { label: "GLOBE", path: "/globe", icon: Globe, live: true },
    { label: "NEXUS", path: "/nexus", icon: Brain, live: true },
    { label: "DASHBOARD", path: "/dashboard", icon: BarChart3, live: true },
  ];

  const triggerCmdK = () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -80 }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
        aria-label="Navegação principal"
        role="navigation"
        className={`fixed top-0 left-0 right-0 z-[999] h-14 flex items-center px-5 md:px-8 transition-all duration-500 ${
          atTop ? "bg-transparent border-b border-white/[0.04]" : "bg-background/80 backdrop-blur-2xl border-b border-white/[0.08]"
        }`}
      >
        <Link to="/" className="flex-shrink-0 logo-shimmer relative inline-flex items-baseline">
          <span className="font-serif text-sm font-bold text-foreground tracking-wide">NEXT PATH</span>
          <sup className="font-mono text-[0.48rem] text-primary tracking-[0.18em] ml-1 align-super">INFRA</sup>
        </Link>
        <div className="hidden md:flex items-center gap-6 ml-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.label} to={link.path}
                className={`relative font-mono text-[0.62rem] tracking-[0.12em] uppercase py-1 transition-all duration-300 flex items-center gap-1.5 hover:scale-105 ${
                  isActive ? "text-primary link-glow-active" : "text-muted-foreground hover:text-primary/80"
                }`}>
                {link.icon && <link.icon className="w-3 h-3" />}
                {link.label}
                {link.live && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse ml-0.5" />}
                {isActive && <span className="absolute -bottom-[1px] left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(42 78% 45% / 0.9), transparent)" }} />}
              </Link>
            );
          })}
        </div>
        <div className="flex-1" />
        <button onClick={triggerCmdK} className="hidden md:flex items-center gap-2 border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-colors px-3 py-1.5 mr-4">
          <Search className="w-3 h-3 text-muted-foreground" />
          <span className="font-mono text-[0.55rem] text-muted-foreground">Search…</span>
          <kbd className="font-mono text-[0.45rem] text-muted-foreground/60 bg-background/50 border border-border/30 px-1 py-0.5 rounded-sm">⌘K</kbd>
        </button>
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher />
          {user ? (
            <div className="flex items-center gap-2.5">
              {isOwner && (
                <Link to="/owner" className="font-mono text-[0.52rem] tracking-[0.1em] text-primary border border-primary/50 px-2 py-1 hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" /> OWNER
                </Link>
              )}
              {profile && <span className="font-mono text-[0.48rem] tracking-[0.08em] text-muted-foreground max-w-[100px] truncate">{profile.institution}</span>}
              <button onClick={() => signOut()} className="text-muted-foreground hover:text-destructive transition-colors"><LogOut className="w-3 h-3" /></button>
            </div>
          ) : (
            <Link to="/access" className="font-mono text-[0.55rem] tracking-[0.1em] text-primary border border-primary/60 px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1.5">
              <LogIn className="w-3 h-3" /> ACCESS
            </Link>
          )}
          <div className="flex items-center gap-1.5 ml-1">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-light animate-pulse-dot" />
            <span className="font-mono text-[0.5rem] text-teal-light">{t("nav_secure")}</span>
          </div>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden ml-3 text-foreground">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="absolute top-14 left-0 right-0 backdrop-blur-2xl border-b border-white/[0.08] p-6 flex flex-col gap-1 md:hidden"
              style={{ background: "hsl(216 50% 5% / 0.96)" }}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link key={link.label} to={link.path} onClick={() => setMobileOpen(false)}
                    className={`font-mono text-[0.68rem] tracking-[0.12em] transition-all duration-200 py-2.5 px-3 flex items-center gap-2 ${
                      isActive ? "text-primary bg-primary/5 border-l border-primary/60" : "text-muted-foreground hover:text-primary/80 border-l border-transparent"
                    }`}>
                    {link.icon && <link.icon className="w-3 h-3" />}
                    {link.label}
                    {link.live && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
                  </Link>
                );
              })}
              <div className="mt-2 pt-3 border-t border-white/[0.06] flex flex-col gap-1">
                {isOwner && (<Link to="/owner" onClick={() => setMobileOpen(false)} className="font-mono text-[0.68rem] tracking-[0.12em] text-primary py-2 px-3 border-l border-primary/40 flex items-center gap-2"><Shield className="w-3 h-3" /> OWNER DASHBOARD</Link>)}
                <Link to="/access" onClick={() => setMobileOpen(false)} className="font-mono text-[0.68rem] tracking-[0.12em] text-primary/70 hover:text-primary py-2 px-3">{user ? profile?.institution : "ACCESS"}</Link>
              </div>
              <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center gap-3 px-3"><ThemeToggle /><LanguageSwitcher /></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </AnimatePresence>
  );
};

export default NavBar;
