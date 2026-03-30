import { motion } from "framer-motion";
import { ArrowRight, CornerDownRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { HomeProject } from "@/data/homeProjects";
import { useSession } from "@/contexts/SessionContext";
import { useSingleProjectPulse } from "@/hooks/useProjectPulse";

const ease = [0.16, 1, 0.3, 1] as const;

const statusColors: Record<string, string> = {
  ACTIVE: "hsl(172 55% 36% / 0.82)",
  RESEARCH: "hsl(42 78% 52% / 0.82)",
  PLANNING: "hsl(205 100% 52% / 0.85)",
};

const trinityPillar: Record<string, { label: string; color: string; borderColor: string }> = {
  ACTIVE: { label: "LAB", color: "hsl(172 48% 52% / 0.82)", borderColor: "hsl(172 55% 28% / 0.55)" },
  RESEARCH: { label: "SCHOOL", color: "hsl(42 78% 52% / 0.82)", borderColor: "hsl(42 78% 38% / 0.55)" },
  PLANNING: { label: "CREATION", color: "hsl(205 100% 52% / 0.85)", borderColor: "hsl(205 100% 38% / 0.55)" },
};

const trinityAura: Record<string, string> = {
  ACTIVE: "hsl(172 55% 36% / 0.14)",
  RESEARCH: "hsl(42 78% 52% / 0.14)",
  PLANNING: "hsl(205 100% 52% / 0.14)",
};

interface Props {
  project: HomeProject;
  index: number;
}

function useIsSessionProject(project: HomeProject): boolean {
  const { session } = useSession();
  if (!session?.subject) return false;
  const s = session.subject.toLowerCase();
  return (
    s === project.title.toLowerCase() ||
    s.includes(project.id.toLowerCase()) ||
    s.includes(project.title.toLowerCase())
  );
}

function DossierCard({ project, index }: Props) {
  const isSessionProject = useIsSessionProject(project);
  const { session } = useSession();
  const hasPriorMomentum = isSessionProject && !!session?.latest_fruit;
  const pillar = trinityPillar[project.status] ?? trinityPillar.ACTIVE;
  const pulse = useSingleProjectPulse(project.id);
  const reverseDesktop = index % 2 !== 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease }}
    >
      <Link to={`/project/${project.id}`} className="group block">
        <div
          className="relative overflow-hidden border transition-all duration-500 hover:-translate-y-[2px] hover:shadow-[0_24px_80px_-44px_hsl(42_78%_52%_/_0.55)]"
          style={{
            borderColor: isSessionProject ? "hsl(42 78% 52% / 0.35)" : "hsl(var(--rx-rim) / 0.72)",
            background:
              "linear-gradient(180deg, hsl(var(--background) / 0.42) 0%, hsl(var(--background) / 0.72) 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background: `radial-gradient(ellipse at ${reverseDesktop ? "82%" : "18%"} 24%, ${
                trinityAura[project.status] ?? trinityAura.ACTIVE
              }, transparent 66%)`,
            }}
          />
          <div
            className="pointer-events-none absolute left-0 right-0 top-0 h-[1px]"
            aria-hidden
            style={{
              background:
                "linear-gradient(to right, transparent, hsl(42 78% 52% / 0.42), transparent)",
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className={reverseDesktop ? "order-2 md:order-2" : "order-2 md:order-1"}>
              <div className="relative h-[210px] overflow-hidden sm:h-[250px] md:h-full md:min-h-[320px]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, hsl(var(--background) / 0.03) 0%, hsl(var(--background) / 0.58) 100%)",
                  }}
                />
                <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-5 sm:top-5">
                  <span
                    className="font-mono text-[9px] uppercase"
                    style={{
                      letterSpacing: "0.22em",
                      color: pillar.color,
                      background: "hsl(var(--background) / 0.7)",
                      border: `0.5px solid ${pillar.borderColor}`,
                      padding: "3px 8px",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    {pillar.label}
                  </span>
                  <span
                    className="font-mono text-[9px] uppercase"
                    style={{
                      letterSpacing: "0.18em",
                      color: statusColors[project.status] ?? statusColors.ACTIVE,
                      background: "hsl(var(--background) / 0.7)",
                      border: "0.5px solid hsl(var(--rx-rim) / 0.65)",
                      padding: "3px 8px",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    {project.status}
                  </span>
                </div>
                {pulse?.isLive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.82 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute bottom-4 right-4 flex items-center gap-1.5"
                    style={{
                      background: "hsl(var(--rx-electric) / 0.1)",
                      border: "0.5px solid hsl(var(--rx-electric) / 0.34)",
                      padding: "4px 8px",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <motion.span
                      animate={{ opacity: [0.45, 1, 0.45], scale: [0.85, 1.15, 0.85] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "999px",
                        background: "hsl(var(--rx-electric) / 0.9)",
                      }}
                    />
                    <span
                      className="font-mono text-[8px] uppercase"
                      style={{ letterSpacing: "0.18em", color: "hsl(var(--rx-electric) / 0.86)" }}
                    >
                      Live
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            <div className={reverseDesktop ? "order-1 md:order-1" : "order-1 md:order-2"}>
              <div className="relative flex h-full flex-col px-5 py-6 sm:px-7 sm:py-8 md:px-9 md:py-10">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span
                    className="font-mono text-[9px] uppercase"
                    style={{ letterSpacing: "0.24em", color: "hsl(var(--rx-text-ghost))" }}
                  >
                    {project.subtitle}
                  </span>
                  <span
                    className="font-mono text-[9px] tabular-nums"
                    style={{ letterSpacing: "0.16em", color: "hsl(42 78% 52% / 0.7)" }}
                  >
                    DOSSIER {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3
                  className="font-serif italic leading-[1.02]"
                  style={{
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                    fontSize: "clamp(1.8rem, 6.4vw, 3.1rem)",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    color: "hsl(var(--rx-text-prime))",
                  }}
                >
                  {project.title}
                </h3>

                <p
                  className="mt-4 max-w-[46ch] font-sans text-sm leading-relaxed sm:text-[15px]"
                  style={{
                    fontFamily: "Syne, system-ui, sans-serif",
                    color: "hsl(var(--rx-text-mid) / 0.95)",
                  }}
                >
                  {project.summary}
                </p>

                <div
                  className="mt-5 flex flex-wrap gap-x-3 gap-y-2"
                  style={{ color: "hsl(var(--rx-text-ghost) / 0.9)" }}
                >
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[9px] uppercase"
                      style={{ letterSpacing: "0.14em" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div
                  className="mt-7 flex items-center justify-between border-t pt-4"
                  style={{ borderColor: "hsl(var(--rx-rim) / 0.65)" }}
                >
                  {hasPriorMomentum ? (
                    <div
                      className="flex items-center gap-2 font-mono text-[10px] uppercase transition-all duration-200 group-hover:gap-3"
                      style={{ letterSpacing: "0.14em", color: "hsl(42 78% 52% / 0.86)" }}
                    >
                      <CornerDownRight className="h-3.5 w-3.5" />
                      Continue dossier
                    </div>
                  ) : (
                    <div
                      className="flex items-center gap-2 font-mono text-[10px] uppercase transition-all duration-200 group-hover:gap-3"
                      style={{ letterSpacing: "0.14em", color: pillar.color }}
                    >
                      Enter dossier
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  )}

                  {isSessionProject && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="shrink-0"
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "999px",
                        background: "hsl(42 78% 52% / 0.74)",
                      }}
                      title="Sessão anterior neste dossiê"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default DossierCard;
