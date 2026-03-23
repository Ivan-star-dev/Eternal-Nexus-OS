import { useEffect } from "react";
import SystemShell from "@/components/system/SystemShell";
import LiveStateSurface from "@/components/system/LiveStateSurface";
import HandoffLedger from "@/components/system/HandoffLedger";
import TaskControlRegion from "@/components/system/TaskControlRegion";
import OrchestraPanel from "@/components/system/OrchestraPanel";
import CommandLine from "@/components/system/CommandLine";

export default function SystemFacePage() {
  useEffect(() => {
    document.title = "System Face — Eternal Nexus OS";
  }, []);

  return (
    <SystemShell>
      {/*
        Layout: 5-region grid
        ┌─────────────────────────────────────────┐
        │  header (SystemShell)                   │
        ├──────────────┬──────────────┬───────────┤
        │ LiveState    │ TaskControl  │ Orchestra │
        │              │              │           │
        ├──────────────┼──────────────┴───────────┤
        │ Handoff      │ CommandLine               │
        │ Ledger       │                           │
        ├──────────────┴───────────────────────────┤
        │  footer (SystemShell)                   │
        └─────────────────────────────────────────┘
      */}
      <div
        className="grid h-full gap-px p-px"
        style={{
          background: "rgba(255,255,255,0.04)",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr",
        }}
      >
        {/* Row 1, Col 1 — Live State */}
        <div className="overflow-hidden p-4" style={{ background: "#060c14" }}>
          <LiveStateSurface />
        </div>

        {/* Row 1, Col 2 — Task Control */}
        <div className="overflow-hidden p-4" style={{ background: "#060c14" }}>
          <TaskControlRegion />
        </div>

        {/* Row 1, Col 3 — Orchestra */}
        <div className="overflow-hidden p-4" style={{ background: "#060c14" }}>
          <OrchestraPanel />
        </div>

        {/* Row 2, Col 1 — Handoff Ledger */}
        <div className="overflow-hidden p-4" style={{ background: "#060c14" }}>
          <HandoffLedger />
        </div>

        {/* Row 2, Col 2+3 — Command Line */}
        <div
          className="col-span-2 overflow-hidden p-4"
          style={{ background: "#060c14" }}
        >
          <CommandLine />
        </div>
      </div>
    </SystemShell>
  );
}
