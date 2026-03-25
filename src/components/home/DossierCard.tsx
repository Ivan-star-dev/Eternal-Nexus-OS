import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { HomeProject } from "@/data/homeProjects";
import { EASE_OUT } from "@/lib/motion/config";

const ease = EASE_OUT;

const statusColors: Record<string, string> = {
  ACTIVE: "bg-accent text-accent-foreground",
  RESEARCH: "bg-primary/20 text-primary",
  PLANNING: "bg-secondary text-secondary-foreground",
};

interface Props {
  project: HomeProject;
  index: number;
}

const DossierCard = ({ project, index }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ y: -6 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay: index * 0.1, ease }}
  >
    <Link to={`/project/${project.id}`} className="group block">
      <div className="relative border border-border bg-card overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_40px_-12px_hsl(var(--primary)/0.25)] tribunal-approved morabeza-glow">
        {/* Gold top-border glow on hover */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/60 transition-all duration-700" />
        
        {/* Shimmer sweep overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(105deg,transparent_40%,hsl(var(--primary)/0.04)_45%,hsl(var(--primary)/0.08)_50%,hsl(var(--primary)/0.04)_55%,transparent_60%)] bg-[length:200%_100%] group-hover:animate-shimmer" />

        {/* Image */}
        <div className="relative h-48 sm:h-52 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:translate-y-[-2px]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <span className={`absolute top-3 right-3 font-mono text-[0.5rem] tracking-[0.15em] px-2 py-1 uppercase ${statusColors[project.status] || statusColors.ACTIVE}`}>
            {project.status}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <p className="font-mono text-[0.5rem] tracking-[0.2em] text-muted-foreground uppercase mb-2">
            {project.subtitle}
          </p>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
            {project.summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[0.48rem] tracking-[0.1em] bg-secondary text-secondary-foreground px-2 py-0.5 uppercase"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 font-mono text-[0.55rem] tracking-[0.12em] text-primary uppercase group-hover:gap-3 transition-all">
            Ler Dossiê <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default DossierCard;
