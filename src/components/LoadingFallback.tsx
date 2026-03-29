export default function LoadingFallback() {
  return (
    <div className="min-h-[200px] flex flex-col items-center justify-center">
      <div className="border border-white/[0.08] border-t-gold/60 animate-spin rounded-full w-6 h-6" />
      <span className="font-mono text-[0.45rem] tracking-[0.28em] uppercase text-paper-dim/30 mt-4">
        LOADING SYSTEM MODULE
      </span>
    </div>
  );
}
