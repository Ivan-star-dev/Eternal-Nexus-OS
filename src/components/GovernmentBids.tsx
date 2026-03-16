import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Send, Briefcase, MessageSquare, HelpCircle, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

interface GovernmentBidsProps {
  projectId: string;
}

const bidTypes = [
  { value: "expression_of_interest", label: "EXPRESSION OF INTEREST", icon: Briefcase, desc: "Formal expression of governmental interest in the project" },
  { value: "bid", label: "FORMAL BID / PROPOSAL", icon: DollarSign, desc: "Submit a funding or partnership proposal" },
  { value: "feedback", label: "TECHNICAL FEEDBACK", icon: MessageSquare, desc: "Technical comments, concerns or suggestions" },
  { value: "inquiry", label: "OFFICIAL INQUIRY", icon: HelpCircle, desc: "Request for additional information or clarification" },
];

const GovernmentBids = ({ projectId }: GovernmentBidsProps) => {
  const { user, profile } = useAuth();
  const [bidType, setBidType] = useState("expression_of_interest");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user || !profile) {
    return (
      <section className="border-t border-border py-16 md:py-20 px-6 md:px-20">
        <div className="max-w-[800px] mx-auto text-center">
          <Briefcase className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
            Government <span className="text-muted-foreground font-normal">Communications</span>
          </h2>
          <div className="gold-rule mx-auto mb-6" />
          <p className="font-sans text-sm text-muted-foreground mb-6">
            Submit bids, expressions of interest, or official inquiries. Government authentication required.
          </p>
          <Link
            to="/access"
            className="inline-block py-3 px-6 border border-primary text-primary font-mono text-[0.68rem] tracking-[0.12em] hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            AUTHENTICATE TO PROCEED
          </Link>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("government_bids").insert({
        user_id: user.id,
        project_id: projectId,
        bid_type: bidType,
        subject: subject.trim(),
        message: message.trim(),
        institution: profile.institution,
        country: profile.country,
        contact_name: profile.full_name,
        contact_email: profile.official_email,
      });
      if (error) throw error;

      // Log the action
      await supabase.from("edit_logs").insert({
        user_id: user.id,
        entity_type: "government_bid",
        entity_id: projectId,
        action: `bid_submitted:${bidType}`,
        changes: { subject: subject.trim(), bid_type: bidType },
        institution: profile.institution,
      });

      toast({ title: "Submission received", description: `Your ${bidType.replace(/_/g, " ")} has been recorded and logged.` });
      setSubject("");
      setMessage("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-t border-border py-16 md:py-20 px-6 md:px-20"
    >
      <div className="max-w-[800px] mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Official <span className="text-muted-foreground font-normal">Communications</span>
          </h2>
        </div>
        <div className="gold-rule mb-8" />

        <div className="font-mono text-[0.62rem] tracking-[0.1em] text-muted-foreground mb-6">
          SUBMITTING AS: <span className="text-foreground">{profile.full_name}</span> · <span className="text-primary">{profile.institution}</span> · {profile.country}
          <br />
          <span className="text-destructive-foreground">ALL SUBMISSIONS ARE LOGGED WITH TIMESTAMP, ENTITY AND IP</span>
        </div>

        {/* Bid type selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {bidTypes.map((bt) => (
            <button
              key={bt.value}
              type="button"
              onClick={() => setBidType(bt.value)}
              className={`text-left border p-4 transition-all ${
                bidType === bt.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <bt.icon className={`w-3.5 h-3.5 ${bidType === bt.value ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`font-mono text-[0.6rem] tracking-[0.1em] ${bidType === bt.value ? "text-primary" : "text-muted-foreground"}`}>
                  {bt.label}
                </span>
              </div>
              <p className="font-sans text-[0.72rem] text-muted-foreground leading-relaxed">{bt.desc}</p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject / Reference"
            className="w-full bg-background border border-border px-4 py-3 font-mono text-[0.72rem] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors"
          />
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your official communication..."
            rows={6}
            className="w-full bg-background border border-border px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !subject.trim() || !message.trim()}
            className="py-3 px-6 bg-primary text-primary-foreground font-mono text-[0.68rem] tracking-[0.12em] hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            SUBMIT OFFICIAL COMMUNICATION
          </button>
        </form>
      </div>
    </motion.section>
  );
};

export default GovernmentBids;
