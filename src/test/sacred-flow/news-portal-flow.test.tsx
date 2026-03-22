import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type React from "react";
import NewsPortal from "@/pages/NewsPortal";

vi.mock("react-router-dom", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("lucide-react", () => {
  const Icon = () => <span data-testid="icon" />;
  return {
    Radio: Icon,
    Globe: Icon,
    Brain: Icon,
    Play: Icon,
    Pause: Icon,
    Volume2: Icon,
    VolumeX: Icon,
    Activity: Icon,
    HeartPulse: Icon,
    Shield: Icon,
    Cloud: Icon,
    DollarSign: Icon,
    Newspaper: Icon,
  };
});

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock("@/components/news/AIAnchor3D", () => ({
  default: () => <div data-testid="ai-anchor" />,
}));

vi.mock("@/components/news/BroadcastBar", () => ({
  default: () => <div data-testid="broadcast-bar" />,
}));

vi.mock("@/hooks/useIndexOrgan", () => ({
  useIndexOrgan: () => ({
    entries: [
      {
        id: "idx-1",
        rank: 1,
        title: "Veredito crítico",
        summary: "Síntese do Tribunal pronta para News",
        sources: [{ organ: "tribunal", dataId: "v-1", confidence: 0.95 }],
        category: "verdict",
        severity: 0.9,
        timestamp: Date.now(),
        crossReferences: [],
        flowTarget: "news",
      },
      {
        id: "idx-2",
        rank: 0.8,
        title: "Dado climático atlas",
        summary: "Atualização meteorológica integrada no Index",
        sources: [{ organ: "atlas", dataId: "a-1", confidence: 0.7 }],
        category: "climate",
        severity: 0.6,
        timestamp: Date.now(),
        crossReferences: [],
        flowTarget: "news",
      },
    ],
  }),
}));

describe("NewsPortal sacred flow", () => {
  it("consome saída do Index e renderiza reports do fluxo", async () => {
    render(<NewsPortal />);

    expect(screen.getAllByText("Veredito crítico")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Dado climático atlas")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Síntese do Tribunal pronta para News").length).toBeGreaterThan(0);
  });
});
