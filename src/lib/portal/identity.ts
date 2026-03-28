/**
 * PORTAL-IDENTITY-001
 * Canonical spatial signature per portal.
 * Every portal has a distinct atmospheric DNA — no dilution, no shared defaults.
 *
 * Consumed by:
 *   - AtmosphereController (visual engine)
 *   - Transition system (which config to morph to)
 *   - LabHero, NexusSurface, etc. (their identity colors come from here)
 *
 * Canon: GAP-CLOSURE-V10-001 · Gap 2 (Portal Identity) + Gap 7 (Atmosphere)
 * @claude | 2026-03-28
 */

export type PortalId =
  | 'home'
  | 'lab'
  | 'nexus'
  | 'atlas'
  | 'school'
  | 'workshop'
  | 'founder'
  | 'investor'
  | 'research';

export interface PortalColorTokens {
  bg_base: string;         // Page background
  bg_surface: string;      // Card/surface background
  accent_primary: string;  // Primary accent (glows, CTAs, active states)
  accent_secondary: string;// Secondary accent (gradients, badges)
  text_primary: string;    // Heading text
  text_muted: string;      // Supporting text
  border_subtle: string;   // Subtle border
  glow_color: string;      // CSS glow / box-shadow color
}

export interface PortalAtmosphere {
  ambient_left: string;    // CSS radial-gradient (left/bottom area)
  ambient_right: string;   // CSS radial-gradient (right/top area)
  grid_color: string;      // Engineering grid line color
  particle_tint: string;   // 3D particle / dust tint
  grain_opacity: number;   // Grain overlay opacity (0-1)
  vignette_strength: number; // 0 (none) → 1 (full cinematic)
}

export interface PortalMotion {
  speed_multiplier: number;    // 1.0 = normal, 0.5 = slow, 1.5 = fast
  has_ambient_pulse: boolean;  // Slow breathing / pulse animation
  transition_kind: 'soft' | 'dominant' | 'full';
}

export interface PortalIdentitySignature {
  id: PortalId;
  name: string;
  tagline: string;
  mood: string;
  colors: PortalColorTokens;
  atmosphere: PortalAtmosphere;
  motion: PortalMotion;
}

// ─── Portal Signatures ────────────────────────────────────────────────────────

const SIGNATURES: Record<PortalId, PortalIdentitySignature> = {
  home: {
    id: 'home',
    name: 'Ruberra',
    tagline: 'The living system',
    mood: 'sovereign, grounded, orienting',
    colors: {
      bg_base: '#0a0a1a',
      bg_surface: 'rgba(255,255,255,0.03)',
      accent_primary: 'hsl(42 78% 45%)',       // gold
      accent_secondary: 'hsl(172 55% 28%)',     // teal
      text_primary: 'rgba(228,235,240,0.92)',
      text_muted: 'rgba(160,185,210,0.55)',
      border_subtle: 'rgba(212,175,55,0.12)',
      glow_color: 'rgba(212,175,55,0.15)',
    },
    atmosphere: {
      ambient_left: 'radial-gradient(ellipse 50% 60% at 0% 80%, rgba(212,175,55,0.08) 0%, transparent 65%)',
      ambient_right: 'radial-gradient(ellipse 40% 50% at 100% 10%, rgba(0,180,160,0.06) 0%, transparent 60%)',
      grid_color: 'rgba(212,175,55,0.025)',
      particle_tint: '#d4af37',
      grain_opacity: 0.025,
      vignette_strength: 0.4,
    },
    motion: {
      speed_multiplier: 1.0,
      has_ambient_pulse: true,
      transition_kind: 'soft',
    },
  },

  lab: {
    id: 'lab',
    name: 'Creation Lab',
    tagline: 'Where thought becomes executable form',
    mood: 'focused, precise, yours',
    colors: {
      bg_base: '#060c14',
      bg_surface: 'rgba(0,170,255,0.03)',
      accent_primary: '#00aaff',
      accent_secondary: '#00e5a0',
      text_primary: 'rgba(220,232,245,0.94)',
      text_muted: 'rgba(140,175,210,0.55)',
      border_subtle: 'rgba(0,170,255,0.1)',
      glow_color: 'rgba(0,170,255,0.2)',
    },
    atmosphere: {
      ambient_left: 'radial-gradient(ellipse 55% 60% at 0% 80%, rgba(0,80,200,0.13) 0%, transparent 65%)',
      ambient_right: 'radial-gradient(ellipse 45% 50% at 100% 20%, rgba(0,180,160,0.08) 0%, transparent 60%)',
      grid_color: 'rgba(0,170,255,0.03)',
      particle_tint: '#00aaff',
      grain_opacity: 0.02,
      vignette_strength: 0.25,
    },
    motion: {
      speed_multiplier: 0.9,
      has_ambient_pulse: false,
      transition_kind: 'dominant',
    },
  },

  nexus: {
    id: 'nexus',
    name: 'Nexus',
    tagline: 'The intelligence parliament',
    mood: 'powerful, neural, electric',
    colors: {
      bg_base: '#0a0a1a',
      bg_surface: 'rgba(34,255,170,0.03)',
      accent_primary: '#22ffaa',
      accent_secondary: '#00aaff',
      text_primary: 'rgba(228,235,240,0.95)',
      text_muted: 'rgba(150,200,180,0.5)',
      border_subtle: 'rgba(34,255,170,0.1)',
      glow_color: 'rgba(34,255,170,0.18)',
    },
    atmosphere: {
      ambient_left: 'radial-gradient(ellipse 60% 70% at 10% 60%, rgba(0,60,180,0.15) 0%, transparent 70%)',
      ambient_right: 'radial-gradient(ellipse 50% 50% at 90% 20%, rgba(0,200,140,0.07) 0%, transparent 60%)',
      grid_color: 'rgba(34,255,170,0.025)',
      particle_tint: '#22ffaa',
      grain_opacity: 0.03,
      vignette_strength: 0.5,
    },
    motion: {
      speed_multiplier: 1.2,
      has_ambient_pulse: true,
      transition_kind: 'dominant',
    },
  },

  atlas: {
    id: 'atlas',
    name: 'Atlas',
    tagline: 'The living world intelligence',
    mood: 'geospatial, commanding, deep time',
    colors: {
      bg_base: '#040810',
      bg_surface: 'rgba(74,144,226,0.04)',
      accent_primary: '#4a90e2',
      accent_secondary: '#00c8ff',
      text_primary: 'rgba(210,225,245,0.92)',
      text_muted: 'rgba(130,165,210,0.5)',
      border_subtle: 'rgba(74,144,226,0.12)',
      glow_color: 'rgba(74,144,226,0.2)',
    },
    atmosphere: {
      ambient_left: 'radial-gradient(ellipse 70% 80% at 50% 100%, rgba(10,40,120,0.25) 0%, transparent 60%)',
      ambient_right: 'radial-gradient(ellipse 40% 40% at 85% 15%, rgba(0,180,255,0.06) 0%, transparent 55%)',
      grid_color: 'rgba(74,144,226,0.02)',
      particle_tint: '#4a90e2',
      grain_opacity: 0.02,
      vignette_strength: 0.6,
    },
    motion: {
      speed_multiplier: 0.8,
      has_ambient_pulse: true,
      transition_kind: 'full',
    },
  },

  school: {
    id: 'school',
    name: 'School',
    tagline: 'A spatial academy where learning assembles itself',
    mood: 'warm, welcoming, luminous',
    colors: {
      bg_base: '#0d0a08',
      bg_surface: 'rgba(212,175,55,0.03)',
      accent_primary: 'hsl(42 78% 52%)',
      accent_secondary: 'hsl(36 65% 42%)',
      text_primary: 'rgba(235,228,215,0.92)',
      text_muted: 'rgba(190,175,150,0.55)',
      border_subtle: 'rgba(212,175,55,0.12)',
      glow_color: 'rgba(212,175,55,0.15)',
    },
    atmosphere: {
      ambient_left: 'radial-gradient(ellipse 50% 60% at 5% 70%, rgba(150,90,20,0.1) 0%, transparent 65%)',
      ambient_right: 'radial-gradient(ellipse 45% 45% at 95% 15%, rgba(200,150,40,0.07) 0%, transparent 55%)',
      grid_color: 'rgba(212,175,55,0.02)',
      particle_tint: '#d4af37',
      grain_opacity: 0.015,
      vignette_strength: 0.3,
    },
    motion: {
      speed_multiplier: 0.85,
      has_ambient_pulse: false,
      transition_kind: 'soft',
    },
  },

  workshop: {
    id: 'workshop',
    name: 'Workshop',
    tagline: 'Controlled power, elegant productivity',
    mood: 'steel, industrial, sharp',
    colors: {
      bg_base: '#080a0c',
      bg_surface: 'rgba(180,195,210,0.03)',
      accent_primary: '#a8bfcf',
      accent_secondary: '#6b8fa8',
      text_primary: 'rgba(215,225,232,0.9)',
      text_muted: 'rgba(140,160,175,0.5)',
      border_subtle: 'rgba(160,185,205,0.1)',
      glow_color: 'rgba(168,191,207,0.12)',
    },
    atmosphere: {
      ambient_left: 'radial-gradient(ellipse 45% 55% at 0% 60%, rgba(60,85,110,0.12) 0%, transparent 65%)',
      ambient_right: 'radial-gradient(ellipse 35% 40% at 100% 20%, rgba(80,100,120,0.07) 0%, transparent 55%)',
      grid_color: 'rgba(160,185,205,0.025)',
      particle_tint: '#a8bfcf',
      grain_opacity: 0.03,
      vignette_strength: 0.35,
    },
    motion: {
      speed_multiplier: 1.0,
      has_ambient_pulse: false,
      transition_kind: 'soft',
    },
  },

  founder: {
    id: 'founder',
    name: 'Founder',
    tagline: 'The architect and the vision',
    mood: 'intimate, authoritative, still',
    colors: {
      bg_base: '#080810',
      bg_surface: 'rgba(200,190,160,0.03)',
      accent_primary: 'hsl(42 60% 40%)',
      accent_secondary: 'hsl(36 50% 32%)',
      text_primary: 'rgba(230,224,212,0.92)',
      text_muted: 'rgba(175,165,145,0.5)',
      border_subtle: 'rgba(180,165,120,0.1)',
      glow_color: 'rgba(180,155,80,0.1)',
    },
    atmosphere: {
      ambient_left: 'radial-gradient(ellipse 40% 50% at 0% 80%, rgba(100,75,30,0.1) 0%, transparent 65%)',
      ambient_right: 'radial-gradient(ellipse 30% 35% at 100% 10%, rgba(120,95,40,0.06) 0%, transparent 55%)',
      grid_color: 'rgba(180,155,80,0.02)',
      particle_tint: '#b09a50',
      grain_opacity: 0.02,
      vignette_strength: 0.5,
    },
    motion: {
      speed_multiplier: 0.75,
      has_ambient_pulse: false,
      transition_kind: 'full',
    },
  },

  investor: {
    id: 'investor',
    name: 'Investor',
    tagline: 'Data, clarity, signal',
    mood: 'institutional, clear, trustworthy',
    colors: {
      bg_base: '#06080e',
      bg_surface: 'rgba(74,144,226,0.03)',
      accent_primary: '#3a7bd5',
      accent_secondary: '#00a8e0',
      text_primary: 'rgba(215,224,238,0.92)',
      text_muted: 'rgba(130,155,190,0.5)',
      border_subtle: 'rgba(58,123,213,0.1)',
      glow_color: 'rgba(58,123,213,0.15)',
    },
    atmosphere: {
      ambient_left: 'radial-gradient(ellipse 50% 60% at 0% 90%, rgba(20,50,130,0.12) 0%, transparent 65%)',
      ambient_right: 'radial-gradient(ellipse 35% 40% at 100% 15%, rgba(0,140,200,0.06) 0%, transparent 55%)',
      grid_color: 'rgba(58,123,213,0.025)',
      particle_tint: '#3a7bd5',
      grain_opacity: 0.02,
      vignette_strength: 0.35,
    },
    motion: {
      speed_multiplier: 0.9,
      has_ambient_pulse: false,
      transition_kind: 'soft',
    },
  },

  research: {
    id: 'research',
    name: 'Research',
    tagline: 'Deep investigation, spatial clarity',
    mood: 'scientific, precise, expansive',
    colors: {
      bg_base: '#070c10',
      bg_surface: 'rgba(0,200,220,0.03)',
      accent_primary: '#00c8d4',
      accent_secondary: '#00aaff',
      text_primary: 'rgba(210,230,240,0.92)',
      text_muted: 'rgba(130,175,200,0.5)',
      border_subtle: 'rgba(0,200,220,0.1)',
      glow_color: 'rgba(0,200,220,0.15)',
    },
    atmosphere: {
      ambient_left: 'radial-gradient(ellipse 55% 60% at 0% 70%, rgba(0,80,150,0.12) 0%, transparent 65%)',
      ambient_right: 'radial-gradient(ellipse 40% 45% at 100% 20%, rgba(0,170,200,0.07) 0%, transparent 55%)',
      grid_color: 'rgba(0,200,220,0.025)',
      particle_tint: '#00c8d4',
      grain_opacity: 0.02,
      vignette_strength: 0.3,
    },
    motion: {
      speed_multiplier: 0.95,
      has_ambient_pulse: false,
      transition_kind: 'dominant',
    },
  },
};

// ─── Public API ───────────────────────────────────────────────────────────────

export function getPortalIdentity(portalId: PortalId): PortalIdentitySignature {
  return SIGNATURES[portalId] ?? SIGNATURES.home;
}

export function getPortalFromPath(path: string): PortalId {
  const normalized = path.split('?')[0].split('#')[0];
  const MAP: Record<string, PortalId> = {
    '/': 'home',
    '/lab': 'lab',
    '/nexus': 'nexus',
    '/atlas': 'atlas',
    '/school': 'school',
    '/workshop': 'workshop',
    '/founder': 'founder',
    '/investor-portal': 'investor',
    '/research': 'research',
  };
  return MAP[normalized] ?? 'home';
}

export function getAllPortalIds(): PortalId[] {
  return Object.keys(SIGNATURES) as PortalId[];
}
