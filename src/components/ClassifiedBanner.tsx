import { useContext } from "react";
import { LanguageContext } from "@/contexts/LanguageContext";

const fallbackT = (key: string) => {
  const fallbacks: Record<string, string> = {
    banner_confidential: "CONFIDENTIAL",
    banner_division: "NEXT PATH INFRA · STRATEGIC DIVISION",
    banner_restricted: "RESTRICTED ACCESS",
  };
  return fallbacks[key] || key;
};

const ClassifiedBanner = () => {
  const ctx = useContext(LanguageContext);
  const t = ctx?.t ?? fallbackT;

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] h-9 bg-destructive flex items-center justify-center gap-10 border-b border-destructive/80">
      <span className="font-mono text-[0.65rem] font-medium tracking-[0.25em] text-foreground/90">
        {t("banner_confidential")}
      </span>
      <span className="font-mono text-[0.65rem] font-medium tracking-[0.25em] text-foreground/90 hidden sm:inline">
        {t("banner_division")}
      </span>
      <span className="font-mono text-[0.65rem] font-medium tracking-[0.25em] text-foreground/90">
        {t("banner_restricted")}
      </span>
    </div>
  );
};

export default ClassifiedBanner;