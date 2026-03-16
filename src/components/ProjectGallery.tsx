import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { ConceptImage } from "@/data/projects";
import { useLightbox } from "@/hooks/useLightbox";

interface GalleryImage {
  src: string;
  caption: string;
  category: "render" | "technical" | "concept" | "diagram";
}

interface ProjectGalleryProps {
  projectTitle: string;
  renderImage: string;
  technicalImages: string[];
  conceptImages?: ConceptImage[];
}

const categoryLabels: Record<string, string> = {
  render: "CGI RENDER",
  technical: "TECHNICAL DRAWING",
  concept: "CONCEPT",
  diagram: "ENGINEERING DIAGRAM",
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.95 }),
};

const ProjectGallery = ({ projectTitle, renderImage, technicalImages, conceptImages = [] }: ProjectGalleryProps) => {
  const [filter, setFilter] = useState<string>("all");

  const allImages: GalleryImage[] = [
    { src: renderImage, caption: `${projectTitle} — CGI Render`, category: "render" },
    ...technicalImages.map((src, i) => ({
      src,
      caption: `${projectTitle} — Technical Drawing ${String(i + 1).padStart(2, "0")}`,
      category: "technical" as const,
    })),
    ...conceptImages.map((img) => ({
      src: img.src,
      caption: img.caption,
      category: img.caption.toLowerCase().includes("diagram") || img.caption.toLowerCase().includes("corte") || img.caption.toLowerCase().includes("perfil")
        ? "diagram" as const
        : "concept" as const,
    })),
  ];

  const filtered = filter === "all" ? allImages : allImages.filter((img) => img.category === filter);
  const categories = ["all", ...Array.from(new Set(allImages.map((img) => img.category)))];

  const { lightboxIndex, direction, open, close, next, prev, swipeHandlers } = useLightbox(filtered.length);
  return (
    <section className="border-t border-border py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-16 lg:px-20 bg-card">
      <div className="max-w-[1200px] mx-auto">
        <span className="section-label">MEDIA GALLERY · {allImages.length} ASSETS</span>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-4 mb-2">
          Galeria <span className="text-primary">Visual</span>
        </h2>
        <div className="gold-rule mb-6 sm:mb-8" />

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`font-mono text-[0.52rem] tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors ${
                filter === cat
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {cat === "all" ? `ALL (${allImages.length})` : `${categoryLabels[cat] || cat} (${allImages.filter((i) => i.category === cat).length})`}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.div
                key={img.src}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="group relative cursor-pointer doc-border overflow-hidden bg-background"
                onClick={() => open(i)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.caption}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                  <ZoomIn className="w-5 h-5 text-primary" />
                  <span className="font-mono text-[0.45rem] tracking-[0.15em] text-primary uppercase">
                    {categoryLabels[img.category] || img.category}
                  </span>
                </div>
                {/* Category badge */}
                <div className="absolute top-1.5 left-1.5">
                  <span className="font-mono text-[0.4rem] tracking-[0.1em] uppercase bg-background/80 backdrop-blur-sm border border-border px-1.5 py-0.5 text-muted-foreground">
                    {categoryLabels[img.category] || img.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

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
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  src={filtered[lightboxIndex].src}
                  alt={filtered[lightboxIndex].caption}
                  className="max-w-[90vw] max-h-[75vh] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </AnimatePresence>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-lg text-center px-4">
                <span className="font-mono text-[0.48rem] tracking-[0.12em] text-primary uppercase block mb-1">
                  {categoryLabels[filtered[lightboxIndex].category]}
                </span>
                <p className="font-sans text-xs text-muted-foreground">
                  {filtered[lightboxIndex].caption}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProjectGallery;
