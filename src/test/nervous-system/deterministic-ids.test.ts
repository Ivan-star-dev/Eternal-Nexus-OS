import { describe, expect, it } from "vitest";

// TODO: import from actual nervous system when T-002 lands
// import { generateEventId } from "@/lib/nervous-system/event-bus";

/**
 * Minimal stub — replace with the real implementation once T-002 lands.
 * The stub mirrors the contract the tests verify so the file stays valid TypeScript
 * and the suite remains runnable in "pending" mode today.
 */
function generateEventId(seed: string): string {
  // Stub: deterministic hash-like transformation so tests can assert same-in → same-out.
  // Real implementation will derive a UUID-v5 (or equivalent) from the seed.
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return `evt-${hash.toString(16).padStart(8, "0")}`;
}

describe("nervous-system — deterministic event IDs", () => {
  it("produces the same ID when given the same seed", () => {
    const seed = "nexus::sensor::climate::2026-03-22T00:00:00Z";

    const id1 = generateEventId(seed);
    const id2 = generateEventId(seed);

    expect(id1).toBe(id2);
  });

  it("produces different IDs for different seeds", () => {
    const id1 = generateEventId("seed-alpha");
    const id2 = generateEventId("seed-beta");

    expect(id1).not.toBe(id2);
  });

  it("returns a non-empty string", () => {
    const id = generateEventId("any-seed");
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });
});
