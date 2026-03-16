import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const sections = [
  { num: "01", title: "Acceptance of Terms", body: "By accessing this platform, you acknowledge and agree to be bound by these Terms of Use. This platform is operated by Ivanildo Michel Monteiro Fernandes ('the Author') and contains proprietary intellectual property of the highest confidentiality. Continued use constitutes acceptance of all terms herein." },
  { num: "02", title: "Intellectual Property Rights", body: "ALL content on this platform — including but not limited to conceptual designs, whitepapers, technical specifications, visual simulations, architectural plans, cost models, and strategic proposals — is the exclusive intellectual property of Ivanildo Michel Monteiro Fernandes. These materials are protected under international copyright law, the Berne Convention for the Protection of Literary and Artistic Works, and WIPO Copyright Treaty." },
  { num: "03", title: "Prohibited Activities", body: "The following activities are strictly prohibited without explicit written authorization from the Author: (a) reproduction, distribution, or publication of any materials; (b) implementation of any infrastructure concept in whole or in part; (c) creation of derivative works based on the concepts presented; (d) sharing of access credentials with unauthorized parties; (e) any commercial use of the information contained herein." },
  { num: "04", title: "Access Monitoring & Tracking", body: "All access to this platform is continuously monitored, logged, and tracked. This includes but is not limited to: document views, downloads, session duration, IP addresses, device fingerprints, and geographic location. This data is retained indefinitely and may be used as evidence in legal proceedings related to intellectual property infringement." },
  { num: "05", title: "Government & Institutional Access", body: "Access to detailed whitepapers and technical dossiers requires verified government or institutional credentials. All downloads are registered with the accessing entity's details and a secondary tracking report is generated. The downloading entity acknowledges that the materials are for evaluation purposes only and do not constitute a license to implement." },
  { num: "06", title: "Liability & Enforcement", body: "Any unauthorized use of the intellectual property contained on this platform will result in immediate legal action. The Author reserves the right to pursue damages under all applicable jurisdictions. Violators will be subject to civil and criminal penalties as permitted by law." },
  { num: "07", title: "Governing Law", body: "These terms shall be governed by and construed in accordance with international intellectual property law. The Author reserves the right to initiate legal proceedings in any jurisdiction where infringement has occurred or where the infringing party is domiciled." },
];

const Terms = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <section className="py-16 md:py-24 px-6 md:px-20">
        <div className="max-w-[800px] mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <span className="section-label">{t("legal_doc")}</span>
            <h1 className="font-serif text-3xl md:text-5xl font-black text-foreground mt-3 mb-2">
              {t("terms_title")} <span className="text-muted-foreground font-normal">of Use</span>
            </h1>
            <div className="gold-rule mb-4" />
            <p className="font-mono text-[0.62rem] tracking-[0.15em] text-muted-foreground mb-12">{t("legal_updated")}</p>
          </motion.div>

          <div className="space-y-12">
            {sections.map((section, i) => (
              <motion.div key={section.num} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <span className="section-label">ARTICLE {section.num}</span>
                <h2 className="font-serif text-xl font-bold text-foreground mt-2 mb-2">{section.title}</h2>
                <div className="gold-rule mb-4" />
                <p className="font-sans text-sm text-muted-foreground leading-[1.8]">{section.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-16 border-t border-border pt-8 text-center"
          >
            <div className="gold-rule mx-auto mb-6" />
            <span className="font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground block mb-1">AUTHORIZED BY</span>
            <span className="font-serif text-lg text-foreground font-bold block">Ivanildo Michel Monteiro Fernandes</span>
            <span className="font-mono text-[0.55rem] tracking-[0.15em] text-primary block mt-1">{t("about_founder")} · NEXT PATH INFRA</span>
            <span className="font-mono text-[0.55rem] tracking-[0.15em] text-destructive block mt-3">© 2026 · {t("footer_rights")} · INTERNATIONAL COPYRIGHT PROTECTED</span>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
