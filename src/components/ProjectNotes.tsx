import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Send } from "lucide-react";

interface ProjectNotesProps {
  projectId: string;
}

const noteTypes = ["general", "interest", "feedback", "question"] as const;

const ProjectNotes = ({ projectId }: ProjectNotesProps) => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [content, setContent] = useState("");
  const [noteType, setNoteType] = useState<string>("general");
  const [submitting, setSubmitting] = useState(false);

  if (!user || !profile) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("project_notes").insert({
        user_id: user.id,
        project_id: projectId,
        note_type: noteType,
        content: content.trim(),
        institution: profile.institution,
        country: profile.country,
      });
      if (error) throw error;
      toast({ title: "Note submitted", description: "Your feedback has been recorded." });
      setContent("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const typeLabels: Record<string, string> = {
    general: t("notes_type_general"),
    interest: t("notes_type_interest"),
    feedback: t("notes_type_feedback"),
    question: t("notes_type_question"),
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-t border-border py-16 md:py-20 px-6 md:px-20 bg-card"
    >
      <div className="max-w-[800px] mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="font-serif text-2xl font-bold text-foreground">
            {t("notes_title")} <span className="text-muted-foreground font-normal">{t("notes_subtitle")}</span>
          </h2>
        </div>
        <div className="gold-rule mb-8" />

        <div className="font-mono text-[0.62rem] tracking-[0.1em] text-muted-foreground mb-6">
          SUBMITTING AS: <span className="text-foreground">{profile.full_name}</span> · <span className="text-primary">{profile.institution}</span> · {profile.country}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {noteTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setNoteType(type)}
                className={`font-mono text-[0.62rem] tracking-[0.1em] px-3 py-1.5 border transition-colors ${
                  noteType === type
                    ? "border-primary text-primary bg-primary/5"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {typeLabels[type]}
              </button>
            ))}
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("notes_placeholder")}
            rows={4}
            className="w-full bg-background border border-border px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors resize-none"
          />

          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="py-3 px-6 bg-primary text-primary-foreground font-mono text-[0.68rem] tracking-[0.12em] hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {t("notes_submit")}
          </button>
        </form>
      </div>
    </motion.section>
  );
};

export default ProjectNotes;
