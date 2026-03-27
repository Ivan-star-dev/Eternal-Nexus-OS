/**
 * ResearchFeed.tsx
 * Vertical list of research items with filter bar and animated entrance.
 *
 * Canon: V5-RESEARCH-IMPL-001 · K-07 IMPL · K-08 PIPELINE
 * @cursor | 2026-03-27
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { useResearchFeed, type ResearchCategory } from "@/hooks/useResearchFeed";

// ─── Constants ────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

const CATEGORY_COLORS: Record<ResearchCategory, string> = {
  Climate: "#00aaff",
  Seismic: "#ff6b35",
  Infrastructure: "#a78bfa",
  AI: "#00e5a0",
  Social: "#fbbf24",
};

type FilterOption = "All" | ResearchCategory;

const FILTER_OPTIONS: FilterOption[] = [
  "All",
  "Climate",
  "Seismic",
  "Infrastructure",
  "AI",
  "Social",
];

// ─── Variants ─────────────────────────────────────────────────────────────────

const LIST_VARIANTS = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.25, ease: EASE },
  },
};

// ─── Filter bar ───────────────────────────────────────────────────────────────

interface FilterBarProps {
  active: FilterOption;
  onSelect: (filter: FilterOption) => void;
}

function FilterBar({ active, onSelect }: FilterBarProps) {
  return (
    <div
      className="flex flex-wrap gap-2 mb-8"
      role="tablist"
      aria-label="Filter research by category"
    >
      {FILTER_OPTIONS.map((option) => {
        const isActive = active === option;
        const color =
          option === "All" ? "#00aaff" : CATEGORY_COLORS[option as ResearchCategory];

        return (
          <motion.button
            key={option}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(option)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "6px 14px",
              border: isActive
                ? `1px solid ${color}`
                : "1px solid rgba(255,255,255,0.08)",
              color: isActive ? color : "rgba(228,235,240,0.35)",
              background: isActive
                ? `${color}14`
                : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease",
              outline: "none",
            }}
          >
            {option}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Category tag ─────────────────────────────────────────────────────────────

interface CategoryTagProps {
  category: ResearchCategory;
}

function CategoryTag({ category }: CategoryTagProps) {
  const color = CATEGORY_COLORS[category];
  return (
    <span
      style={{
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "8px",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color,
        border: `1px solid ${color}40`,
        background: `${color}12`,
        padding: "3px 10px",
        flexShrink: 0,
      }}
    >
      {category}
    </span>
  );
}

// ─── Research card ────────────────────────────────────────────────────────────

interface ResearchCardProps {
  id: string;
  title: string;
  category: ResearchCategory;
  abstract: string;
  date: string;
  readTime: number;
}

function ResearchCard({
  title,
  category,
  abstract,
  date,
  readTime,
}: ResearchCardProps) {
  const [hovered, setHovered] = useState(false);

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.article
      variants={ITEM_VARIANTS}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: hovered
          ? "rgba(255,255,255,0.03)"
          : "rgba(255,255,255,0.01)",
        border: hovered
          ? "1px solid rgba(0,170,255,0.15)"
          : "1px solid rgba(255,255,255,0.06)",
        padding: "24px",
        transition: "all 0.25s ease",
        cursor: "default",
      }}
    >
      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <CategoryTag category={category} />
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "8px",
            letterSpacing: "0.15em",
            color: "rgba(228,235,240,0.22)",
            textTransform: "uppercase",
          }}
        >
          {formattedDate}
        </span>
        <span
          className="flex items-center gap-1"
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "8px",
            letterSpacing: "0.12em",
            color: "rgba(228,235,240,0.18)",
            textTransform: "uppercase",
          }}
        >
          <Clock style={{ width: "9px", height: "9px" }} />
          {readTime} min
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "clamp(15px, 2vw, 18px)",
          fontWeight: 600,
          color: "rgba(228,235,240,0.88)",
          lineHeight: 1.35,
          marginBottom: "10px",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>

      {/* Abstract — 2 lines clamped */}
      <p
        style={{
          fontFamily: "Syne, system-ui, sans-serif",
          fontSize: "13px",
          color: "rgba(228,235,240,0.42)",
          lineHeight: 1.65,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          marginBottom: "16px",
        }}
      >
        {abstract}
      </p>

      {/* Read CTA */}
      <motion.button
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2"
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "9px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#00aaff",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          outline: "none",
        }}
        aria-label={`Read: ${title}`}
      >
        Read
        <ArrowRight style={{ width: "11px", height: "11px" }} />
      </motion.button>
    </motion.article>
  );
}

// ─── ResearchFeed ─────────────────────────────────────────────────────────────

interface ResearchFeedProps {
  /** Show the filter bar (default: true) */
  showFilter?: boolean;
  /** Initial category filter */
  initialCategory?: FilterOption;
}

export default function ResearchFeed({
  showFilter = true,
  initialCategory = "All",
}: ResearchFeedProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>(initialCategory);
  const { filterByCategory } = useResearchFeed();

  const items = filterByCategory(activeFilter === "All" ? "All" : activeFilter as ResearchCategory);

  return (
    <div>
      {showFilter && (
        <FilterBar active={activeFilter} onSelect={setActiveFilter} />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          variants={LIST_VARIANTS}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="flex flex-col gap-3"
        >
          {items.map((item) => (
            <ResearchCard key={item.id} {...item} />
          ))}
        </motion.div>
      </AnimatePresence>

      {items.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "11px",
            color: "rgba(228,235,240,0.25)",
            textAlign: "center",
            padding: "40px 0",
            letterSpacing: "0.12em",
          }}
        >
          No research items in this category yet.
        </motion.p>
      )}
    </div>
  );
}
