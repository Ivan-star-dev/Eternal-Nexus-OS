import { useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const sections = [
  { num: "01", title: "Data Collection", body: "This platform collects and processes data necessary for the secure operation of the NEXT PATH INFRA portfolio. Data collected includes: access logs, IP addresses, device information, browser fingerprints, document download records, and any information voluntarily submitted through contact forms or government credential verification systems." },
  { num: "02", title: "Purpose of Data Processing", body: "All data is processed exclusively for: (a) ensuring the security and integrity of proprietary intellectual property; (b) maintaining an auditable trail of document access and downloads; (c) verifying the identity and authorization of government and institutional stakeholders; (d) compliance with international intellectual property law and regulatory requirements." },
  { num: "03", title: "Data Retention", body: "Access logs and download records are retained indefinitely as part of our intellectual property protection framework. This data serves as legal evidence of document distribution and may be used in enforcement proceedings. Personal data submitted through verification forms is retained for the duration of the professional relationship plus 10 years." },
  { num: "04", title: "Third-Party Sharing", body: "Personal data is not sold or shared with third parties for commercial purposes. Data may be disclosed to: (a) legal counsel in the event of intellectual property disputes; (b) law enforcement agencies when required by law; (c) international intellectual property organizations for registration and enforcement purposes." },
  { num: "05", title: "Security Measures", body: "All data is encrypted in transit and at rest using industry-standard protocols. Access to personal data is restricted to authorized personnel only. Regular security audits are conducted to ensure the integrity of our data protection systems." },
  { num: "06", title: "Your Rights", body: "Under applicable data protection regulations (including GDPR where applicable), you have the right to: access your personal data, request corrections, request deletion (subject to our legal retention obligations), and lodge complaints with your local data protection authority." },
  { num: "07", title: "Contact", body: "For privacy-related inquiries, contact the Data Protection Officer at the secure channels provided in the Contact section. All inquiries will be responded to within 30 business days." },
];

const PrivacyPolicy = () => {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = "Privacy Policy — Eternal Nexus OS";
  }, []);

  return (
    <Layout>
      <section className="py-16 md:py-24 px-6 md:px-20">
        <div className="max-w-[800px] mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <span className="font-mono text-[0.48rem] tracking-[0.25em] uppercase text-paper-dim/40">{t("legal_doc")}</span>
            <h1 className="font-serif text-3xl md:text-5xl font-light text-paper mt-3 mb-2">
              {t("privacy_title")} <span className="text-paper-dim/50">Policy</span>
            </h1>
            <div className="gold-rule mb-4" />
            <p className="font-mono text-[0.62rem] tracking-[0.15em] text-paper-dim/40 mb-12">{t("legal_updated")}</p>
          </motion.div>

          <div className="space-y-12">
            {sections.map((section, i) => (
              <motion.div key={section.num} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <div className="border-t border-white/[0.04] my-8" />
                <span className="font-mono text-[0.48rem] tracking-[0.25em] uppercase text-paper-dim/40">ARTICLE {section.num}</span>
                <h2 className="font-serif text-xl font-light text-paper mt-2 mb-3">{section.title}</h2>
                <p className="font-sans text-sm text-paper-dim/70 leading-relaxed">{section.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-16 border-t border-white/[0.04] pt-8 text-center"
          >
            <div className="gold-rule mx-auto mb-6" />
            <span className="font-mono text-[0.48rem] tracking-[0.25em] uppercase text-paper-dim/40 block mb-1">DATA PROTECTION OFFICER</span>
            <span className="font-serif text-lg text-paper font-light block">Ivanildo Michel Monteiro Fernandes</span>
            <span className="font-mono text-[0.48rem] tracking-[0.15em] text-paper-dim/40 block mt-1">NEXT PATH INFRA</span>
            <span className="font-mono text-[0.48rem] tracking-[0.15em] text-paper-dim/40 block mt-3">© 2026 · {t("footer_rights")} · GDPR COMPLIANT</span>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
