// ═══════════════════════════════════════════════════════════════
// Web Worker: LTTB processing off the main thread
//
// Protocol:
//   Main → Worker:  { type: 'process' | 'abort' | 'ping', ... }
//   Worker → Main:  { type: 'result' | 'error' | 'progress' | 'pong' | 'ready' }
//
// Resilience:
//   - Chunked processing for massive datasets
//   - Per-chunk retry with exponential backoff
//   - Graceful degradation on OOM (reduce targetSize)
//   - Abort support via requestId tracking
// ═══════════════════════════════════════════════════════════════

// Inline LTTB to avoid import issues in worker context
function lttbMulti(
  source: any[],
  targetSize: number,
  yKeys: string[]
): { data: any[]; originalSize: number; resultSize: number } {
  if (source.length <= targetSize || targetSize < 3 || source.length === 0) {
    return { data: [...source], originalSize: source.length, resultSize: source.length };
  }

  // Compute ranges for normalization
  const ranges = yKeys.map((key) => {
    let min = Infinity, max = -Infinity;
    for (const p of source) {
      const v = Number(p[key]) || 0;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    return max - min || 1;
  });

  const sampled: any[] = [source[0]];
  const bucketSize = (source.length - 2) / (targetSize - 2);
  let prevIndex = 0;

  for (let bucket = 0; bucket < targetSize - 2; bucket++) {
    const bStart = Math.floor(bucket * bucketSize) + 1;
    const bEnd = Math.min(Math.floor((bucket + 1) * bucketSize) + 1, source.length - 1);

    const nStart = Math.floor((bucket + 1) * bucketSize) + 1;
    const nEnd = Math.min(Math.floor((bucket + 2) * bucketSize) + 1, source.length - 1);
    const nLen = Math.max(nEnd - nStart + 1, 1);

    let avgX = 0;
    const avgYs = yKeys.map(() => 0);
    for (let j = nStart; j <= nEnd; j++) {
      avgX += j;
      yKeys.forEach((key, si) => { avgYs[si] += (Number(source[j]?.[key]) || 0); });
    }
    avgX /= nLen;
    avgYs.forEach((_, si) => { avgYs[si] /= nLen; });

    let maxTotal = -1, bestIdx = bStart;
    for (let j = bStart; j <= bEnd; j++) {
      let totalArea = 0;
      for (let si = 0; si < yKeys.length; si++) {
        const pY = (Number(source[prevIndex]?.[yKeys[si]]) || 0) / ranges[si];
        const cY = (Number(source[j]?.[yKeys[si]]) || 0) / ranges[si];
        const nY = avgYs[si] / ranges[si];
        totalArea += Math.abs((prevIndex - avgX) * (cY - pY) - (prevIndex - j) * (nY - pY));
      }
      if (totalArea > maxTotal) { maxTotal = totalArea; bestIdx = j; }
    }

    sampled.push(source[bestIdx]);
    prevIndex = bestIdx;
  }

  sampled.push(source[source.length - 1]);
  return { data: sampled, originalSize: source.length, resultSize: sampled.length };
}

// ── State ──
const activeRequests = new Set<string>();

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function processChunk(
  chunk: any[],
  targetSize: number,
  yKeys: string[],
  maxRetries: number,
  requestId: string
): Promise<{ data: any[]; retries: number }> {
  let lastErr: string = "";
  let currentTarget = targetSize;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (!activeRequests.has(requestId)) {
      throw new Error("ABORTED");
    }

    try {
      const result = lttbMulti(chunk, currentTarget, yKeys);
      return { data: result.data, retries: attempt };
    } catch (err: any) {
      lastErr = err?.message || String(err);
      const isOOM = lastErr.includes("memory") || lastErr.includes("ArrayBuffer");

      if (isOOM && attempt < maxRetries) {
        // Degrade: reduce target by half
        currentTarget = Math.max(Math.floor(currentTarget * 0.5), 10);
      }

      if (attempt < maxRetries) {
        await sleep(100 * Math.pow(2, attempt));
      }
    }
  }

  throw new Error(`Max retries exceeded: ${lastErr}`);
}

async function processDataset(msg: any): Promise<void> {
  const { requestId, payload } = msg;
  const { data, targetSize, yKeys, chunkSize = 500_000 } = payload;
  const startTime = performance.now();
  const MAX_RETRIES = 3;

  activeRequests.add(requestId);

  try {
    if (!data || data.length === 0) {
      self.postMessage({
        type: "result", requestId, data: [],
        stats: { originalSize: 0, resultSize: 0, reductionRatio: 0, processingTimeMs: 0, chunksProcessed: 0, retriesUsed: 0 },
      });
      return;
    }

    // Small dataset: process directly
    if (data.length <= chunkSize) {
      const result = await processChunk(data, targetSize, yKeys, MAX_RETRIES, requestId);
      self.postMessage({
        type: "result", requestId,
        data: result.data,
        stats: {
          originalSize: data.length,
          resultSize: result.data.length,
          reductionRatio: 1 - result.data.length / data.length,
          processingTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
          chunksProcessed: 1,
          retriesUsed: result.retries,
        },
      });
      return;
    }

    // Large dataset: chunked processing
    const numChunks = Math.ceil(data.length / chunkSize);
    const pointsPerChunk = Math.max(Math.ceil((targetSize * 2) / numChunks), 50);
    let totalRetries = 0;
    const partials: any[][] = [];

    for (let i = 0; i < numChunks; i++) {
      if (!activeRequests.has(requestId)) return;

      const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);

      self.postMessage({
        type: "progress", requestId,
        progress: {
          phase: "processing",
          currentChunk: i + 1,
          totalChunks: numChunks,
          percent: Math.round(((i + 1) / numChunks) * 80),
          elapsedMs: performance.now() - startTime,
        },
      });

      try {
        const result = await processChunk(chunk, pointsPerChunk, yKeys, MAX_RETRIES, requestId);
        totalRetries += result.retries;
        partials.push(result.data);
      } catch {
        // Fallback: include raw chunk
        partials.push(chunk);
      }

      // Yield to event loop
      await sleep(0);
    }

    // Final merge pass
    self.postMessage({
      type: "progress", requestId,
      progress: { phase: "merging", currentChunk: numChunks, totalChunks: numChunks, percent: 90, elapsedMs: performance.now() - startTime },
    });

    const merged = partials.flat();
    const final = await processChunk(merged, targetSize, yKeys, MAX_RETRIES, requestId);
    totalRetries += final.retries;

    self.postMessage({
      type: "result", requestId,
      data: final.data,
      stats: {
        originalSize: data.length,
        resultSize: final.data.length,
        reductionRatio: 1 - final.data.length / data.length,
        processingTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
        chunksProcessed: numChunks,
        retriesUsed: totalRetries,
      },
    });
  } catch (err: any) {
    self.postMessage({
      type: "error", requestId,
      error: { code: "PROCESSING_ERROR", message: err?.message || String(err), recoverable: false },
    });
  } finally {
    activeRequests.delete(requestId);
  }
}

// ── Message handler ──
self.onmessage = (event: MessageEvent) => {
  const msg = event.data;
  if (msg.type === "process") processDataset(msg);
  else if (msg.type === "abort") activeRequests.delete(msg.requestId);
  else if (msg.type === "ping") self.postMessage({ type: "pong", id: msg.id, timestamp: Date.now() });
};

self.postMessage({ type: "ready" });
