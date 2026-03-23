import { useState } from "react";
import { useLanguage, languageLabels, languageFlags, type Language } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="font-mono text-[0.5rem] tracking-[0.18em] uppercase text-paper-dim/60 hover:text-gold transition-colors flex items-center gap-1.5"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{languageFlags[language]}</span>
        <span>{language.toUpperCase()}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-1 z-50 bg-ink-medium border border-white/[0.08] rounded-sm shadow-xl min-w-[160px]"
            role="listbox"
            aria-label="Select language"
          >
            {(Object.keys(languageLabels) as Language[]).map((lang) => (
              <button
                key={lang}
                role="option"
                aria-selected={lang === language}
                onClick={() => {
                  setLanguage(lang);
                  setOpen(false);
                }}
                className={`w-full text-left flex items-center gap-2.5 font-mono text-[0.5rem] tracking-[0.15em] uppercase px-4 py-2 transition-colors duration-200 ${
                  lang === language
                    ? "text-gold"
                    : "text-paper-dim hover:text-gold hover:bg-ink-medium/60"
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
