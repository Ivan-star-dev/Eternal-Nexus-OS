import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, Filter, Grid3X3, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import projectData, { type ProjectData, type ConceptImage } from "@/data/projects";
import { useLightbox } from "@/hooks/useLightbox";
import { EASE_OUT } from "@/lib/motion/config";

interface GalleryImage {
  src: string;
  caption: string;
  category: "render" | "technical" | "concept" | "diagram";
  projectId: string;
  projectTitle: string;
  projectNumber: string;
}

const categoryLabels: Record<string, string> = {
  render: "CGI RENDER",
  technical: "TECHNICAL DRAWING",
  concept: "CONCEPT",
  diagram: "ENGINEERING DIAGRAM",
};

function buildGalleryImages(): GalleryImage[] {
  const images: GalleryImage[] = [];

  for (const [id, project] of Object.entries(projectData) as [string, ProjectData][]) {
    // Render
    images.push({
      src: project.renderImage,
      caption: `${project.title} — CGI Render`,
      category: "render",
      projectId: id,
      projectTitle: project.title,
      projectNumber: project.number,
    });

    // Technical
    project.technicalImages.forEach((src, i) => {
      images.push({
        src,
        caption: `${project.title} — Technical Drawing ${String(i + 1).padStart(2, "0")}`,
        category: "technical",
        projectId: id,
        projectTitle: project.title,
        projectNumber: project.number,
      });
    });

    // Concept images
    (project.conceptImages || []).forEach((img) => {
      const isDiagram =
        img.caption.toLowerCase().includes("diagram") ||
        img.caption.toLowerCase().includes("corte") ||
        img.caption.toLowerCase().includes("perfil");
      images.push({
        src: img.src,
        caption: img.caption,
        category: isDiagram ? "diagram" : "concept",
        projectId: id,
        projectTitle: project.title,
        projectNumber: project.number,
      });
    });
  }

  return images;
}

const Gallery = () => {
  const allImages = useMemo(() => buildGalleryImages(), []);
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [columns, setColumns] = useState<3 | 4>(4);

  // V3: document title
  useEffect(() => {
    document.title = "Gallery — Eternal Nexus OS";
    return () => { document.title = "Eternal Nexus OS"; };
  }, []);

  const projectIds = useMemo(() => {
    const ids = Array.from(new Set(allImages.map((img) => img.projectId)));
    return ids;
  }, [allImages]);

  const projectNames = useMemo(() => {
    const map: Record<string, { title: string; number: string }> = {};
    allImages.forEach((img) => {
      map[img.projectId] = { title: img.projectTitle, number: img.projectNumber };
    });
    return map;
  }, [allImages]);

  const categories = useMemo(
    () => Array.from(new Set(allImages.map((img) => img.category))),
    [allImages]
  );

  const filtered = useMemo(() => {
    return allImages.filter((img) => {
      if (projectFilter !== "all" && img.projectId !== projectFilter) return false;
      if (categoryFilter !== "all" && img.category !== categoryFilter) return false;
      return true;
    });
  }, [allImages, projectFilter, categoryFilter]);

  const { lightboxIndex, direction, open, close, next, prev, swipeHandlers } = useLightbox(filtered.length);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.95 }),
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-28 sm:pt-32 pb-12 px-4 sm:px-6 md:px-16 lg:px-20 border-b border-border">
        <div className="max-w-[1400px] mx-auto">
          {/* V3: section label — font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase */}
          <span className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase">
            MEDIA ARCHIVE · {allImages.length} ASSETS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-2">
            Galeria <span className="text-primary">Global</span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Arquivo visual completo de todos os projetos do portfólio Next Path Infra — renders, desenhos técnicos, conceitos e diagramas de engenharia.
          </p>
          <div className="gold-rule mt-6" />
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border py-4 px-4 sm:px-6 md:px-16 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Project filter */}
            <div className="flex-1">
              <span className="font-mono text-[0.45rem] tracking-[0.15em] text-muted-foreground uppercase block mb-2">
                <Filter className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                PROJECT
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setProjectFilter("all")}
                  className={`font-mono text-[0.48rem] tracking-[0.12em] uppercase px-2.5 py-1 border transition-colors ${
                    projectFilter === "all"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  ALL ({allImages.length})
                </button>
                {projectIds.map((id) => {
                  const count = allImages.filter((img) => img.projectId === id).length;
                  return (
                    <button
                      key={id}
                      onClick={() => setProjectFilter(id)}
                      className={`font-mono text-[0.48rem] tracking-[0.12em] uppercase px-2.5 py-1 border transition-colors ${
                        projectFilter === id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                      }`}
                    >
                      {projectNames[id]?.number} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category filter */}
            <div className="flex-1">
              <span className="font-mono text-[0.45rem] tracking-[0.15em] text-muted-foreground uppercase block mb-2">
                MEDIA TYPE
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={`font-mono text-[0.48rem] tracking-[0.12em] uppercase px-2.5 py-1 border transition-colors ${
                    categoryFilter === "all"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  ALL
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`font-mono text-[0.48rem] tracking-[0.12em] uppercase px-2.5 py-1 border transition-colors ${
                      categoryFilter === cat
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                    }`}
                  >
                    {categoryLabels[cat] || cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid toggle */}
            <div className="flex gap-1">
              <button
                onClick={() => setColumns(3)}
                className={`p-1.5 border transition-colors ${columns === 3 ? "border-primary text-primary" : "border-border text-muted-foreground"}`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setColumns(4)}
                className={`p-1.5 border transition-colors ${columns === 4 ? "border-primary text-primary" : "border-border text-muted-foreground"}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 font-mono text-[0.45rem] tracking-[0.12em] text-muted-foreground uppercase">
            {filtered.length} {filtered.length === 1 ? "asset" : "assets"}
            {projectFilter !== "all" && ` · ${projectNames[projectFilter]?.title}`}
            {categoryFilter !== "all" && ` · ${categoryLabels[categoryFilter]}`}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-16 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          {/* V3: tight grid — gap-1 md:gap-2 */}
          <div
            className={`grid gap-1 md:gap-2 ${
              columns === 3
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            }`}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((img, i) => (
                <motion.div
                  key={img.src}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.5) }}
                  className="group relative cursor-pointer doc-border overflow-hidden bg-background"
                  onClick={() => open(i)}
                >
                  <div className={`overflow-hidden ${columns === 3 ? "aspect-[3/2]" : "aspect-[4/3]"}`}>
                    <img
                      src={img.src}
                      alt={img.caption}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* V3: hover overlay — bg-ink-dark/70 backdrop-blur-sm, caption font-mono text-[0.48rem] */}
                  <div className="absolute inset-0 bg-ink-dark/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-3">
                    <ZoomIn className="w-5 h-5 text-primary" />
                    <span className="font-mono text-[0.48rem] tracking-[0.15em] text-primary uppercase text-center">
                      {categoryLabels[img.category]}
                    </span>
                    <span className="font-mono text-[0.48rem] tracking-[0.1em] text-paper-dim/60 uppercase">
                      {img.projectNumber}
                    </span>
                    <span className="font-mono text-[0.48rem] tracking-[0.08em] text-paper-dim/40 text-center line-clamp-2 mt-0.5">
                      {img.caption}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-1.5 left-1.5 flex gap-1">
                    <span className="font-mono text-[0.38rem] tracking-[0.1em] uppercase bg-background/80 backdrop-blur-sm border border-border px-1.5 py-0.5 text-primary">
                      {img.projectNumber}
                    </span>
                    <span className="font-mono text-[0.38rem] tracking-[0.1em] uppercase bg-background/80 backdrop-blur-sm border border-border px-1.5 py-0.5 text-muted-foreground">
                      {categoryLabels[img.category]}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <span className="font-mono text-[0.55rem] tracking-[0.15em] text-muted-foreground uppercase">
                No assets match the selected filters
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-md flex flex-col items-center justify-center"
            onClick={close}
            {...swipeHandlers}
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 p-2 border border-border bg-card hover:bg-secondary transition-colors z-10"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            <div className="absolute top-4 left-4 font-mono text-[0.55rem] tracking-[0.15em] text-muted-foreground z-10">
              {lightboxIndex + 1} / {filtered.length}
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 border border-border bg-card/80 hover:bg-secondary transition-colors z-10 hidden sm:block"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 border border-border bg-card/80 hover:bg-secondary transition-colors z-10 hidden sm:block"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={filtered[lightboxIndex].src}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: EASE_OUT }}
                src={filtered[lightboxIndex].src}
                alt={filtered[lightboxIndex].caption}
                className="max-w-[90vw] max-h-[75vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-lg text-center px-4">
              <Link
                to={`/project/${filtered[lightboxIndex].projectId}`}
                onClick={(e) => e.stopPropagation()}
                className="font-mono text-[0.45rem] tracking-[0.12em] text-primary uppercase hover:underline block mb-1"
              >
                {filtered[lightboxIndex].projectNumber} · {filtered[lightboxIndex].projectTitle}
              </Link>
              <span className="font-mono text-[0.42rem] tracking-[0.12em] text-primary/60 uppercase block mb-1">
                {categoryLabels[filtered[lightboxIndex].category]}
              </span>
              <p className="font-sans text-xs text-muted-foreground">
                {filtered[lightboxIndex].caption}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Gallery;
