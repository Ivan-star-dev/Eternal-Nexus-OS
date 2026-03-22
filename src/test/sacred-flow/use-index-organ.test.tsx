import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useIndexOrgan } from "@/hooks/useIndexOrgan";
import type { RealtimeDataPoint, TribunalVerdict } from "@/types/index";

const mockUseNexusState = vi.fn();
const mockUseRealtimeData = vi.fn();

vi.mock("@/hooks/useNexusState", () => ({
  useNexusState: () => mockUseNexusState(),
}));

vi.mock("@/hooks/useRealtimeData", () => ({
  useRealtimeData: () => mockUseRealtimeData(),
}));

describe("useIndexOrgan", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("aplica debounce e expõe stats/topSources a partir do Index", async () => {
    const now = Date.now();
    const verdicts: TribunalVerdict[] = [
      {
        id: "verdict-01",
        topic: "Alerta sanitário",
        judges: ["zeta-9"],
        verdict: "approved",
        confidence: 0.9,
        reasoning: "Sinal convergente em múltiplas regiões",
        timestamp: now,
        flowTarget: "index",
      },
    ];
    const data: RealtimeDataPoint[] = [
      {
        source: "economy",
        value: 88,
        lat: 0,
        lng: 0,
        timestamp: now,
        severity: 0.7,
      },
    ];

    mockUseNexusState.mockReturnValue({ verdicts });
    mockUseRealtimeData.mockReturnValue({ data, isLoading: false, error: null });

    const { result } = renderHook(() => useIndexOrgan());

    expect(result.current.entries).toHaveLength(0);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    expect(result.current.entries.length).toBeGreaterThan(0);
    expect(result.current.stats.totalEntries).toBe(2);
    expect(result.current.stats.topSources).toEqual(expect.arrayContaining(["tribunal", "atlas"]));
    expect(result.current.entries.every((entry) => entry.flowTarget === "news")).toBe(true);
  });
});
