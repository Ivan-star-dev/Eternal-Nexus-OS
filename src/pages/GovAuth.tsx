import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import { Shield, Lock, Fingerprint, ChevronRight, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const govIdTypes = [
  { value: "national_id", label: "National ID Card" },
  { value: "diplomatic_id", label: "Diplomatic ID" },
  { value: "government_badge", label: "Government Badge / Pass" },
  { value: "ministry_credential", label: "Ministry Credential" },
  { value: "passport_diplomatic", label: "Diplomatic Passport" },
  { value: "eu_official_id", label: "EU Official ID" },
];

const countries = [
  "Netherlands", "Germany", "France", "Belgium", "United Kingdom",
  "Norway", "Sweden", "Denmark", "Portugal", "Brazil",
  "United States", "European Union",
];

const purposes = [
  "Technical review and assessment",
  "Investment and funding evaluation",
  "Regulatory compliance review",
  "Partnership and collaboration",
  "Research and due diligence",
  "Procurement and bidding",
];

const GovAuth = () => {
  const { t } = useLanguage();
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "", password: "", full_name: "", institution: "", country: "",
    position: "", department: "", official_email: "", purpose: "",
    gov_id_type: "", gov_id_number: "", gov_id_country: "",
    auth_code: "",
  });

  const totalSteps = mode === "register" ? 3 : 1;
  const inputClass = "w-full bg-background border border-border px-4 py-3 font-mono text-[0.72rem] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "register" && step < totalSteps) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        if (!form.gov_id_type || !form.gov_id_number || !form.gov_id_country) {
          toast({ title: "Error", description: "Government ID credentials are required.", variant: "destructive" });
          setLoading(false);
          return;
        }
        await signUp(form.email || form.official_email, form.password, {
          full_name: form.full_name,
          institution: form.institution,
          country: form.country,
          position: form.position,
          department: form.department || null,
          official_email: form.official_email || form.email,
          gov_id_type: form.gov_id_type,
          gov_id_number: form.gov_id_number,
          gov_id_country: form.gov_id_country,
        });
        toast({ title: "Registration submitted", description: "Please check your email to confirm." });
      } else {
        await signIn(form.email, form.password);
        toast({ title: "Authenticated", description: "Access granted." });
        navigate("/");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  return (
    <Layout>
      <section className="py-16 md:py-24 px-6 md:px-20 relative">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg,transparent,transparent 79px,hsl(var(--primary) / 0.4) 80px), repeating-linear-gradient(0deg,transparent,transparent 79px,hsl(var(--primary) / 0.4) 80px)",
          }}
        />

        <div className="max-w-[600px] mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Header */}
            <span className="section-label flex items-center gap-2 mb-4">
              <span className="w-7 h-px bg-primary inline-block" />
              RESTRICTED ACCESS PROTOCOL
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Government <span className="text-primary">Authentication</span>
            </h1>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-8 max-w-lg">
              This platform is restricted to verified government entities and authorised institutional
              representatives. All sessions are logged, timestamped, and attributed.
            </p>

            {/* Auth Box */}
            <div className="border border-primary/20 bg-card overflow-hidden">
              {/* Box Header */}
              <div className="bg-secondary/50 px-6 py-4 border-b border-border flex items-center justify-between">
                <span className="font-mono text-[0.62rem] tracking-[0.14em] text-foreground/80">
                  Next Path Infra · Secure Authentication · Step {step} of {totalSteps}
                </span>
                <span className="font-mono text-[0.55rem] tracking-[0.15em] text-destructive-foreground bg-destructive/80 px-2 py-0.5">
                  RESTRICTED
                </span>
              </div>

              {/* Warning */}
              <div className="mx-6 mt-5 bg-destructive/5 border border-destructive/20 p-3 flex gap-3 items-start">
                <AlertTriangle className="w-4 h-4 text-destructive-foreground flex-shrink-0 mt-0.5" />
                <p className="font-mono text-[0.58rem] tracking-[0.04em] text-muted-foreground leading-relaxed">
                  Unauthorised access attempts are logged and may be referred to relevant legal authorities.
                  Accessing this platform constitutes acceptance of the Next Path Infra terms of access and IP protection policy.
                </p>
              </div>

              {/* Mode toggle */}
              <div className="flex border-b border-border mx-6 mt-5">
                <button
                  onClick={() => { setMode("login"); setStep(1); }}
                  className={`flex-1 py-3 font-mono text-[0.62rem] tracking-[0.12em] transition-colors border-b-2 ${
                    mode === "login" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  AUTHENTICATE
                </button>
                <button
                  onClick={() => { setMode("register"); setStep(1); }}
                  className={`flex-1 py-3 font-mono text-[0.62rem] tracking-[0.12em] transition-colors border-b-2 ${
                    mode === "register" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  REGISTER CREDENTIALS
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <AnimatePresence mode="wait">
                  {mode === "login" && (
                    <motion.div key="login" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="space-y-4">
                      <input type="email" required placeholder="Official Government Email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
                      <input type="password" required minLength={8} placeholder="Secure Password" value={form.password} onChange={(e) => update("password", e.target.value)} className={inputClass} />
                    </motion.div>
                  )}

                  {mode === "register" && step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="space-y-4">
                      <div className="border-l-2 border-primary pl-4 mb-1">
                        <span className="font-mono text-[0.55rem] tracking-[0.2em] text-primary uppercase">INSTITUTIONAL INFORMATION</span>
                      </div>
                      <input type="text" required placeholder="Government / Institution Name" value={form.institution} onChange={(e) => update("institution", e.target.value)} className={inputClass} />
                      <div className="grid grid-cols-2 gap-4">
                        <select required value={form.country} onChange={(e) => update("country", e.target.value)} className={`${inputClass} appearance-none`}>
                          <option value="" disabled>Country</option>
                          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input type="text" required placeholder="Ministry / Department" value={form.department} onChange={(e) => update("department", e.target.value)} className={inputClass} />
                      </div>
                      <input type="text" required placeholder="Authorised Representative — Full Name" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} className={inputClass} />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="email" required placeholder="Official Email" value={form.official_email} onChange={(e) => update("official_email", e.target.value)} className={inputClass} />
                        <select value={form.purpose} onChange={(e) => update("purpose", e.target.value)} className={`${inputClass} appearance-none`}>
                          <option value="" disabled>Purpose of Access</option>
                          {purposes.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {mode === "register" && step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="space-y-4">
                      <div className="border-l-2 border-destructive pl-4 mb-1">
                        <span className="font-mono text-[0.55rem] tracking-[0.2em] text-destructive-foreground uppercase flex items-center gap-2">
                          <Fingerprint className="w-3.5 h-3.5" />
                          GOVERNMENT ID VERIFICATION — REQUIRED
                        </span>
                      </div>
                      <select required value={form.gov_id_type} onChange={(e) => update("gov_id_type", e.target.value)} className={`${inputClass} appearance-none`}>
                        <option value="" disabled>Select Government ID Type</option>
                        {govIdTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" required placeholder="ID Number" value={form.gov_id_number} onChange={(e) => update("gov_id_number", e.target.value)} className={inputClass} />
                        <input type="text" required placeholder="Issuing Country" value={form.gov_id_country} onChange={(e) => update("gov_id_country", e.target.value)} className={inputClass} />
                      </div>
                      <input type="text" required placeholder="Position / Official Title" value={form.position} onChange={(e) => update("position", e.target.value)} className={inputClass} />
                      <div className="bg-destructive/5 border border-destructive/20 p-3">
                        <p className="font-mono text-[0.55rem] tracking-[0.04em] text-muted-foreground leading-relaxed">
                          <span className="text-destructive-foreground font-medium">⚠ VERIFICATION NOTICE</span> — Your credentials will be verified against official databases. False credentials constitute a criminal offence.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {mode === "register" && step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="space-y-4">
                      <div className="border-l-2 border-primary pl-4 mb-1">
                        <span className="font-mono text-[0.55rem] tracking-[0.2em] text-primary uppercase">ACCOUNT CREDENTIALS</span>
                      </div>
                      <input type="email" required placeholder="Official Email (login)" value={form.email || form.official_email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
                      <input type="password" required minLength={8} placeholder="Secure Password (min. 8 characters)" value={form.password} onChange={(e) => update("password", e.target.value)} className={inputClass} />
                      <input type="text" placeholder="Access Authorisation Code (if provided)" value={form.auth_code} onChange={(e) => update("auth_code", e.target.value)} className={inputClass} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border mt-6">
                  {/* Step indicators */}
                  <div className="flex gap-1.5">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-6 h-[3px] rounded-sm transition-colors ${
                          i + 1 < step ? "bg-primary" : i + 1 === step ? "bg-accent" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {mode === "register" && step > 1 && (
                      <button type="button" onClick={() => setStep(step - 1)}
                        className="px-4 py-2.5 border border-border font-mono text-[0.62rem] tracking-[0.1em] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                        BACK
                      </button>
                    )}
                    <button type="submit" disabled={loading}
                      className="px-6 py-2.5 bg-primary text-primary-foreground font-mono text-[0.62rem] tracking-[0.12em] hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5" />
                      {mode === "register" && step < totalSteps ? "CONTINUE" : mode === "register" ? "SUBMIT FOR VERIFICATION" : "AUTHENTICATE"}
                      {mode === "register" && step < totalSteps && <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Legal */}
            <p className="mt-6 font-mono text-[0.52rem] tracking-[0.06em] text-muted-foreground/50 text-center leading-relaxed">
              Encrypted connection · Session permanently recorded · All data subject to NPI security protocol<br />
              © 2026 Ivanildo Michel Monteiro Fernandes
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default GovAuth;
