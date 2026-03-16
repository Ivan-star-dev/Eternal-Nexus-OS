/**
 * VignetteOverlay — Cinematic vignette for Atlas (tightened framing).
 */
const VignetteOverlay = () => (
  <div
    className="fixed inset-0 pointer-events-none z-[2]"
    style={{
      background:
        'radial-gradient(ellipse 65% 65% at 50% 50%, transparent 35%, hsl(var(--background) / 0.78) 100%)',
    }}
  />
);

export default VignetteOverlay;
