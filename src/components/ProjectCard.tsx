import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { EASE_OUT } from "@/lib/motion/config";
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
        className="block border border-border bg-card hover:border-primary transition-all duration-300 group relative overflow-hidden"
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

        {/* Image with parallax depth */}
        <div className="relative h-52 overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
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
          <div className="absolute top-4 right-4">
            <span className="font-mono text-[0.6rem] tracking-[0.2em] text-teal-light flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-light animate-pulse-dot" />
              {status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <span className="section-label">{number} · {country}</span>
          <h3 className="font-serif text-xl font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="font-sans text-sm text-muted-foreground mt-1.5 leading-relaxed">
            {subtitle}
          </p>

          {/* Sectors */}
          <div className="flex flex-wrap gap-2 mt-4">
            {sectors.map((sector, i) => (
              <motion.span
                key={sector}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.06 }}
                className="font-mono text-[0.6rem] tracking-[0.1em] text-accent-foreground bg-accent/30 border border-accent/20 px-2 py-0.5 uppercase"
              >
                {sector}
              </motion.span>
            ))}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-px bg-border mt-6 border border-border">
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                className="bg-card p-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.08 }}
              >
                <div className="font-serif text-lg font-bold text-foreground">
                  {metric.value}
                </div>
                <div className="font-mono text-[0.55rem] tracking-[0.15em] text-muted-foreground uppercase mt-1">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
