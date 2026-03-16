import { useState } from "react";
import { useLanguage, languageLabels, languageFlags, type Language } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="font-mono text-[0.62rem] tracking-[0.1em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 border border-border px-2.5 py-1.5 bg-card"
      >
        <span>{languageFlags[language]}</span>
        <span>{language.toUpperCase()}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border min-w-[160px] shadow-lg">
            {(Object.keys(languageLabels) as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 font-mono text-[0.68rem] tracking-[0.08em] flex items-center gap-2.5 transition-colors ${
                  lang === language
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <span>{languageFlags[lang]}</span>
                <span>{languageLabels[lang]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
