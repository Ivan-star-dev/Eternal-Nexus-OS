import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const TRINITY = [
  {
    num: "01",
    name: "Heaven Lab",
    line: "Observatório e dossiê estratégico",
    detail: "Node-01 · referência viva",
    href: "#dossiers",
  },
  {
    num: "02",
    name: "Bridge Nova",
    line: "Atlas e ponte entre sistemas",
    detail: "Globo vivo · Layer 2",
    href: "/atlas",
  },
  {
    num: "03",
    name: "Nexus Cria",
    line: "Parlamento AI e síntese",
    detail: "Órgão cérebro · fluxo sagrado",
    href: "/nexus",
  },
] as const;

function TrinityCell({
  num,
  name,
  line,
  detail,
  href,
  index,
}: (typeof TRINITY)[number] & { index: number }) {
  const inner = (
    <>
      {/* Reference number — mono, quiet, system ID */}
      <span className="font-mono text-[0.48rem] tracking-[0.28em] text-primary/50">
        {num}
      </span>

      {/* Name — Cormorant light italic; commanding through restraint */}
      <span className="mt-2 block font-serif text-lg font-light italic tracking-[0.015em] text-foreground md:text-xl">
        {name}
      </span>

      {/* Detail line — always in DOM on desktop, uncovered on hover via opacity only.
          No max-height animation: cells hold their shape; text is revealed, not revealed by expansion. */}
      <span className="mt-2 hidden font-serif text-[0.78rem] font-light italic leading-snug text-foreground/48 opacity-0 transition-opacity duration-500 ease-out md:block md:group-hover:opacity-100">
        {line}
      </span>
      <span className="mt-1.5 hidden font-mono text-[0.44rem] leading-relaxed tracking-[0.2em] text-teal/55 opacity-0 transition-opacity duration-500 delay-75 ease-out md:block md:group-hover:opacity-100">
        {detail}
      </span>

      {/* Mobile: always visible, no hover dependency */}
      <span className="mt-2 block font-serif text-[0.78rem] italic text-muted-foreground/65 md:hidden">
        {line}
      </span>
      <span className="mt-1 block font-mono text-[0.44rem] tracking-[0.16em] text-teal/55 md:hidden">
        {detail}
      </span>
    </>
  );

  const shellClass = cn(
    "group flex flex-1 flex-col items-center px-6 py-6 text-center",
    "transition-colors duration-500 hover:bg-primary/[0.04]",
    "md:items-start md:text-left md:py-8 md:px-7",
    index > 0 && "md:border-l md:border-border/[0.14]",
  );

  if (href.startsWith("#")) {
    return <a href={href} className={shellClass}>{inner}</a>;
  }

  return <Link to={href} className={shellClass}>{inner}</Link>;
}

/** Canonical trinity panel — equal dignity, glass recessive, hover uncovers not expands. */
const TrinityRow = () => (
  <div className="relative z-10 mt-10 w-full max-w-5xl px-4 sm:px-6 md:mt-14">
    <div
      className="flex flex-col overflow-hidden rounded-2xl border border-border/[0.16] bg-background/[0.16] shadow-[0_0_0_1px_hsl(var(--foreground)/0.025)_inset] backdrop-blur-xl md:flex-row"
      role="list"
      aria-label="Tríade de produto: Heaven Lab, Bridge Nova, Nexus Cria"
    >
      {TRINITY.map((item, index) => (
        <TrinityCell key={item.name} {...item} index={index} />
      ))}
    </div>
  </div>
);

export default TrinityRow;
