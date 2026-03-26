import { motion } from "framer-motion";
import { Shield, FileText, MessageSquare, Boxes, Lock, Settings } from "lucide-react";
import { EASE_OUT } from "@/lib/motion/config";

const easeOutExpo = EASE_OUT;

const capabilities = [
  {
    num: "01",
    icon: Shield,
    title: "Government-Grade Access Control",
    desc: "Verified credentials with official entity code, country, ministry, and authorised representative. Every session is logged, attributed and stored.",
    category: "AUTHENTICATION",
  },
  {
    num: "02",
    icon: FileText,
    title: "Attributable Documents",
    desc: "Every download is registered against the accessing government. Documents can be edited in-session, with every change attributed by entity.",
    category: "WHITE PAPER",
  },
  {
    num: "03",
    icon: MessageSquare,
    title: "Structured Engagement",
    desc: "Financial bids, partnership offers, research contributions and political support can be formally submitted by authenticated governments.",
    category: "BIDS & INTEREST",
  },
  {
    num: "04",
    icon: Boxes,
    title: "Live Technical Visualisation",
    desc: "Government delegations can explore the system architecture in an interactive 3D simulation — six operational scenes, live telemetry, adjustable layers.",
    category: "3D SIMULATION",
  },
  {
    num: "05",
    icon: Lock,
    title: "Registered Ownership",
    desc: "Every project carries full IP attribution to its registered proprietor. Access does not confer licence. All concepts and financial models are legally protected.",
    category: "IP PROTECTION",
  },
  {
    num: "06",
    icon: Settings,
    title: "Live Project Management",
    desc: "The proprietor has a private workspace to add media, upload research, write notes, review access logs and manage bids — while the project remains live.",
    category: "OWNER WORKSPACE",
  },
];

const PlatformCapabilities = () => {
  return (
    <section className="border-t border-border py-16 md:py-24 px-6 md:px-20 bg-background relative">
      {/* Structural grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg,transparent,transparent 79px,hsl(var(--primary) / 0.4) 80px), repeating-linear-gradient(0deg,transparent,transparent 79px,hsl(var(--primary) / 0.4) 80px)",
        }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section-label"
        >
          PLATFORM CAPABILITIES
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="font-serif text-2xl md:text-4xl font-bold text-foreground mt-3 mb-2"
        >
          Built for Governments.{" "}
          <span className="text-muted-foreground font-light">Not for the Public.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-sans text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed mb-4"
        >
          Every feature on this platform exists to protect the proprietor's intellectual
          property while enabling credible, auditable engagement between sovereign entities
          and project leads.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="gold-rule mb-10 origin-left"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: easeOutExpo }}
              className="bg-card p-8 group hover:bg-secondary/40 transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[0.55rem] tracking-[0.2em] text-primary">
                  {cap.num} · {cap.category}
                </span>
              </div>
              <cap.icon className="w-5 h-5 text-primary/60 mb-4 group-hover:text-primary transition-colors" />
              <h3 className="font-serif text-lg font-bold text-foreground mb-3">
                {cap.title}
              </h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                {cap.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformCapabilities;
