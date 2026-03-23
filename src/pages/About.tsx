import { useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Shield, Globe, Award, Fingerprint } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = "About — Eternal Nexus";
  }, []);

  return (
    <Layout>
      <section className="relative min-h-[50vh] flex flex-col justify-end overflow-hidden bg-ink-deep">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 49px, hsl(var(--border)) 50px)",
        }} />

        <div className="relative z-10 py-20 sm:py-28 px-4 sm:px-6 md:px-16 max-w-[1200px]">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="stamp-classified inline-block mb-6">
            {t("about_personnel")}
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="font-mono text-[0.48rem] tracking-[0.28em] uppercase text-gold/60 mb-4">
            {t("about_dossier")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="font-serif text-4xl md:text-6xl font-light text-foreground leading-[0.95]"
          >
            Ivanildo Michel<br />
            <span className="text-primary">Monteiro Fernandes</span>
          </motion.h1>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.6 }} className="gold-rule mt-8 origin-left" />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="flex flex-wrap gap-6 mt-8 font-mono text-[0.68rem] tracking-[0.12em] text-muted-foreground"
          >
            <span>{t("about_nationality")}: <span className="text-foreground">CAPE VERDE 🇨🇻</span></span>
            <span>{t("about_age")}: <span className="text-foreground">28</span></span>
            <span>{t("about_role")}: <span className="text-primary">{t("about_founder")}</span></span>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border py-16 md:py-24 px-6 md:px-20">
        <div className="max-w-[800px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="font-mono text-[0.48rem] tracking-[0.28em] uppercase text-gold/60">{t("section_01")}</span>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mt-3 mb-2">
              {t("about_vision")} <span className="text-muted-foreground font-normal">{t("about_mission")}</span>
            </h2>
            <div className="gold-rule mb-8" />
            <div className="space-y-6 font-sans text-sm text-muted-foreground leading-[1.9]">
              <p>{t("about_bio_1")}</p>
              <p>{t("about_bio_2")}</p>
              <p>{t("about_bio_3")}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border py-16 md:py-24 px-6 md:px-20 bg-card">
        <div className="max-w-[1200px] mx-auto">
          <span className="section-label">{t("section_02")}</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mt-3 mb-2">
            {t("about_ip")} <span className="text-muted-foreground font-normal">{t("about_ip_protection")}</span>
          </h2>
          <div className="gold-rule mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Shield, title: t("about_copyright_title"), desc: t("about_copyright_desc") },
              { icon: Fingerprint, title: t("about_tracked_title"), desc: t("about_tracked_desc") },
              { icon: Globe, title: t("about_international_title"), desc: t("about_international_desc") },
              { icon: Award, title: t("about_prior_art_title"), desc: t("about_prior_art_desc") },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-border p-7 bg-background hover:border-primary transition-colors duration-300"
              >
                <item.icon className="w-5 h-5 text-primary mb-4" />
                <h3 className="font-serif text-lg font-bold text-foreground mb-3">{item.title}</h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 border border-destructive bg-destructive/10 p-6"
          >
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-mono text-[0.72rem] tracking-[0.15em] text-destructive-foreground font-medium uppercase mb-2">
                  {t("about_warning_title")}
                </h4>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">{t("about_warning_desc")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
