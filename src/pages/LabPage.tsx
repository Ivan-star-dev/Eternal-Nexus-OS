/**
 * LabPage.tsx — Heaven Lab face
 *
 * Trinity: heaven_lab → "hypothesis · model · evidence"
 * Route: /lab
 *
 * Architecture: session face wired, routes live.
 * Surface stub: awaiting Cursor pass.
 *   → When Cursor builds: import LabSurface from "@/components/lab/LabSurface"
 *     and replace LabSurfacePlaceholder with LabSurface.
 */

import { useEffect } from "react";
import { useSession } from "@/contexts/SessionContext";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";

function LabSurfacePlaceholder() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "hsl(216 50% 5%)" }}
    >
      <div className="text-center max-w-lg">
        <p className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/50 uppercase mb-4">
          HEAVEN LAB · OBSERVATORY NODE-01
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-paper mb-4">
          Heaven Lab
        </h1>
        <p className="font-mono text-[0.55rem] tracking-[0.16em] text-paper-dim/50 uppercase mb-2">
          hypothesis · model · evidence
        </p>
        <p className="text-sm text-paper-dim/40 font-light mt-6 leading-relaxed">
          The observatory. Where hypotheses are built, models run, evidence surfaces.
        </p>
        <div className="mt-12 w-px h-16 bg-gold/20 mx-auto" />
      </div>
    </div>
  );
}

export default function LabPage() {
  const { startSession } = useSession();

  useEffect(() => {
    document.title = "Heaven Lab — Eternal Nexus OS";
    startSession("heaven-lab", "deep-investigation");
    return () => { document.title = "Eternal Nexus OS"; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <PageTransition>
        <LabSurfacePlaceholder />
      </PageTransition>
    </Layout>
  );
}
