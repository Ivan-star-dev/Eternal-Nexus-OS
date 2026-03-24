/**
 * motion/config.ts — Canonical Motion Law
 *
 * Single source of truth for all animation values.
 * Every component derives from here. Nothing is hardcoded elsewhere.
 *
 * Law: HEAVEN_LAB_REFERENCE_SURFACE.md · SYSTEM_FACE_CANON.md
 */

// ── Easing ────────────────────────────────────────────────────────────────────

/** Primary ease — smooth deceleration. Use for most reveals. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Entrance ease — slight anticipation on entry. */
export const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const;

/** Orbital ease — slow, breathing quality. Use for ambient loops. */
export const EASE_ORBITAL = [0.45, 0.05, 0.55, 0.95] as const;

// ── Duration ─────────────────────────────────────────────────────────────────

export const DUR = {
  /** Micro — hover states, icon transitions */
  micro:    0.18,
  /** Fast — small reveals, indicator pulses */
  fast:     0.35,
  /** Base — standard component reveal */
  base:     0.6,
  /** Slow — hero elements, first load */
  slow:     0.9,
  /** Cinematic — page-level, ambient transitions */
  cinematic: 1.4,
} as const;

// ── Stagger ───────────────────────────────────────────────────────────────────

export const STAGGER = {
  /** Tight — list items, metric cells */
  tight:  0.06,
  /** Base — section children */
  base:   0.12,
  /** Loose — hero children, spaced reveals */
  loose:  0.18,
} as const;

// ── Delay ─────────────────────────────────────────────────────────────────────

export const DELAY = {
  /** After globe load — Trinity + Proof wait for globe presence */
  afterGlobe:   1.2,
  /** Section reveal — slight offset after viewport entry */
  sectionReveal: 0.1,
  /** Scroll indicator — final element, waits for everything */
  scrollHint:   2.0,
} as const;

// ── Framer Motion Variants ────────────────────────────────────────────────────

export const variants = {
  /** Standard fade-up reveal — most section elements */
  fadeUp: {
    hidden:  { opacity: 0, y: 16 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: DUR.slow, delay, ease: EASE_OUT },
    }),
  },

  /** Fade-in only — overlays, labels, decorative elements */
  fadeIn: {
    hidden:  { opacity: 0 },
    visible: (delay = 0) => ({
      opacity: 1,
      transition: { duration: DUR.base, delay, ease: EASE_OUT },
    }),
  },

  /** Scale-in — proof metrics, counters */
  scaleIn: {
    hidden:  { opacity: 0, scale: 0.94 },
    visible: (delay = 0) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: DUR.slow, delay, ease: EASE_OUT },
    }),
  },

  /** Orbital ring — breathing animation for OrbitalChamber */
  orbitalBreathe: {
    rest:    { opacity: 0.35, scale: 1 },
    breathe: {
      opacity: [0.35, 0.6, 0.35],
      scale:   [1, 1.008, 1],
      transition: {
        duration: 4.5,
        ease: EASE_ORBITAL,
        repeat: Infinity,
        repeatType: "loop" as const,
      },
    },
  },

  /** Globe enter — initial appearance */
  globeEnter: {
    hidden:  { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: DUR.cinematic, ease: EASE_OUT },
    },
  },

  /** Page enter — top-level page transition */
  pageEnter: {
    hidden:  { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: DUR.base, ease: EASE_OUT },
    },
    exit: {
      opacity: 0,
      transition: { duration: DUR.fast, ease: EASE_IN_OUT },
    },
  },
} as const;

// ── Ambient Loop Configs ───────────────────────────────────────────────────────

/** Orbital ring pulse — subtle life in the chamber */
export const ORBITAL_PULSE = {
  opacity:    [0.3, 0.55, 0.3] as number[],
  scale:      [1, 1.012, 1] as number[],
  transition: {
    duration:   4.2,
    ease:       "easeInOut" as const,
    repeat:     Infinity,
    repeatType: "loop" as const,
  },
} as const;

/** Substrate grid pulse — data aliveness */
export const SUBSTRATE_PULSE = {
  opacity:    [0.018, 0.032, 0.018] as number[],
  transition: {
    duration:   6.0,
    ease:       "easeInOut" as const,
    repeat:     Infinity,
    repeatType: "loop" as const,
  },
} as const;
