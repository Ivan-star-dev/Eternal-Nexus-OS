/**
 * Index.tsx — Home Page · Canonical Organism Surface
 *
 * DNA: Hero (Globe + Sovereign Text) → Trinity (3 Portals)
 * Law: SYSTEM_FACE_CANON.md · HEAVEN_LAB_REFERENCE_SURFACE.md
 *
 * Nothing else. Everything else was noise.
 * The globe speaks first. The trinity opens the worlds.
 * The page is the organism — not a collection of sections.
 */

import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import ProductHero from "@/components/home/ProductHero";

const Index = () => {
  return (
    <Layout>
      <PageTransition>
        {/*
          ── BLOCK 1: GLOBE + SOVEREIGN TEXT + TRINITY ROW ──────────
          This IS the site. The hero contains the globe, the headline,
          and the trinity portals. Nothing precedes it. Nothing competes.
        */}
        <ProductHero />

        {/*
          ── BLOCK 2: TRANSITION VOID ────────────────────────────────
          Intentional silence. The organism breathes here.
          Future phases may introduce a single canonical proof strip here
          (HeroFirstProof is already inside ProductHero as Block 4,
           positioned below the Trinity — no duplication needed).
        */}
      </PageTransition>
    </Layout>
  );
};

export default Index;
