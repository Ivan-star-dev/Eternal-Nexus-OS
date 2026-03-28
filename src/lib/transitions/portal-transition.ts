/**
 * TRANSITION-SYSTEM-001
 * Spatial transition orchestration — preserves cognitive thread across portal shifts.
 * No URL-change feeling. Transitions carry context, not just route.
 * Browser-safe: no node imports.
 */

import { getCurrentBudget } from '@/lib/fidelity';

export type TransitionKind =
  | 'soft'      // minor shift — partial base retained, minimal animation
  | 'dominant'  // portal changes — context + artifacts carried, full scene shift
  | 'full'      // complete domain change — total world re-assembly
  | 'instant';  // no animation — fidelity:light or prefers-reduced-motion

export interface TransitionConfig {
  kind: TransitionKind;
  duration_ms: number;
  easing: string;
  carry_context: boolean;
  carry_artifacts: boolean;
  overlay_color: string;
  scale_out: number;
  blur_out: number;
}

const TRANSITION_CONFIGS: Record<TransitionKind, (duration: number) => TransitionConfig> = {
  soft: (d) => ({
    kind: 'soft',
    duration_ms: Math.round(d * 0.5),
    easing: 'ease-out',
    carry_context: true,
    carry_artifacts: true,
    overlay_color: 'transparent',
    scale_out: 1,
    blur_out: 0,
  }),
  dominant: (d) => ({
    kind: 'dominant',
    duration_ms: d,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    carry_context: true,
    carry_artifacts: true,
    overlay_color: 'rgba(0, 10, 20, 0.7)',
    scale_out: 0.97,
    blur_out: 4,
  }),
  full: (d) => ({
    kind: 'full',
    duration_ms: Math.round(d * 1.2),
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    carry_context: false,
    carry_artifacts: true,
    overlay_color: 'rgba(0, 0, 8, 0.92)',
    scale_out: 0.94,
    blur_out: 12,
  }),
  instant: (_d) => ({
    kind: 'instant',
    duration_ms: 0,
    easing: 'linear',
    carry_context: true,
    carry_artifacts: true,
    overlay_color: 'transparent',
    scale_out: 1,
    blur_out: 0,
  }),
};

export interface TransitionContext {
  from_portal: string;
  to_portal: string;
  subject?: string;
  re_entry_point?: string;
  open_panels?: string[];
}

export interface ResolvedTransition {
  config: TransitionConfig;
  framer_variants: {
    initial: Record<string, unknown>;
    animate: Record<string, unknown>;
    exit: Record<string, unknown>;
  };
}

/**
 * resolveTransition — picks the right transition kind based on portal shift + fidelity.
 */
export function resolveTransition(ctx: TransitionContext): ResolvedTransition {
  const budget = getCurrentBudget();
  const duration_ms = budget.transition_duration_ms;

  // Light tier or reduced motion — instant always
  if (budget.tier === 'light') {
    const config = TRANSITION_CONFIGS.instant(0);
    return { config, framer_variants: buildVariants(config) };
  }

  const kind = classifyTransitionKind(ctx.from_portal, ctx.to_portal);
  const config = TRANSITION_CONFIGS[kind](duration_ms);
  return { config, framer_variants: buildVariants(config) };
}

function classifyTransitionKind(from: string, to: string): TransitionKind {
  if (from === to) return 'soft';

  // Same portal family
  const nexusFamily = new Set(['nexus', 'home']);
  const labFamily = new Set(['lab', 'projects']);
  const dataFamily = new Set(['atlas', 'investor', 'founder']);

  if (nexusFamily.has(from) && nexusFamily.has(to)) return 'soft';
  if (labFamily.has(from) && labFamily.has(to)) return 'soft';
  if (dataFamily.has(from) && dataFamily.has(to)) return 'soft';

  // Cross-family shift
  const crossFamilyPairs = [
    ['nexus', 'lab'], ['lab', 'nexus'],
    ['nexus', 'atlas'], ['atlas', 'nexus'],
    ['lab', 'atlas'], ['atlas', 'lab'],
  ];
  const isCross = crossFamilyPairs.some(([f, t]) => f === from && t === to);
  if (isCross) return 'dominant';

  return 'full';
}

function buildVariants(config: TransitionConfig) {
  if (config.kind === 'instant') {
    return {
      initial: {},
      animate: {},
      exit: {},
    };
  }

  return {
    initial: {
      opacity: 0,
      scale: config.scale_out,
      filter: config.blur_out > 0 ? `blur(${config.blur_out}px)` : undefined,
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: config.duration_ms / 1000,
        ease: config.easing,
      },
    },
    exit: {
      opacity: 0,
      scale: config.scale_out,
      filter: config.blur_out > 0 ? `blur(${config.blur_out / 2}px)` : undefined,
      transition: {
        duration: (config.duration_ms * 0.7) / 1000,
        ease: 'ease-in',
      },
    },
  };
}
