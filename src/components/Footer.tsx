import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import IPProtectionBanner from "./IPProtectionBanner";
import { EASE_OUT } from "@/lib/motion/config";

const ease = EASE_OUT;

const Footer = () => {
  const { t } = useLanguage();

  return (
    <>
      <IPProtectionBanner />
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="border-t border-white/[0.04] bg-background py-12 px-6 md:px-10"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="font-serif text-base font-bold text-foreground tracking-wide">
                NEXT PATH
              </span>
              <sup className="font-mono text-[0.55rem] text-primary tracking-[0.2em] ml-1.5 align-super">
                INFRA
              </sup>
              <p className="mt-3 font-sans text-sm text-muted-foreground leading-relaxed max-w-xs">
                Strategic infrastructure concepts and mega-project development by Ivanildo Michel Monteiro Fernandes.
              </p>
            </div>

            <div>
              <h4 className="font-mono text-[0.6rem] tracking-[0.25em] text-primary uppercase mb-4">
                {t("footer_navigation")}
              </h4>
              <div className="space-y-2">
                {[
                  { label: t("nav_dossier"), path: "/" },
                  { label: t("nav_about"), path: "/about" },
                  { label: t("privacy_title"), path: "/privacy" },
                  { label: t("terms_title"), path: "/terms" },
                ].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block font-mono text-[0.68rem] text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-mono text-[0.6rem] tracking-[0.25em] text-primary uppercase mb-4">
                {t("footer_classification")}
              </h4>
              <p className="font-mono text-[0.72rem] text-muted-foreground leading-relaxed">
                All materials contained within this portal are classified as CONFIDENTIAL. 
                Unauthorized distribution or reproduction is strictly prohibited.
              </p>
            </div>

            <div>
              <h4 className="font-mono text-[0.6rem] tracking-[0.25em] text-primary uppercase mb-4">
                {t("footer_legal")}
              </h4>
              <p className="font-mono text-[0.72rem] text-muted-foreground leading-relaxed">
                © 2026 Ivanildo Michel Monteiro Fernandes. All intellectual property rights reserved. 
                Protected under international copyright law and the Berne Convention.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-mono text-[0.6rem] tracking-[0.15em] text-muted-foreground">
              © 2026 NEXT PATH INFRA — IVANILDO MICHEL MONTEIRO FERNANDES — {t("footer_rights")}
            </span>
            <span className="font-mono text-[0.6rem] tracking-[0.15em] text-destructive">
              ● CONFIDENTIAL · STRATEGIC INFRASTRUCTURE · {t("footer_ip")}
            </span>
          </div>

          {/* Canonical copyright line */}
          <div className="mt-4 text-center">
            <span className="font-mono text-[0.48rem] tracking-[0.28em] text-paper-dim/30 uppercase">
              © 2026 · Eternal Nexus OS · Next Path Infrastructure Authority
            </span>
          </div>
        </div>
      </motion.footer>
    </>
  );
};

export default Footer;
