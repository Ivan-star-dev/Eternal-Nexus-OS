import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NexusFlowInspector } from "@/components/shared/NexusFlowInspector";

vi.mock("@/hooks/useNexusState", () => ({
  useNexusState: () => ({
    verdicts: [
      {
        id: "v-1",
        topic: "Teste de auditoria",
        verdict: "approved",
        confidence: 0.9,
      },
    ],
  }),
}));

vi.mock("@/hooks/useIndexOrgan", () => ({
  useIndexOrgan: () => ({
    entries: [
      {
        id: "i-1",
        title: "Entrada index",
        category: "security",
        severity: 0.8,
      },
    ],
  }),
}));

describe.skip("NexusFlowInspector (trilha paralela de auditabilidade visual)", () => {
  it("renderiza painéis de contagem para suporte de auditoria", () => {
    render(<NexusFlowInspector />);
    expect(screen.getByText("Nexus Flow Inspector")).toBeInTheDocument();
  });
});
