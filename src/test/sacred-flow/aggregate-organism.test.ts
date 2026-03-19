import { describe, expect, it } from "vitest";
import { aggregateOrganism } from "@/lib/index-organ/aggregator";
import type { RealtimeDataPoint, TribunalVerdict } from "@/types/index";

describe("sacred flow aggregator (Tribunal + Atlas -> Index)", () => {
  it("consolida entradas e força flowTarget=news em toda a saída", () => {
    const now = Date.now();
    const verdicts: TribunalVerdict[] = [
      {
        id: "v-1",
        topic: "Risco hídrico regional",
        judges: ["zeta-9"],
        verdict: "approved",
        confidence: 0.92,
        reasoning: "Correlação alta entre seca e pressão em infraestrutura",
        timestamp: now - 1000,
        flowTarget: "index",
      },
    ];

    const dataPoints: RealtimeDataPoint[] = [
      {
        source: "climate",
        value: 31.4,
        lat: 14.93,
        lng: -23.51,
        timestamp: now - 2000,
        severity: 0.65,
        temperature: 31.4,
      },
    ];

    const result = aggregateOrganism(verdicts, dataPoints);

    expect(result).toHaveLength(2);
    expect(result.every((entry) => entry.flowTarget === "news")).toBe(true);
    expect(result.map((entry) => entry.category).sort()).toEqual(["climate", "verdict"]);
    expect(result[0].rank).toBeGreaterThanOrEqual(result[1].rank);
  });
});
