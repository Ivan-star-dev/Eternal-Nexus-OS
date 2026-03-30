import { motion } from "framer-motion";
import { ArrowRight, FlaskConical, GraduationCap, Layers, CornerDownRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import DossierCard from "@/components/home/DossierCard";
import ProjectsLiveSection from "@/components/home/ProjectsLiveSection";
import ProductHero from "@/components/home/ProductHero";
import { homeProjects } from "@/data/homeProjects";
import { useSession } from "@/contexts/SessionContext";
import type { TrinityFace } from "@/lib/memory/types";

const ease = [0.22, 1, 0.36, 1] as const;

const FACE_ENTRY: Record<TrinityFace, { path: string; label: string; face: TrinityFace }> = {
  heaven_lab:  { path: "/lab",      label: "Lab — Retomar", face: "heaven_lab" },
  bridge_nova: { path: "/school",   label: "School — Retomar", face: "bridge_nova" },
  nexus_cria:  { path: "/workshop", label: "Creation — Retomar", face: "nexus_cria" },
};

function SessionAwareCTA() {
  const { session } = useSession();
  const isResume = session?.is_resume && session.re_entry_point?.startsWith('resume-swarm:');
  const resumeEntry = isResume && session ? FACE_ENTRY[session.active_face] ?? FACE_ENTRY.heaven_lab : null;
  const activeFace = isResume && session ? session.active_face : null;

  const domains: Array<{
    id: "school" | "lab" | "creation";
    face: TrinityFace;
    path: string;
    title: string;
    era: string;
    line: string;
    vein: string;
    Icon: typeof FlaskConical;
  }> = [
    {
      id: "school",
      face: "bridge_nova",
      path: "/school",
      title: "School",
      era: "Past · Memory",
      line: "Doctrine, lineage, and inherited intelligence.",
      vein: "hsl(42 78% 52%)",
      Icon: GraduationCap,
    },
    {
      id: "lab",
      face: "heaven_lab",
      path: "/lab",
      title: "Lab",
      era: "Present · Examination",
      line: "Signal extraction, tests, and reality judgment.",
      vein: "hsl(172 55% 36%)",
      Icon: FlaskConical,
    },
    {
      id: "creation",
      face: "nexus_cria",
      path: "/workshop",
      title: "Creation",
      era: "Future · Authorship",
      line: "Form, systems, and sovereign execution.",
      vein: "hsl(205 100% 52%)",
      Icon: Layers,
    },
  ];

  return (
    <div className="w-full">
      {resumeEntry && (
        <div className="mb-5 flex justify-center sm:mb-6">
          <div
            className="inline-flex items-center gap-2 border px-3 py-2"
            style={{
              borderColor: "hsl(42 78% 52% / 0.35)",
              background: "hsl(var(--background) / 0.62)",
            }}
          >
            <CornerDownRight className="h-3.5 w-3.5" style={{ color: "hsl(42 78% 52% / 0.82)" }} />
            <span
              className="font-mono text-[10px] uppercase"
              style={{ letterSpacing: "0.16em", color: "hsl(42 78% 52% / 0.84)" }}
            >
              Linha em continuidade: {resumeEntry.label}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {domains.map((domain) => {
          const isFocused = activeFace === domain.face;
          const thresholdLabel = isFocused ? "Resume domain" : "Enter domain";
          const Icon = domain.Icon;
          return (
            <Link key={domain.id} to={domain.path} className="group block">
              <div
                className="relative h-full overflow-hidden border p-5 transition-all duration-300 group-hover:-translate-y-0.5 sm:p-6"
                style={{
                  borderColor: isFocused ? domain.vein.replace(")", " / 0.58)") : "hsl(var(--rx-rim) / 0.75)",
                  background:
                    "linear-gradient(180deg, hsl(var(--background) / 0.42) 0%, hsl(var(--background) / 0.7) 100%)",
                  boxShadow: isFocused
                    ? `0 24px 70px -44px ${domain.vein.replace(")", " / 0.66)")}`
                    : "none",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  aria-hidden
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${domain.vein.replace(")", " / 0.12)")}, transparent 70%)`,
                  }}
                />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span
                      className="font-mono text-[9px] uppercase"
                      style={{ letterSpacing: "0.2em", color: domain.vein.replace(")", " / 0.82)") }}
                    >
                      {domain.era}
                    </span>
                    <Icon className="h-4 w-4" style={{ color: domain.vein.replace(")", " / 0.82)") }} />
                  </div>

                  <h3
                    className="font-serif italic leading-[1.02]"
                    style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontSize: "clamp(1.9rem, 7vw, 2.7rem)",
                      color: "hsl(var(--rx-text-prime))",
                    }}
                  >
                    {domain.title}
                  </h3>

                  <p
                    className="mt-3 font-sans text-sm leading-relaxed"
                    style={{
                      fontFamily: "Syne, system-ui, sans-serif",
                      color: "hsl(var(--rx-text-mid) / 0.93)",
                    }}
                  >
                    {domain.line}
                  </p>

                  <div
                    className="mt-6 inline-flex items-center justify-between border px-3 py-2"
                    style={{
                      borderColor: domain.vein.replace(")", " / 0.42)"),
                      color: domain.vein.replace(")", " / 0.9)"),
                    }}
                  >
                    <span className="font-mono text-[10px] uppercase" style={{ letterSpacing: "0.15em" }}>
                      {thresholdLabel}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ChamberLabel({ text }: { text: string }) {
  return (
    <div className="mb-6 flex items-center justify-center gap-4 sm:mb-8 sm:gap-6">
      <span
        className="block h-px"
        style={{
          width: "min(14vw, 92px)",
          background: "linear-gradient(to right, transparent, hsl(42 78% 52% / 0.3))",
        }}
      />
      <span
        className="font-mono text-[8px] uppercase sm:text-[9px]"
        style={{ letterSpacing: "0.32em", color: "hsl(42 78% 52% / 0.62)" }}
      >
        {text}
      </span>
      <span
        className="block h-px"
        style={{
          width: "min(14vw, 92px)",
          background: "linear-gradient(to left, transparent, hsl(42 78% 52% / 0.3))",
        }}
      />
    </div>
  );
}

function RitualMarker({ index }: { index: number }) {
  return (
    <div className="absolute left-1/2 top-2 z-20 hidden -translate-x-1/2 md:block" aria-hidden>
      <div
        className="flex h-7 w-7 items-center justify-center border"
        style={{
          borderColor: "hsl(42 78% 52% / 0.32)",
          background: "hsl(var(--background) / 0.82)",
          boxShadow: "0 0 24px -14px hsl(42 78% 52% / 0.75)",
        }}
      >
        <span
          className="font-mono text-[8px] tabular-nums"
          style={{ letterSpacing: "0.1em", color: "hsl(42 78% 52% / 0.8)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

const Index = () => {
  return (
    <Layout>
      <PageTransition>
        <ProductHero />
        <section
          id="dossiers"
          className="relative overflow-hidden border-t border-border/70 px-4 py-16 sm:px-6 sm:py-24 md:px-12 lg:px-16"
        >
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse at 50% -8%, hsl(42 78% 52% / 0.08) 0%, transparent 58%), radial-gradient(ellipse at 50% 88%, hsl(205 100% 52% / 0.06) 0%, transparent 62%)",
            }}
          />

          <div className="relative z-10 mx-auto max-w-[1300px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.75, ease }}
              className="mb-10 text-center sm:mb-14"
            >
              <ChamberLabel text="Sovereign Dossier Procession" />
              <h2
                className="font-serif"
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: "clamp(2rem, 8vw, 4.1rem)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "hsl(var(--rx-text-prime))",
                  lineHeight: 1.02,
                }}
              >
                Strategic dossiers,
                <br />
                <span style={{ color: "hsl(42 78% 52% / 0.9)" }}>ritual entry thresholds.</span>
              </h2>
              <p
                className="mx-auto mt-4 max-w-[680px] font-sans"
                style={{
                  fontFamily: "Syne, system-ui, sans-serif",
                  fontSize: "clamp(0.86rem, 2.9vw, 1rem)",
                  color: "hsl(var(--rx-text-mid) / 0.92)",
                  lineHeight: 1.7,
                }}
              >
                Not cards. Each dossier is a passage where memory, examination, and
                authorship acquire operational form.
              </p>
            </motion.div>

            <div className="relative mx-auto max-w-[1180px]">
              <div
                className="pointer-events-none absolute bottom-12 left-1/2 top-2 hidden w-px -translate-x-1/2 md:block"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, hsl(42 78% 52% / 0.22) 12%, hsl(var(--rx-rim) / 0.38) 56%, transparent)",
                }}
              />
              {homeProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 46, scale: 0.985 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.08, duration: 0.68, ease }}
                  className={i === 0 ? "" : "mt-8 sm:mt-10 md:mt-12"}
                >
                  <RitualMarker index={i} />
                  <DossierCard project={project} index={i} />
                </motion.div>
              ))}
            </div>

            <div className="mt-14 border-t border-border/60 pt-10 sm:mt-16 sm:pt-12">
              <ProjectsLiveSection inChamber />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-border/70 px-4 py-14 sm:px-6 sm:py-20 md:px-12 lg:px-16">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "linear-gradient(180deg, hsl(var(--background) / 0.12) 0%, hsl(var(--background) / 0.5) 100%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-[1160px]">
            <motion.div
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease }}
              className="mx-auto max-w-3xl text-center"
            >
              <ChamberLabel text="Entrance Gate" />
              <h2
                className="font-serif"
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: "clamp(2.2rem, 8.4vw, 4.3rem)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "hsl(var(--rx-text-prime))",
                  lineHeight: 1.03,
                }}
              >
                Choose your
                <br />
                <span style={{ color: "hsl(42 78% 52% / 0.9)" }}>sovereign domain.</span>
              </h2>
              <p
                className="mx-auto mb-9 mt-4 max-w-[620px] font-sans sm:mb-10"
                style={{
                  fontFamily: "Syne, system-ui, sans-serif",
                  fontSize: "clamp(0.86rem, 2.8vw, 1rem)",
                  color: "hsl(var(--rx-text-mid) / 0.9)",
                  lineHeight: 1.7,
                }}
              >
                Memory, examination, and authorship share one organismal core.
                Continue where your line already breathes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.72, ease }}
              className="relative mt-8 overflow-hidden border p-4 sm:mt-10 sm:p-6 md:p-8"
              style={{
                borderColor: "hsl(var(--rx-rim) / 0.72)",
                background:
                  "linear-gradient(180deg, hsl(var(--background) / 0.38) 0%, hsl(var(--background) / 0.7) 100%)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, hsl(42 78% 52% / 0.1) 0%, transparent 70%)",
                }}
              />
              <div className="relative z-10">
                <SessionAwareCTA />
              </div>
            </motion.div>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
};

export default Index;
