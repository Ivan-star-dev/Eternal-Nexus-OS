// ═══════════════════════════════════════════════════════════════
// Fallback strategies when LTTB worker is unavailable
//
// Degradation hierarchy (best → worst quality):
//   1. LTTB sync (best fidelity, only for n < 10k)
//   2. Min-Max per bucket (preserves extremes)
//   3. Uniform sampling (fast, may miss peaks)
//   4. Head-Tail (last resort)
// ═══════════════════════════════════════════════════════════════

export interface FallbackResult<T> {
  data: T[];
  strategy: "lttb-sync" | "min-max" | "uniform" | "head-tail";
  durationMs: number;
  quality: number; // 0-1 estimated visual fidelity
}

export interface FallbackConfig {
  syncLttbThreshold: number;
  fallbackBudgetMs: number;
  xKey: string;
  yKeys: string[];
}

const DEFAULT_CONFIG: FallbackConfig = {
  syncLttbThreshold: 10_000,
  fallbackBudgetMs: 8,
  xKey: "timestamp",
  yKeys: ["value"],
};

// ─── Strategy 1: Sync LTTB (simplified, object-based) ───

function lttbSync<T extends Record<string, number>>(
  data: T[],
  targetSize: number,
  xKey: string,
  yKey: string
): T[] {
  const n = data.length;
  if (targetSize >= n) return data;
  if (targetSize <= 2) return n <= 2 ? [...data] : [data[0], data[n - 1]];

  const result: T[] = [data[0]];
  const bucketSize = (n - 2) / (targetSize - 2);
  let prevIndex = 0;

  for (let bucket = 1; bucket < targetSize - 1; bucket++) {
    const bucketStart = Math.floor((bucket - 1) * bucketSize) + 1;
    const bucketEnd = Math.min(Math.floor(bucket * bucketSize) + 1, n - 1);

    const nextStart = Math.floor(bucket * bucketSize) + 1;
    const nextEnd = Math.min(Math.floor((bucket + 1) * bucketSize) + 1, n - 1);

    let avgX = 0, avgY = 0;
    const nextLen = nextEnd - nextStart;
    if (nextLen > 0) {
      for (let j = nextStart; j < nextEnd; j++) { avgX += data[j][xKey]; avgY += data[j][yKey]; }
      avgX /= nextLen; avgY /= nextLen;
    } else {
      avgX = data[n - 1][xKey]; avgY = data[n - 1][yKey];
    }

    const ax = data[prevIndex][xKey], ay = data[prevIndex][yKey];
    let maxArea = -1, maxIndex = bucketStart;

    for (let j = bucketStart; j < bucketEnd; j++) {
      const area = Math.abs((ax - avgX) * (data[j][yKey] - ay) - (ax - data[j][xKey]) * (avgY - ay));
      if (area > maxArea) { maxArea = area; maxIndex = j; }
    }

    result.push(data[maxIndex]);
    prevIndex = maxIndex;
  }

  result.push(data[n - 1]);
  return result;
}

// ─── Strategy 2: Min-Max per bucket ───

function minMaxSampling<T extends Record<string, number>>(
  data: T[],
  targetSize: number,
  yKey: string
): T[] {
  const n = data.length;
  if (targetSize >= n) return data;

  const numBuckets = Math.floor(targetSize / 2);
  const bucketSize = n / numBuckets;
  const result: T[] = [];

  for (let b = 0; b < numBuckets; b++) {
    const start = Math.floor(b * bucketSize);
    const end = Math.min(Math.floor((b + 1) * bucketSize), n);
    let minVal = Infinity, maxVal = -Infinity, minIdx = start, maxIdx = start;

    for (let i = start; i < end; i++) {
      const v = data[i][yKey];
      if (v < minVal) { minVal = v; minIdx = i; }
      if (v > maxVal) { maxVal = v; maxIdx = i; }
    }

    if (minIdx <= maxIdx) {
      result.push(data[minIdx]);
      if (minIdx !== maxIdx) result.push(data[maxIdx]);
    } else {
      result.push(data[maxIdx]);
      if (minIdx !== maxIdx) result.push(data[minIdx]);
    }
  }

  return result;
}

// ─── Strategy 3: Uniform sampling ───

function uniformSampling<T>(data: T[], targetSize: number): T[] {
  const n = data.length;
  if (targetSize >= n) return data;
  const result: T[] = [];
  const step = (n - 1) / (targetSize - 1);
  for (let i = 0; i < targetSize; i++) result.push(data[Math.round(i * step)]);
  return result;
}

// ─── Strategy 4: Head-Tail ───

function headTailSampling<T>(data: T[], targetSize: number): T[] {
  const n = data.length;
  if (targetSize >= n) return data;
  const half = Math.floor(targetSize / 2);
  return [...data.slice(0, half), ...data.slice(n - (targetSize - half))];
}

// ═══════════════════════════════════════════════════════════════
// FallbackManager: auto-selects best strategy within budget
// ═══════════════════════════════════════════════════════════════

export class FallbackManager<T extends Record<string, number>> {
  private config: FallbackConfig;
  private strategyTimings = new Map<string, number[]>();

  constructor(config?: Partial<FallbackConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  execute(data: T[], targetSize: number): FallbackResult<T> {
    const n = data.length;
    const budget = this.config.fallbackBudgetMs;

    if (n <= this.config.syncLttbThreshold) {
      const est = this.estimateTime("lttb-sync", n);
      if (est < budget * 0.8) {
        return this.timed("lttb-sync", 0.95, () =>
          lttbSync(data, targetSize, this.config.xKey, this.config.yKeys[0])
        );
      }
    }

    if (this.estimateTime("min-max", n) < budget * 0.8) {
      return this.timed("min-max", 0.8, () =>
        minMaxSampling(data, targetSize, this.config.yKeys[0])
      );
    }

    if (this.estimateTime("uniform", targetSize) < budget * 0.8) {
      return this.timed("uniform", 0.5, () => uniformSampling(data, targetSize));
    }

    return this.timed("head-tail", 0.2, () => headTailSampling(data, targetSize));
  }

  private timed(
    strategy: FallbackResult<T>["strategy"],
    quality: number,
    fn: () => T[]
  ): FallbackResult<T> {
    const start = performance.now();
    const data = fn();
    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    this.record(strategy, durationMs);
    return { data, strategy, durationMs, quality };
  }

  private estimateTime(strategy: string, n: number): number {
    const history = this.strategyTimings.get(strategy);
    if (history?.length) return history.reduce((a, b) => a + b, 0) / history.length;
    const rates: Record<string, number> = {
      "lttb-sync": 0.5, "min-max": 0.2, "uniform": 0.01, "head-tail": 0.001,
    };
    return (rates[strategy] ?? 1) * (n / 1000);
  }

  private record(strategy: string, ms: number): void {
    const h = this.strategyTimings.get(strategy) ?? [];
    h.push(ms);
    if (h.length > 10) h.shift();
    this.strategyTimings.set(strategy, h);
  }

  resetTimings(): void {
    this.strategyTimings.clear();
  }
}
