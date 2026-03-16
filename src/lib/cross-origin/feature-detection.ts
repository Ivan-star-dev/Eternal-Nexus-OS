// ═══════════════════════════════════════════════════════════════
// Cross-Origin Isolation: Feature Detection & Diagnostics
//
// SharedArrayBuffer requires cross-origin isolation (COOP/COEP).
// This module detects availability and provides diagnostics.
//
// Required server headers:
//   Cross-Origin-Opener-Policy: same-origin
//   Cross-Origin-Embedder-Policy: credentialless (or require-corp)
//
// The "credentialless" COEP is preferred because it allows
// loading public cross-origin resources (CDN images, fonts)
// without requiring CORP headers on those servers.
// ═══════════════════════════════════════════════════════════════

export interface COIStatus {
  crossOriginIsolated: boolean;
  sharedArrayBufferAvailable: boolean;
  atomicsAvailable: boolean;
  reason: string | null;
  recommendation: string;
}

/**
 * Diagnose cross-origin isolation status.
 * Call once at startup to determine which heartbeat strategy to use.
 */
export function diagnoseCOI(): COIStatus {
  const isolated =
    typeof crossOriginIsolated !== "undefined" && crossOriginIsolated;

  const sabAvailable = typeof SharedArrayBuffer !== "undefined";

  const atomicsAvailable =
    typeof Atomics !== "undefined" && typeof Atomics.load === "function";

  let reason: string | null = null;
  let recommendation: string;

  if (isolated && sabAvailable && atomicsAvailable) {
    reason = null;
    recommendation = "SharedArrayBuffer heartbeat available — zero-message monitoring.";
  } else if (!isolated && sabAvailable) {
    reason =
      "crossOriginIsolated is false but SharedArrayBuffer exists. " +
      "Likely on localhost or with experimental flags.";
    recommendation =
      "Works for dev. Configure COOP/COEP headers for production.";
  } else if (!sabAvailable) {
    reason = diagnoseMissingHeaders();
    recommendation =
      "Configure COOP: same-origin and COEP: credentialless on the server. " +
      "Use report-only mode first to validate.";
  } else {
    reason = "Atomics unavailable.";
    recommendation = "Using PiggybackHeartbeat as fallback.";
  }

  return {
    crossOriginIsolated: isolated,
    sharedArrayBufferAvailable: sabAvailable,
    atomicsAvailable,
    reason,
    recommendation,
  };
}

function diagnoseMissingHeaders(): string {
  const problems: string[] = [];

  if (typeof crossOriginIsolated !== "undefined" && !crossOriginIsolated) {
    problems.push("crossOriginIsolated === false");
  }

  if (typeof window !== "undefined" && window.opener !== null && window.opener !== window) {
    problems.push("window.opener exists — COOP: same-origin should have nulled it");
  }

  if (problems.length === 0) {
    problems.push(
      "SharedArrayBuffer unavailable. Likely missing COOP/COEP headers."
    );
  }

  return problems.join(". ");
}

/**
 * Active validation: attempts to create and use a SharedArrayBuffer.
 * More reliable than typeof checks.
 */
export function canUseSharedArrayBuffer(): boolean {
  try {
    const test = new SharedArrayBuffer(4);
    const view = new Int32Array(test);
    Atomics.store(view, 0, 42);
    return Atomics.load(view, 0) === 42;
  } catch {
    return false;
  }
}
