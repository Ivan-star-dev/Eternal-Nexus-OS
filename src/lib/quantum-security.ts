/**
 * Quantum-Resistant Security Module — ML-KEM-768 + ML-DSA-65
 * Uses @noble/post-quantum (NIST FIPS-203/204 compliant)
 * + Multi-objective Genetic Algorithm optimizer
 */
import { ml_kem768 } from "@noble/post-quantum/ml-kem.js";
import { ml_dsa65 } from "@noble/post-quantum/ml-dsa.js";
import { randomBytes } from "@noble/post-quantum/utils.js";

// ═══ KEY ENCAPSULATION (ML-KEM-768) ═══
export async function generateKEMKeyPair() {
  const seed = randomBytes(64);
  const { publicKey, secretKey } = ml_kem768.keygen(seed);
  return { publicKey, secretKey };
}

export function encapsulate(publicKey: Uint8Array) {
  return ml_kem768.encapsulate(publicKey);
}

export function decapsulate(cipherText: Uint8Array, secretKey: Uint8Array) {
  return ml_kem768.decapsulate(cipherText, secretKey);
}

// ═══ DIGITAL SIGNATURE (ML-DSA-65) ═══
export function generateDSAKeyPair(seed?: Uint8Array) {
  const s = seed ?? randomBytes(32);
  return ml_dsa65.keygen(s);
}

export function signMessage(message: Uint8Array, secretKey: Uint8Array) {
  return ml_dsa65.sign(secretKey, message);
}

export function verifySignature(
  publicKey: Uint8Array,
  message: Uint8Array,
  signature: Uint8Array
) {
  return ml_dsa65.verify(publicKey, message, signature);
}

// ═══ INTEGRITY HASH (SHA-256) ═══
export async function sha256(data: string): Promise<string> {
  const encoded = new TextEncoder().encode(data);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ═══ ANOMALY DETECTION ═══
export function checkAnomaly(drift: number, threshold = 0.05): boolean {
  return Math.abs(drift) > threshold;
}

// ═══ MULTI-OBJECTIVE GA OPTIMIZER ═══
export interface GAIndividual {
  energy: number;
  co2: number;
  cost: number;
  fitness?: number;
}

export interface GAConfig {
  populationSize?: number;
  generations?: number;
  eliteRatio?: number;
  mutationRate?: number;
}

export function runGAOptimization(config: GAConfig = {}): {
  best: GAIndividual;
  population: GAIndividual[];
  history: { gen: number; bestFitness: number; avgFitness: number }[];
} {
  const {
    populationSize = 60,
    generations = 40,
    eliteRatio = 0.15,
    mutationRate = 0.1,
  } = config;

  const eliteCount = Math.max(2, Math.floor(populationSize * eliteRatio));
  const history: { gen: number; bestFitness: number; avgFitness: number }[] = [];

  // Fitness: maximize energy, minimize co2 + cost
  const fitness = (ind: GAIndividual) =>
    ind.energy / 10000 - (ind.co2 / 5000) * 0.4 - (ind.cost / 10000) * 0.3;

  // Initialize population
  let population: GAIndividual[] = Array.from({ length: populationSize }, () => ({
    energy: Math.random() * 10000,
    co2: Math.random() * 5000,
    cost: Math.random() * 10000,
  }));

  for (let gen = 0; gen < generations; gen++) {
    // Evaluate fitness
    population.forEach((ind) => (ind.fitness = fitness(ind)));
    population.sort((a, b) => (b.fitness ?? 0) - (a.fitness ?? 0));

    const avgFitness =
      population.reduce((s, i) => s + (i.fitness ?? 0), 0) / population.length;
    history.push({ gen, bestFitness: population[0].fitness ?? 0, avgFitness });

    // Elitism
    const elite = population.slice(0, eliteCount);
    const newPop = [...elite];

    // Crossover + mutation
    while (newPop.length < populationSize) {
      const p1 = elite[Math.floor(Math.random() * eliteCount)];
      const p2 = elite[Math.floor(Math.random() * eliteCount)];
      const crossover = Math.random();

      const child: GAIndividual = {
        energy: crossover * p1.energy + (1 - crossover) * p2.energy,
        co2: crossover * p1.co2 + (1 - crossover) * p2.co2,
        cost: crossover * p1.cost + (1 - crossover) * p2.cost,
      };

      // Mutation
      if (Math.random() < mutationRate) {
        child.energy += (Math.random() - 0.5) * 1000;
        child.co2 += (Math.random() - 0.5) * 500;
        child.cost += (Math.random() - 0.5) * 800;
      }

      // Clamp
      child.energy = Math.max(0, Math.min(10000, child.energy));
      child.co2 = Math.max(0, Math.min(5000, child.co2));
      child.cost = Math.max(0, Math.min(10000, child.cost));

      newPop.push(child);
    }
    population = newPop;
  }

  population.forEach((ind) => (ind.fitness = fitness(ind)));
  population.sort((a, b) => (b.fitness ?? 0) - (a.fitness ?? 0));

  return { best: population[0], population, history };
}
