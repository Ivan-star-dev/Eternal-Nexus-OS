import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import projectLocations from "@/data/projectLocations";

interface MobileGlobeMapProps {
  onHotspotClick?: (id: string) => void;
}

// Simple SVG world map fallback for mobile
const MobileGlobeMap = ({ onHotspotClick }: MobileGlobeMapProps) => {
  // Convert lat/lng to SVG coordinates (simple equirectangular projection)
  const toSvg = (lat: number, lng: number) => ({
    x: ((lng + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100,
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 0 }}>
      <svg viewBox="0 0 100 50" className="w-full max-w-[600px] opacity-20">
        {/* Simple continent outlines */}
        <ellipse cx="50" cy="25" rx="48" ry="23" fill="none" stroke="hsl(42 78% 45%)" strokeWidth="0.15" opacity="0.3" />
        <line x1="2" y1="25" x2="98" y2="25" stroke="hsl(42 78% 45%)" strokeWidth="0.08" opacity="0.2" />
        <line x1="50" y1="2" x2="50" y2="48" stroke="hsl(42 78% 45%)" strokeWidth="0.08" opacity="0.2" />
        {/* Grid lines */}
        {[10, 20, 30, 40].map((y) => (
          <line key={`h${y}`} x1="2" y1={y} x2="98" y2={y} stroke="hsl(42 78% 45%)" strokeWidth="0.05" opacity="0.1" />
        ))}
        {[20, 40, 60, 80].map((x) => (
          <line key={`v${x}`} x1={x} y1="2" x2={x} y2="48" stroke="hsl(42 78% 45%)" strokeWidth="0.05" opacity="0.1" />
        ))}
      </svg>

      {/* Hotspot dots */}
      <div className="absolute inset-0">
        {projectLocations.map((p) => {
          const { x, y } = toSvg(p.lat, p.lng);
          return (
            <Link
              key={p.id}
              to={`/project/${p.id}`}
              className="absolute group"
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
              onClick={() => onHotspotClick?.(p.id)}
            >
              <motion.div
                className="w-3 h-3 rounded-full border-2"
                style={{ background: p.color, borderColor: p.color }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 border border-border px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity min-w-[120px] pointer-events-none">
                <span className="font-mono text-[0.45rem] tracking-[0.1em] text-primary block">{p.number}</span>
                <span className="font-serif text-[0.6rem] font-bold text-foreground block">{p.title}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileGlobeMap;
