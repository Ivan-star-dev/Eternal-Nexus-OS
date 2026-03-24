import { ReactNode, useEffect, useState } from "react";

interface SystemShellProps {
  children: ReactNode;
}

function TechnicalGrid() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="sys-grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="0.5" />
        </pattern>
        <pattern id="sys-grid-major" width="192" height="192" patternUnits="userSpaceOnUse">
          <rect width="192" height="192" fill="url(#sys-grid)" />
          <path d="M 192 0 L 0 0 0 192" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sys-grid-major)" />
    </svg>
  );
}

function SystemHeader() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const dateStr = `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(time.getDate())}`;

  return (
    <header className="relative z-10 flex items-center justify-between border-b border-white/[0.06] px-6 py-3">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="block h-1.5 w-1.5 rounded-full bg-teal" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-paper-dim uppercase">
            ETERNAL NEXUS OS
          </span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <span className="font-mono text-[10px] tracking-[0.15em] text-paper-dim/50 uppercase">
          SYSTEM FACE · v1.0
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-mono text-[10px] tracking-[0.12em] text-paper-dim/50">
          {dateStr}
        </span>
        <span className="font-mono text-[10px] tabular-nums tracking-[0.12em] text-teal-light">
          {timeStr}
        </span>
      </div>
    </header>
  );
}

function SystemFooter() {
  return (
    <footer className="relative z-10 flex items-center justify-between border-t border-white/[0.06] px-6 py-2">
      <span className="font-mono text-[9px] tracking-[0.18em] text-paper-dim/30 uppercase">
        SYSTEM BRANCH: cursor/system-face-core-d9db
      </span>
      <div className="flex items-center gap-3">
        <span className="block h-1 w-1 rounded-full bg-teal/60" />
        <span className="font-mono text-[9px] tracking-[0.15em] text-paper-dim/30 uppercase">
          IGNIÇÃO_ATIVA
        </span>
        <span className="block h-1 w-1 rounded-full bg-teal/60" />
        <span className="font-mono text-[9px] tracking-[0.15em] text-paper-dim/30 uppercase">
          MODO_AUTO · ON
        </span>
      </div>
    </footer>
  );
}

export default function SystemShell({ children }: SystemShellProps) {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#060c14" }}
    >
      <TechnicalGrid />
      <div className="relative z-10 flex h-screen flex-col">
        <SystemHeader />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
        <SystemFooter />
      </div>
    </div>
  );
}
