import { motion } from "framer-motion";
import { FlaskConical, GraduationCap, Layers, CornerDownRight } from "lucide-react";
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

const FACE_ENTRY: Record<TrinityFace, { path: string; label: string }> = {
  heaven_lab:  { path: "/lab",      label: "Lab — Retomar" },
  bridge_nova: { path: "/school",   label: "School — Retomar" },
  nexus_cria:  { path: "/workshop", label: "Creation — Retomar" },
};

function SessionAwareCTA() {
  const { session } = useSession();
  const isResume = session?.is_resume && session.re_entry_point?.startsWith('resume-swarm:');
  const resumeEntry = isResume && session ? FACE_ENTRY[session.active_face] ?? FACE_ENTRY.heaven_lab : null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {resumeEntry ? (
        <Link to={resumeEntry.path}
          className="font-mono text-[0.6rem] tracking-[0.12em] bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 uppercase">
          <CornerDownRight className="w-3.5 h-3.5" /> {resumeEntry.label}
        </Link>
      ) : (
        <Link to="/lab"
          className="font-mono text-[0.6rem] tracking-[0.12em] bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 uppercase">
          <FlaskConical className="w-3.5 h-3.5" /> Lab
        </Link>
      )}
      <Link to="/school"
        className="font-mono text-[0.6rem] tracking-[0.12em] border border-border text-foreground px-6 py-3 hover:bg-card transition-all duration-200 flex items-center gap-2 uppercase">
        <GraduationCap className="w-3.5 h-3.5" /> School
      </Link>
      <Link to="/workshop"
        className="font-mono text-[0.6rem] tracking-[0.12em] border border-border text-foreground px-6 py-3 hover:bg-card transition-all duration-200 flex items-center gap-2 uppercase">
        <Layers className="w-3.5 h-3.5" /> Creation
      </Link>
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

          <div className="relative z-10 mx-auto max-w-[1260px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.75, ease }}
              className="mb-10 text-center sm:mb-14"
            >
              <ChamberLabel text="Strategic Dossiers" />
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
                Active dossiers,{" "}
                <span style={{ color: "hsl(42 78% 52% / 0.9)" }}>world-scale intent.</span>
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
                Strategic systems already in motion, surfaced as living dossier
                matter inside one sovereign line.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {homeProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 46, scale: 0.985 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.08, duration: 0.68, ease }}
                >
                  <DossierCard project={project} index={i} />
                </motion.div>
              ))}
            </div>

            <div className="mt-12 sm:mt-16">
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
                "linear-gradient(180deg, hsl(var(--background) / 0.12) 0%, hsl(var(--background) / 0.42) 100%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease }}
            >
              <ChamberLabel text="Entrance Gate" />
              <h2
                className="font-serif"
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: "clamp(2rem, 7vw, 3.6rem)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "hsl(var(--rx-text-prime))",
                  lineHeight: 1.03,
                }}
              >
                Choose your{" "}
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
              <SessionAwareCTA />
            </motion.div>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
};

export default Index;
