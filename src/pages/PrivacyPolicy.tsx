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

  return (
    <Layout>
      <section className="py-16 md:py-24 px-6 md:px-20">
        <div className="max-w-[800px] mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <span className="section-label">{t("legal_doc")}</span>
            <h1 className="font-serif text-3xl md:text-5xl font-black text-foreground mt-3 mb-2">
              {t("privacy_title")} <span className="text-muted-foreground font-normal">Policy</span>
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
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
