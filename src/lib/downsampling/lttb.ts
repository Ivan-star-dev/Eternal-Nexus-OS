// ═══════════════════════════════════════════════════════════════
// Largest Triangle Three Buckets — Multi-Series Implementation
//
// Ref: Sveinn Steinarsson, 2013
// Complexidade: O(n) tempo, O(targetSize) espaço
// ═══════════════════════════════════════════════════════════════

type XAccessor<T> = (point: T, index: number) => number;
type YAccessor<T> = (point: T) => number;

export interface LTTBResult<T> {
  data: T[];
  originalSize: number;
  resultSize: number;
  reductionRatio: number;
  processingTimeMs: number;
}

// ── Single-series LTTB ──────────────────────────────────

export function lttb<T>(
  source: T[],
  targetSize: number,
  y: YAccessor<T>,
  x?: XAccessor<T>
): LTTBResult<T> {
  const start = performance.now();
  const getX: XAccessor<T> = x ?? ((_p, i) => i);

  if (source.length <= targetSize || targetSize < 3 || source.length === 0) {
    return {
      data: [...source],
      originalSize: source.length,
      resultSize: source.length,
      reductionRatio: 0,
      processingTimeMs: performance.now() - start,
    };
  }

  const sampled: T[] = [source[0]];
  const bucketSize = (source.length - 2) / (targetSize - 2);
  let prevIndex = 0;

  for (let bucket = 0; bucket < targetSize - 2; bucket++) {
    const bStart = Math.floor(bucket * bucketSize) + 1;
    const bEnd = Math.min(Math.floor((bucket + 1) * bucketSize) + 1, source.length - 1);

    // Next bucket centroid
    const nStart = Math.floor((bucket + 1) * bucketSize) + 1;
    const nEnd = Math.min(Math.floor((bucket + 2) * bucketSize) + 1, source.length - 1);
    let avgX = 0, avgY = 0, count = 0;
    for (let j = nStart; j < nEnd; j++) {
      avgX += getX(source[j], j);
      avgY += y(source[j]);
      count++;
    }
    if (count > 0) { avgX /= count; avgY /= count; }

    // Find max triangle area in current bucket
    const prevX = getX(source[prevIndex], prevIndex);
    const prevY = y(source[prevIndex]);
    let maxArea = -1, bestIdx = bStart;

    for (let j = bStart; j < bEnd; j++) {
      const area = Math.abs(
        (prevX - avgX) * (y(source[j]) - prevY) -
        (prevX - getX(source[j], j)) * (avgY - prevY)
      ) * 0.5;
      if (area > maxArea) { maxArea = area; bestIdx = j; }
    }

    sampled.push(source[bestIdx]);
    prevIndex = bestIdx;
  }

  sampled.push(source[source.length - 1]);

  return {
    data: sampled,
    originalSize: source.length,
    resultSize: sampled.length,
    reductionRatio: 1 - sampled.length / source.length,
    processingTimeMs: performance.now() - start,
  };
}

// ── Multi-series LTTB ───────────────────────────────────
// Selects points that maximize the sum of normalized triangle
// areas across ALL series — preserves peaks in every metric.

export function lttbMultiSeries<T>(
  source: T[],
  targetSize: number,
  yAccessors: { key: string; accessor: YAccessor<T> }[],
  x?: XAccessor<T>
): LTTBResult<T> {
  const start = performance.now();
  const getX: XAccessor<T> = x ?? ((_p, i) => i);

  if (source.length <= targetSize || targetSize < 3 || source.length === 0) {
    return {
      data: [...source],
      originalSize: source.length,
      resultSize: source.length,
      reductionRatio: 0,
      processingTimeMs: performance.now() - start,
    };
  }

  // Pre-compute ranges for normalization
  const ranges = yAccessors.map(({ accessor }) => {
    let min = Infinity, max = -Infinity;
    for (const p of source) {
      const v = accessor(p);
      if (v < min) min = v;
      if (v > max) max = v;
    }
    return max - min || 1;
  });

  const sampled: T[] = [source[0]];
  const bucketSize = (source.length - 2) / (targetSize - 2);
  let prevIndex = 0;

  for (let bucket = 0; bucket < targetSize - 2; bucket++) {
    const bStart = Math.floor(bucket * bucketSize) + 1;
    const bEnd = Math.min(Math.floor((bucket + 1) * bucketSize) + 1, source.length - 1);

    const nStart = Math.floor((bucket + 1) * bucketSize) + 1;
    const nEnd = Math.min(Math.floor((bucket + 2) * bucketSize) + 1, source.length - 1);
    const nLen = nEnd - nStart + 1;

    let avgX = 0;
    const avgYs = yAccessors.map(() => 0);
    for (let j = nStart; j <= nEnd; j++) {
      avgX += getX(source[j], j);
      yAccessors.forEach(({ accessor }, si) => { avgYs[si] += accessor(source[j]); });
    }
    avgX /= nLen;
    avgYs.forEach((_, si) => { avgYs[si] /= nLen; });

    const prevX = getX(source[prevIndex], prevIndex);
    let maxTotal = -1, bestIdx = bStart;

    for (let j = bStart; j <= bEnd; j++) {
      let totalArea = 0;
      const currX = getX(source[j], j);

      for (let si = 0; si < yAccessors.length; si++) {
        const pY = yAccessors[si].accessor(source[prevIndex]) / ranges[si];
        const cY = yAccessors[si].accessor(source[j]) / ranges[si];
        const nY = avgYs[si] / ranges[si];
        totalArea += Math.abs((prevX - avgX) * (cY - pY) - (prevX - currX) * (nY - pY));
      }

      if (totalArea > maxTotal) { maxTotal = totalArea; bestIdx = j; }
    }

    sampled.push(source[bestIdx]);
    prevIndex = bestIdx;
  }

  sampled.push(source[source.length - 1]);

  return {
    data: sampled,
    originalSize: source.length,
    resultSize: sampled.length,
    reductionRatio: 1 - sampled.length / source.length,
    processingTimeMs: performance.now() - start,
  };
}

// ── Chunked processing with error handling + retries ────
// For massive datasets (>100K points), processes in chunks
// with retry logic to handle memory pressure gracefully.

interface ChunkedOptions<T> {
  targetSize: number;
  yAccessors: { key: string; accessor: YAccessor<T> }[];
  x?: XAccessor<T>;
  chunkSize?: number;        // default: 50_000
  maxRetries?: number;        // default: 3
  retryDelayMs?: number;      // default: 100
  onProgress?: (pct: number) => void;
}

export async function lttbChunkedWithRetry<T>(
  source: T[],
  options: ChunkedOptions<T>
): Promise<LTTBResult<T>> {
  const {
    targetSize,
    yAccessors,
    x,
    chunkSize = 50_000,
    maxRetries = 3,
    retryDelayMs = 100,
    onProgress,
  } = options;

  const start = performance.now();

  if (source.length <= targetSize) {
    onProgress?.(100);
    return {
      data: [...source],
      originalSize: source.length,
      resultSize: source.length,
      reductionRatio: 0,
      processingTimeMs: performance.now() - start,
    };
  }

  // Split source into chunks
  const numChunks = Math.ceil(source.length / chunkSize);
  const pointsPerChunk = Math.max(3, Math.ceil(targetSize / numChunks));
  let intermediate: T[] = [];

  for (let i = 0; i < numChunks; i++) {
    const chunk = source.slice(i * chunkSize, (i + 1) * chunkSize);
    let result: LTTBResult<T> | null = null;
    let lastError: Error | null = null;

    // Retry loop per chunk
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        result = lttbMultiSeries(chunk, pointsPerChunk, yAccessors, x);
        break;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt < maxRetries) {
          // Exponential backoff
          await new Promise((r) => setTimeout(r, retryDelayMs * Math.pow(2, attempt)));
        }
      }
    }

    if (!result) {
      console.error(`[LTTB] Chunk ${i} failed after ${maxRetries} retries:`, lastError);
      // Fallback: include raw chunk data (degraded but not lost)
      intermediate.push(...chunk);
    } else {
      intermediate.push(...result.data);
    }

    onProgress?.(Math.round(((i + 1) / numChunks) * 100));

    // Yield to main thread between chunks
    await new Promise((r) => setTimeout(r, 0));
  }

  // Final pass: downsample the combined intermediate results
  const finalResult = lttbMultiSeries(intermediate, targetSize, yAccessors, x);

  return {
    ...finalResult,
    originalSize: source.length,
    processingTimeMs: performance.now() - start,
  };
}
