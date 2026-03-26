/**
 * SchoolPage.tsx — Bridge Nova face
 *
 * Trinity: bridge_nova → "milestone · guidance · progression"
 * Route: /school
 *
 * Architecture: session face wired, routes live.
 * Surface stub: awaiting Cursor pass.
 *   → When Cursor builds: import SchoolSurface from "@/components/school/SchoolSurface"
 *     and replace SchoolSurfacePlaceholder with SchoolSurface.
 */

import { useEffect } from "react";
import { useSession } from "@/contexts/SessionContext";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";

function SchoolSurfacePlaceholder() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "hsl(216 50% 5%)" }}
    >
      <div className="text-center max-w-lg">
        <p className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/50 uppercase mb-4">
          BRIDGE NOVA · MASTERY LAYER
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-paper mb-4">
          Bridge Nova
        </h1>
        <p className="font-mono text-[0.55rem] tracking-[0.16em] text-paper-dim/50 uppercase mb-2">
          milestone · guidance · progression
        </p>
        <p className="text-sm text-paper-dim/40 font-light mt-6 leading-relaxed">
          The bridge. Where learners orient, traverse milestones, and transfer mastery.
        </p>
        <div className="mt-12 w-px h-16 bg-gold/20 mx-auto" />
      </div>
    </div>
  );
}

export default function SchoolPage() {
  const { startSession } = useSession();

  useEffect(() => {
    document.title = "Bridge Nova — Eternal Nexus OS";
    startSession("bridge-nova", "guided-progression");
    return () => { document.title = "Eternal Nexus OS"; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <PageTransition>
        <SchoolSurfacePlaceholder />
      </PageTransition>
    </Layout>
  );
}
