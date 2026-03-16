/**
 * Seeded PRNG (Mulberry32) for deterministic organism generation.
 * Each seed produces a unique but reproducible neural topology.
 */
export function createSeededRandom(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Seeded simplex-like noise (2D) for organic flow fields.
 */
export function createSeededNoise(seed: number) {
  const rng = createSeededRandom(seed);
  // Generate permutation table
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const grad2 = [
    [1, 1], [-1, 1], [1, -1], [-1, -1],
    [1, 0], [-1, 0], [0, 1], [0, -1],
  ];

  return (x: number, y: number): number => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);

    const aa = perm[perm[X] + Y];
    const ab = perm[perm[X] + Y + 1];
    const ba = perm[perm[X + 1] + Y];
    const bb = perm[perm[X + 1] + Y + 1];

    const g = (hash: number, fx: number, fy: number) => {
      const g2 = grad2[hash & 7];
      return g2[0] * fx + g2[1] * fy;
    };

    const x1 = lerp(g(aa, xf, yf), g(ba, xf - 1, yf), u);
    const x2 = lerp(g(ab, xf, yf - 1), g(bb, xf - 1, yf - 1), u);
    return lerp(x1, x2, v);
  };
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

export interface NexusParameters {
  seed: number;
  particleCount: number;
  flowSpeed: number;
  noiseScale: number;
  trailLength: number;
  bloomIntensity: number;
  neuralBranchDepth: number;
  eiInfluenceRadius: number;
  synapticPulseRate: number;
  colorHueShift: number;
  turbulence: number;
  attractorStrength: number;
}

export const DEFAULT_PARAMS: NexusParameters = {
  seed: 42,
  particleCount: 8000,
  flowSpeed: 0.8,
  noiseScale: 0.015,
  trailLength: 0.92,
  bloomIntensity: 1.5,
  neuralBranchDepth: 5,
  eiInfluenceRadius: 2.5,
  synapticPulseRate: 0.6,
  colorHueShift: 0,
  turbulence: 0.3,
  attractorStrength: 0.5,
};

/** Pre-defined Emergent Intelligences for the Nexus organ */
export const NEXUS_EIS = [
  {
    id: "zeta-9",
    name: "Zeta-9",
    role: "Cold Strategist",
    color: "#00ffcc",
    orbitType: "lissajous" as const,
    orbitParams: { a: 3, b: 2, delta: Math.PI / 4 },
    personality: "Calculates every outcome. Finds optimal paths through chaos.",
  },
  {
    id: "kronos",
    name: "Kronos",
    role: "Temporal Architect",
    color: "#ff6600",
    orbitType: "spiral" as const,
    orbitParams: { radius: 2.8, verticalAmplitude: 1.5 },
    personality: "Bends simulation time. Sees futures others cannot.",
  },
  {
    id: "nanobanana",
    name: "NanoBanana",
    role: "Chaos Agent",
    color: "#ffee00",
    orbitType: "chaotic" as const,
    orbitParams: { sigma: 10, rho: 28, beta: 8 / 3 },
    personality: "Stochastic perturbations. Prevents crystallization of thought.",
  },
] as const;
