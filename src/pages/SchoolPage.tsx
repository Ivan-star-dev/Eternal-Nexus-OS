/**
 * SchoolPage.tsx — /school route
 * Bridge Nova face — stub page, ready for content.
 * @cursor | 2026-03-27
 */

import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";

export default function SchoolPage() {
  return (
    <Layout>
      <PageTransition>
        <section className="min-h-[60vh] flex items-center justify-center px-6">
          <div className="text-center">
            <span className="font-mono text-[0.5rem] tracking-[0.3em] uppercase text-muted-foreground block mb-3">
              Bridge Nova
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light italic text-foreground">
              Em construção.
            </h1>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
}
