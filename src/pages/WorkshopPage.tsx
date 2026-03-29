/**
 * WorkshopPage.tsx — Nexus Cria face
 *
 * Trinity: nexus_cria → "artefact · produce · ship"
 * Route: /workshop
 *
 * Architecture: session face wired, routes live.
 * Surface stub: awaiting Cursor pass.
 *   → When Cursor builds: import WorkshopSurface from "@/components/workshop/WorkshopSurface"
 *     and replace WorkshopSurfacePlaceholder with WorkshopSurface.
 */

import { useEffect } from "react";
import { useSession } from "@/contexts/SessionContext";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";

function WorkshopSurfacePlaceholder() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "hsl(216 50% 5%)" }}
    >
      <div className="text-center max-w-lg">
        <p className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/50 uppercase mb-4">
          NEXUS CRIA · CREATION LAYER
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-paper mb-4">
          Nexus Cria
        </h1>
        <p className="font-mono text-[0.55rem] tracking-[0.16em] text-paper-dim/50 uppercase mb-2">
          artefact · produce · ship
        </p>
        <p className="text-sm text-paper-dim/40 font-light mt-6 leading-relaxed">
          The forge. Where media, tools, and artefacts are produced and shipped into the world.
        </p>
        <div className="mt-12 w-px h-16 bg-gold/20 mx-auto" />
      </div>
    </div>
  );
}

export default function WorkshopPage() {
  const { startSession } = useSession();

  useEffect(() => {
    document.title = "Nexus Cria — Eternal Nexus OS";
    startSession("nexus-cria", "artefact-production");
    return () => { document.title = "Eternal Nexus OS"; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <PageTransition>
        <WorkshopSurfacePlaceholder />
      </PageTransition>
    </Layout>
  );
}
