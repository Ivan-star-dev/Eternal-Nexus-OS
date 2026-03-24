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
        Cockpit layout — proportional to information weight:

        ┌──────────────┬─────────────────────┬──────────────┐
        │ LiveState    │ TaskControl         │ Orchestra    │
        │ 22%          │ 48%                 │ 30%          │
        ├──────────────┴──────────┬──────────┴──────────────┤
        │ Handoff Ledger          │ Command Line             │
        │ 35%                     │ 65%                      │
        └─────────────────────────┴──────────────────────────┘

        Gaps are 1px tinted lines — structural dividers, not cards.
      */}
      <div className="h-full flex flex-col gap-px" style={{ background: "rgba(255,255,255,0.05)" }}>
        {/* Row 1 */}
        <div className="flex flex-1 min-h-0 gap-px">
          {/* LiveState — narrowest: contains short k/v pairs */}
          <div
            className="overflow-hidden p-4"
            style={{ background: "#060c14", width: "22%" }}
          >
            <LiveStateSurface />
          </div>

          {/* TaskControl — widest in row 1: most content per line */}
          <div
            className="overflow-hidden p-4"
            style={{ background: "#060c14", flex: 1 }}
          >
            <TaskControlRegion />
          </div>

          {/* Orchestra — fixed: 6-cell grid, needs consistent width */}
          <div
            className="overflow-hidden p-4"
            style={{ background: "#060c14", width: "30%" }}
          >
            <OrchestraPanel />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-1 min-h-0 gap-px">
          {/* Handoff — narrower: list view */}
          <div
            className="overflow-hidden p-4"
            style={{ background: "#060c14", width: "35%" }}
          >
            <HandoffLedger />
          </div>

          {/* CommandLine — dominant: primary interactive surface */}
          <div
            className="overflow-hidden p-4"
            style={{ background: "#060c14", flex: 1 }}
          >
            <CommandLine />
          </div>
        </div>
      </div>
    </SystemShell>
  );
}
