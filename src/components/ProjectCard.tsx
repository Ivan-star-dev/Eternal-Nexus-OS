import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { EASE_OUT } from "@/lib/motion/config";

interface ProjectCardProps {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  country: string;
  status: string;
  classification: string;
  sectors: string[];
  image: string;
  metrics: { value: string; label: string }[];
}

const easeOutExpo = EASE_OUT;

const statusStyles: Record<string, string> = {
  "Active":      "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  "In Progress": "bg-gold/10 text-gold border border-gold/30",
  "Completed":   "bg-blue-500/20 text-blue-400 border border-blue-500/30",
};

const getStatusStyle = (status: string) =>
  statusStyles[status] ??
  "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";

const ProjectCard = ({
  id,
  number,
  title,
  subtitle,
  country,
  status,
  classification,
  sectors,
  image,
  metrics,
}: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 250, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 250, damping: 25 });
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["30%", "70%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["30%", "70%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: easeOutExpo }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={`/project/${id}`}
        className="block bg-ink-medium/40 border border-white/[0.05] rounded-sm hover:border-white/[0.12] hover:bg-ink-medium/60 transition-all duration-300 overflow-hidden group relative"
      >
        {/* Parallax glare overlay */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([x, y]) => `radial-gradient(circle at ${x} ${y}, hsl(var(--primary) / 0.08) 0%, transparent 60%)`
            ),
          }}
        />

        {/* Image thumbnail */}
        <div className="aspect-video bg-ink-medium/60 border-b border-white/[0.05] overflow-hidden relative">
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            style={{
              x: useTransform(mouseX, [-0.5, 0.5], [-8, 8]),
              y: useTransform(mouseY, [-0.5, 0.5], [-8, 8]),
              scale: 1.05,
            }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-deep via-ink-deep/40 to-transparent" />

          {/* Classification badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="stamp-classified text-[0.55rem] px-2 py-0.5"
            >
              {classification}
            </motion.span>
          </div>

          {/* Status badge */}
          <div className="absolute top-4 right-4">
            <span
              className={`font-mono text-[0.42rem] tracking-[0.12em] uppercase px-2 py-0.5 rounded-sm ${getStatusStyle(status)}`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="p-5">
          {/* Meta row */}
          <div className="font-mono text-[0.45rem] tracking-[0.15em] uppercase text-paper-dim/40 flex gap-3 mt-1">
            <span>{number}</span>
            <span>·</span>
            <span>{country}</span>
          </div>

          <h3 className="font-serif text-base font-light text-paper mt-1">
            {title}
          </h3>

          <p className="text-xs text-paper-dim/60 font-light leading-relaxed mt-2">
            {subtitle}
          </p>

          {/* Tech tags / sectors */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {sectors.map((sector, i) => (
              <motion.span
                key={sector}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.06 }}
                className="font-mono text-[0.42rem] tracking-[0.1em] uppercase border border-white/[0.06] px-2 py-0.5 text-paper-dim/40"
              >
                {sector}
              </motion.span>
            ))}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-px bg-white/[0.04] mt-4 border border-white/[0.05]">
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                className="bg-ink-medium/40 p-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.08 }}
              >
                <div className="font-serif text-lg font-light text-paper">
                  {metric.value}
                </div>
                <div className="font-mono text-[0.42rem] tracking-[0.15em] text-paper-dim/40 uppercase mt-1">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-4">
            <span className="font-mono text-[0.48rem] tracking-[0.15em] uppercase text-gold/70 hover:text-gold transition-colors duration-200">
              View Dossier →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
