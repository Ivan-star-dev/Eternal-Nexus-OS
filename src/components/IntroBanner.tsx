import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Shield, Zap } from "lucide-react";
import heroBannerBg from "@/assets/hero-banner-bg.jpg";
import { EASE_OUT } from "@/lib/motion/config";
import { EASE_OUT } from "@/lib/motion/config";

const easeOutExpo = EASE_OUT;

const IntroBanner = () => {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <motion.img
        src={heroBannerBg}
        alt="Futuristic underwater infrastructure"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 12, ease: "easeOut" }}
      />

      {/* Multi-layer overlays for depth */}
      <div className="absolute inset-0 bg-background/70" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, hsl(var(--background)) 75%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--background) / 0.4) 0%, transparent 30%, transparent 60%, hsl(var(--background)) 100%)",
        }}
      />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--foreground) / 0.1) 2px, transparent 4px)",
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 99px, hsl(var(--primary)) 100px), repeating-linear-gradient(90deg, transparent, transparent 99px, hsl(var(--primary)) 100px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1000px] mx-auto px-6 md:px-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: easeOutExpo }}
          className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-4 py-2 mb-8 backdrop-blur-sm"
        >
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
          <span className="font-mono text-[0.62rem] tracking-[0.2em] text-primary uppercase">
            SOVEREIGN DIGITAL INFRASTRUCTURE · EST. 2026
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.2, ease: easeOutExpo }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[0.9] mb-6"
        >
          Redefining{" "}
          <span className="relative inline-block">
            <span className="text-primary">Infrastructure</span>
            <motion.div
              className="absolute -bottom-1 left-0 h-[2px] bg-primary"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.4, duration: 0.8, ease: easeOutExpo }}
              style={{ transformOrigin: "left" }}
            />
          </span>
          <br />
          <span className="text-muted-foreground font-light text-[0.6em]">
            for the Next Century
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: easeOutExpo }}
          className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Strategic mega-project development bridging engineering innovation with
          institutional governance. Modular, reversible, sovereign — built for
          governments that think in generations.
        </motion.p>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8, ease: easeOutExpo }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          {[
            { icon: Globe, label: "Global Scale" },
            { icon: Shield, label: "Government Grade" },
            { icon: Zap, label: "Future-Ready" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-4 py-2 border border-border bg-card/50 backdrop-blur-sm"
            >
              <item.icon className="w-3.5 h-3.5 text-primary" />
              <span className="font-mono text-[0.62rem] tracking-[0.1em] text-foreground/80 uppercase">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8, ease: easeOutExpo }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/#projects"
            className="group flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-mono text-[0.72rem] tracking-[0.12em] uppercase hover:bg-primary/90 transition-colors"
          >
            EXPLORE PROJECTS
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/access"
            className="flex items-center gap-2 px-8 py-3.5 border border-border text-foreground font-mono text-[0.72rem] tracking-[0.12em] uppercase hover:border-primary hover:text-primary transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            GOVERNMENT ACCESS
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[0.5rem] tracking-[0.2em] text-muted-foreground/40 uppercase">
            SCROLL
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default IntroBanner;
