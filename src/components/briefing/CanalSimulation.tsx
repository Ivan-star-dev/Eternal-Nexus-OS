import { useState, useRef, useEffect, useCallback } from "react";

const scenes = [
  { num: "01", title: "Cross-Section — Full System", meta: "All 5 layers active", desc: "Ø 1.9m modular frame installed at canal bed. Bio-active Reefy surface (Coastruction). Self-healing bacterial concrete (TU Delft). All five functional layers active." },
  { num: "02", title: "Cargo Capsule Transit", meta: "Phase 1 · 2027", desc: "500 kg cargo capsules propelled by Linear Induction Motors at 60 km/h. PostNL and Amazon integration." },
  { num: "03", title: "Passenger Mobility", meta: "Phase 2 · 2029+", desc: "1–4 passenger capsules at 140 km/h cruise. Amsterdam–Rotterdam in 27 minutes." },
];

const layerDefs = [
  { key: "cargo", label: "CARGO CAPSULES", color: "hsl(43 85% 38%)" },
  { key: "passenger", label: "PASSENGER CAPSULES", color: "hsl(168 58% 55%)" },
  { key: "nRecovery", label: "N-RECOVERY FLOW", color: "hsl(200 70% 50%)" },
  { key: "energy", label: "ENERGY VECTORS", color: "hsl(350 60% 55%)" },
  { key: "sensors", label: "SENSOR NETWORK", color: "hsl(50 80% 60%)" },
];

const CanalSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [activeScene, setActiveScene] = useState(0);
  const [layers, setLayers] = useState<Record<string, boolean>>({
    cargo: true, passenger: true, nRecovery: true, energy: false, sensors: true,
  });
  const [telemetry, setTelemetry] = useState({
    depth: "4.2", temp: "12.4", ph: "7.18", nLoad: "847", energy: "71.3", capsules: "3", flood: "LOW",
  });

  const toggleLayer = (key: string) => setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  // Animate telemetry values slightly
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        depth: (4.0 + Math.random() * 0.4).toFixed(1),
        temp: (12.0 + Math.random() * 0.8).toFixed(1),
        ph: (7.1 + Math.random() * 0.15).toFixed(2),
        nLoad: String(840 + Math.floor(Math.random() * 15)),
        energy: (70 + Math.random() * 3).toFixed(1),
        capsules: String(2 + Math.floor(Math.random() * 3)),
        flood: prev.flood,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const draw = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const t = time * 0.001;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, w, h);

    // Canal walls (trapezoid)
    const bankTop = h * 0.15;
    const bankBottom = h * 0.85;
    const topLeft = w * 0.05;
    const topRight = w * 0.95;
    const bottomLeft = w * 0.2;
    const bottomRight = w * 0.8;

    ctx.strokeStyle = "hsl(210 15% 25%)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(topLeft, bankTop);
    ctx.lineTo(bottomLeft, bankBottom);
    ctx.lineTo(bottomRight, bankBottom);
    ctx.lineTo(topRight, bankTop);
    ctx.stroke();

    // Water fill
    const waterTop = h * 0.2;
    const waterLeftAtTop = topLeft + (bottomLeft - topLeft) * ((waterTop - bankTop) / (bankBottom - bankTop));
    const waterRightAtTop = topRight + (bottomRight - topRight) * ((waterTop - bankTop) / (bankBottom - bankTop));

    ctx.fillStyle = "rgba(10, 61, 98, 0.3)";
    ctx.beginPath();
    ctx.moveTo(waterLeftAtTop, waterTop);
    // Wavy water surface
    for (let x = waterLeftAtTop; x <= waterRightAtTop; x += 4) {
      const waveY = waterTop + Math.sin(x * 0.03 + t * 1.5) * 3;
      ctx.lineTo(x, waveY);
    }
    ctx.lineTo(bottomRight, bankBottom);
    ctx.lineTo(bottomLeft, bankBottom);
    ctx.closePath();
    ctx.fill();

    // DeltaSpine Frame (circle at bottom center)
    const frameX = w * 0.5;
    const frameY = bankBottom - h * 0.12;
    const frameR = h * 0.08;

    ctx.strokeStyle = "hsl(43 85% 38%)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(frameX, frameY, frameR, 0, Math.PI * 2);
    ctx.stroke();

    // Inner structure lines
    ctx.strokeStyle = "hsl(43 85% 38% / 0.4)";
    ctx.lineWidth = 1;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      ctx.beginPath();
      ctx.moveTo(frameX + Math.cos(a) * frameR * 0.3, frameY + Math.sin(a) * frameR * 0.3);
      ctx.lineTo(frameX + Math.cos(a) * frameR, frameY + Math.sin(a) * frameR);
      ctx.stroke();
    }

    // Cargo capsules
    if (layers.cargo) {
      const capsuleY = frameY - frameR * 0.3;
      const capsuleX = frameX + Math.sin(t * 1.2) * frameR * 0.5;
      ctx.fillStyle = "hsl(43 85% 45%)";
      roundRect(ctx, capsuleX - 12, capsuleY - 5, 24, 10, 3);
      ctx.fill();

      // Second capsule
      const cx2 = frameX + Math.sin(t * 0.8 + 2) * frameR * 0.6;
      ctx.fillStyle = "hsl(43 70% 40%)";
      roundRect(ctx, cx2 - 10, capsuleY + 8 - 4, 20, 8, 3);
      ctx.fill();
    }

    // Passenger capsules
    if (layers.passenger) {
      const pY = frameY + frameR * 0.15;
      const pX = frameX + Math.cos(t * 0.9) * frameR * 0.4;
      ctx.fillStyle = "hsl(168 58% 55%)";
      roundRect(ctx, pX - 14, pY - 6, 28, 12, 4);
      ctx.fill();
    }

    // N-Recovery particles
    if (layers.nRecovery) {
      ctx.fillStyle = "rgba(100, 180, 255, 0.6)";
      for (let i = 0; i < 20; i++) {
        const px = frameX + (Math.sin(i * 1.7 + t * 0.5) * frameR * 1.5);
        const py = frameY - (((t * 20 + i * 30) % (h * 0.5)));
        if (py > waterTop && py < bankBottom) {
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Energy vectors
    if (layers.energy) {
      ctx.strokeStyle = "rgba(231, 76, 60, 0.4)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const angle = (t * 0.3 + i * Math.PI * 2 / 5) % (Math.PI * 2);
        ctx.beginPath();
        ctx.moveTo(frameX + Math.cos(angle) * frameR, frameY + Math.sin(angle) * frameR);
        ctx.lineTo(frameX + Math.cos(angle) * frameR * 1.6, frameY + Math.sin(angle) * frameR * 1.6);
        ctx.stroke();
      }
    }

    // Sensor dots
    if (layers.sensors) {
      for (let i = 0; i < 8; i++) {
        const angle = i * Math.PI * 2 / 8;
        const sx = frameX + Math.cos(angle) * frameR * 1.1;
        const sy = frameY + Math.sin(angle) * frameR * 1.1;
        const blink = Math.sin(t * 3 + i) > 0;
        ctx.fillStyle = blink ? "hsl(50 80% 60%)" : "hsl(50 80% 60% / 0.2)";
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Labels
    ctx.fillStyle = "hsl(210 10% 50%)";
    ctx.font = "10px 'IBM Plex Mono'";
    ctx.fillText("WATER SURFACE", waterLeftAtTop + 10, waterTop - 8);
    ctx.fillText("CANAL BED", bottomLeft + 10, bankBottom + 14);
    ctx.fillText("DELTASPINE FRAME Ø1.9m", frameX - 70, frameY + frameR + 20);

    animRef.current = requestAnimationFrame(draw);
  }, [layers]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);
    animRef.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return (
    <section className="border-b border-border bg-background min-h-screen">
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-94px)]">
        {/* Side Panel */}
        <div className="w-full lg:w-[380px] bg-card border-r border-border p-8 lg:p-10 flex flex-col gap-6 lg:overflow-y-auto lg:max-h-[calc(100vh-94px)] lg:sticky lg:top-[94px]">
          <h3 className="section-label pb-3 border-b border-border">OPERATIONAL SIMULATION — DSN-2026</h3>

          {/* Scene Buttons */}
          {scenes.map((s, i) => (
            <button
              key={s.num}
              onClick={() => setActiveScene(i)}
              className={`block w-full text-left border-l-2 px-4 py-3 transition-all ${
                activeScene === i
                  ? "border-accent-foreground bg-accent/10"
                  : "border-border hover:border-primary hover:bg-primary/5"
              }`}
            >
              <span className={`font-mono text-[0.58rem] tracking-[0.2em] block mb-1 ${activeScene === i ? "text-teal" : "text-muted-foreground"}`}>
                SCENE {s.num}
              </span>
              <span className="font-sans text-[0.82rem] font-medium text-foreground block leading-[1.3]">{s.title}</span>
              <span className="font-mono text-[0.62rem] text-muted-foreground mt-1 block">{s.meta}</span>
            </button>
          ))}

          {/* Layer Toggles */}
          <div className="pt-2 border-t border-border">
            <span className="font-mono text-[0.58rem] tracking-[0.2em] text-muted-foreground uppercase block mb-3">Display Layers</span>
            {layerDefs.map((l) => (
              <button
                key={l.key}
                onClick={() => toggleLayer(l.key)}
                className="flex items-center gap-2.5 py-2 border-b border-border/50 w-full text-left last:border-b-0"
              >
                <div
                  className="w-2 h-2 rounded-full border transition-all"
                  style={{
                    borderColor: layers[l.key] ? l.color : "hsl(210 10% 50%)",
                    backgroundColor: layers[l.key] ? l.color : "transparent",
                  }}
                />
                <span className={`font-mono text-[0.68rem] tracking-[0.1em] transition-colors ${layers[l.key] ? "text-foreground" : "text-muted-foreground"}`}>
                  {l.label}
                </span>
              </button>
            ))}
          </div>

          {/* Telemetry */}
          <div className="pt-2 border-t border-border">
            <span className="font-mono text-[0.58rem] tracking-[0.2em] text-muted-foreground uppercase block mb-3">LIVE TELEMETRY</span>
            {[
              ["FRAME DEPTH", `${telemetry.depth} m`],
              ["WATER TEMP", `${telemetry.temp} °C`],
              ["CANAL pH", telemetry.ph],
              ["N LOAD TODAY", `${telemetry.nLoad} kg`],
              ["ENERGY REC.", `${telemetry.energy}%`],
              ["ACTIVE CAPSULES", telemetry.capsules],
              ["FLOOD RISK", telemetry.flood],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-baseline py-1.5 border-b border-border/40">
                <span className="font-mono text-[0.6rem] tracking-[0.1em] text-muted-foreground">{k}</span>
                <span className="font-mono text-[0.72rem] text-teal">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative min-h-[500px]">
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Corner ref */}
          <span className="absolute top-5 right-6 font-mono text-[0.6rem] text-muted-foreground tracking-[0.1em] opacity-70">
            DSN-2026 · SIMULATION v1.0 · CANAL SECTION ΔA-04
          </span>

          {/* Bottom info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12" style={{ background: "linear-gradient(to top, rgba(13,17,23,0.97) 40%, transparent 100%)" }}>
            <span className="section-label block mb-2">
              SECTION ΔA-04 · UTRECHT–AMSTERDAM · PHASE 1
            </span>
            <h3 className="font-serif text-2xl font-bold text-foreground mb-2.5 leading-[1.15]">
              {scenes[activeScene].title}
            </h3>
            <p className="font-sans text-[0.85rem] font-light text-foreground/65 max-w-[560px] leading-[1.65]">
              {scenes[activeScene].desc}
            </p>
            <div className="flex gap-6 mt-5">
              {[
                ["4 km", "pilot length"],
                ["Ø 1.9m", "frame diameter"],
                ["+150 yr", "service life"],
              ].map(([val, lbl]) => (
                <span key={lbl} className="font-mono text-[0.68rem]">
                  <span className="text-teal font-medium">{val}</span>
                  <span className="text-muted-foreground ml-1.5">{lbl}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export default CanalSimulation;
