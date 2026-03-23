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
      <span className="font-display text-[0.65rem] font-semibold tracking-[0.2em] text-primary">
        {num}
      </span>
      <span className="mt-1 block font-serif text-lg font-semibold italic tracking-tight text-foreground md:text-xl">
        {name}
      </span>
      <span className="mt-2 block font-serif text-sm italic text-muted-foreground md:hidden">{line}</span>
      <span className="mt-1 block font-mono text-[0.5rem] leading-snug tracking-[0.12em] text-teal-light md:hidden">
        {detail}
      </span>
      <span
        className={cn(
          "mt-2 hidden max-h-0 overflow-hidden font-serif text-sm italic text-primary/85 opacity-0 transition-all duration-300 ease-out",
          "md:group-hover:max-h-24 md:group-hover:opacity-100 md:block",
        )}
      >
        {line}
      </span>
      <span
        className={cn(
          "mt-1 hidden max-h-0 overflow-hidden font-mono text-[0.5rem] leading-relaxed tracking-[0.14em] text-teal-light opacity-0 transition-all duration-300 ease-out",
          "md:group-hover:max-h-16 md:group-hover:opacity-100 md:block",
        )}
      >
        {detail}
      </span>
    </>
  );

  const shellClass =
    "group flex flex-1 flex-col items-center px-5 py-4 text-center transition-colors hover:bg-primary/5 md:items-start md:text-left md:py-5";

  if (href.startsWith("#")) {
    return (
      <a href={href} className={cn(shellClass, index > 0 && "md:border-l md:border-border/30")}>
        {inner}
      </a>
    );
  }

  return (
    <Link to={href} className={cn(shellClass, index > 0 && "md:border-l md:border-border/30")}>
      {inner}
    </Link>
  );
}

/** Canonical trinity — glass panel, equal dignity; desktop hover reveals Cormorant + JetBrains layers. */
const TrinityRow = () => (
  <div className="relative z-10 mt-6 w-full max-w-5xl px-4 sm:px-6">
    <div
      className="flex flex-col overflow-hidden rounded-xl border border-border/35 bg-card/25 shadow-[0_0_0_1px_hsl(var(--foreground)/0.04)_inset] backdrop-blur-md md:flex-row md:rounded-2xl"
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
