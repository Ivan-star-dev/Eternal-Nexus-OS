// ═══════════════════════════════════════════════════════════════
// Timestamp Conversion Strategies
//
// After the worker transfers Float64Array timestamps (in ms),
// they need conversion to Unix seconds for uPlot.
//
// Cost analysis for 1000 points (post-LTTB):
//   In-place division: ~0.004ms (negligible)
//   Worker-side reciprocal: 0ms on main thread
//   uPlot ms-scale config: 0ms (no conversion at all)
//
// The in-place approach is fine for ≤50K points.
// Above that, move conversion to the worker or use ms-scale config.
// ═══════════════════════════════════════════════════════════════

/**
 * V1: Simple in-place conversion (main thread).
 * Best for: small arrays (< 50K points post-LTTB).
 * Cost: ~0.004ms for 1000 points.
 */
export function convertTimestampsInPlace(
  timestamps: Float64Array,
  count: number
): void {
  for (let i = 0; i < count; i++) {
    timestamps[i] = timestamps[i] / 1000;
  }
}

/**
 * V2: Worker-side conversion using reciprocal multiplication.
 * Multiplication is ~1 cycle faster than division per float64.
 * Supports multiple input units.
 *
 * This function runs IN THE WORKER, before transfer.
 * Main thread receives data already in seconds — zero work.
 */
export function workerSideConversion(
  timestamps: Float64Array,
  count: number,
  inputUnit: "ms" | "us" | "ns" | "s" = "ms"
): void {
  const divisor =
    inputUnit === "ms" ? 1000 :
    inputUnit === "us" ? 1_000_000 :
    inputUnit === "ns" ? 1_000_000_000 : 1;

  if (divisor === 1) return;

  const reciprocal = 1 / divisor;

  for (let i = 0; i < count; i++) {
    timestamps[i] = timestamps[i] * reciprocal;
  }
}

/**
 * V3: uPlot scale config that accepts ms directly.
 * Zero conversion cost — uPlot reads ms and formats correctly.
 *
 * Trade-off: all code consuming the data must know it's in ms.
 */
export function createMillisecondScaleConfig() {
  return {
    scales: {
      x: {
        time: false, // Disable built-in time handling
      },
    },
    axes: [
      {
        values: (_uplot: unknown, splits: number[]): string[] => {
          return splits.map((ms) => {
            const d = new Date(ms);
            return `${d.getHours().toString().padStart(2, "0")}:${d
              .getMinutes()
              .toString()
              .padStart(2, "0")}:${d
              .getSeconds()
              .toString()
              .padStart(2, "0")}`;
          });
        },
      },
    ],
  };
}

/**
 * V4: Chunked conversion with yielding for massive arrays.
 * Only use when LTTB was skipped and array is 500K+ points.
 * Each yield adds ~4ms overhead from setTimeout.
 */
export async function convertTimestampsChunked(
  timestamps: Float64Array,
  count: number,
  chunkSize: number = 50_000
): Promise<void> {
  const reciprocal = 1 / 1000;

  for (let offset = 0; offset < count; offset += chunkSize) {
    const end = Math.min(offset + chunkSize, count);

    for (let i = offset; i < end; i++) {
      timestamps[i] = timestamps[i] * reciprocal;
    }

    if (end < count) {
      await new Promise<void>((resolve) => {
        if (typeof requestIdleCallback === "function") {
          requestIdleCallback(() => resolve(), { timeout: 8 });
        } else {
          setTimeout(resolve, 0);
        }
      });
    }
  }
}
