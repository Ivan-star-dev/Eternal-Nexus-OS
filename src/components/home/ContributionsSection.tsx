import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, MessageSquare, Send, LogIn } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { homeProjects } from "@/data/homeProjects";

const ease = [0.16, 1, 0.3, 1] as const;

interface Contribution {
  id: string;
  project_id: string;
  author_name: string;
  content: string;
  votes_up: number;
  votes_down: number;
  created_at: string;
  user_id: string;
}

interface UserVote {
  contribution_id: string;
  vote_type: "up" | "down";
}

const ContributionsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, "up" | "down">>({});
  const [showForm, setShowForm] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newProject, setNewProject] = useState(homeProjects[0]?.id || "");
  const [newName, setNewName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchContributions = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("public_contributions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setContributions(data as Contribution[]);
  }, []);

  const fetchUserVotes = useCallback(async () => {
    if (!user || !supabase) return;
    const { data } = await supabase
      .from("contribution_votes")
      .select("contribution_id, vote_type")
      .eq("user_id", user.id);
    if (data) {
      const map: Record<string, "up" | "down"> = {};
      (data as UserVote[]).forEach((v) => (map[v.contribution_id] = v.vote_type));
      setUserVotes(map);
    }
  }, [user]);

  useEffect(() => {
    fetchContributions();
    fetchUserVotes();

    if (!supabase) return;

    const channel = supabase
      .channel("contributions-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "public_contributions" }, () => {
        fetchContributions();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchContributions, fetchUserVotes]);

  const handleVote = async (contributionId: string, type: "up" | "down") => {
    if (!user) {
      toast({ title: "Login necessário", description: "Faça login para votar.", variant: "destructive" });
      return;
    }
    if (!supabase) return;

    const existing = userVotes[contributionId];

    if (existing === type) {
      // Remove vote
      await supabase.from("contribution_votes").delete().eq("contribution_id", contributionId).eq("user_id", user.id);
      setUserVotes((prev) => { const n = { ...prev }; delete n[contributionId]; return n; });
    } else if (existing) {
      // Change vote
      await supabase.from("contribution_votes").update({ vote_type: type }).eq("contribution_id", contributionId).eq("user_id", user.id);
      setUserVotes((prev) => ({ ...prev, [contributionId]: type }));
    } else {
      // New vote
      await supabase.from("contribution_votes").insert({ contribution_id: contributionId, user_id: user.id, vote_type: type });
      setUserVotes((prev) => ({ ...prev, [contributionId]: type }));
    }

    // Refetch to get updated counts
    setTimeout(fetchContributions, 500);
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!supabase) return;
    if (!newContent.trim() || !newName.trim()) {
      toast({ title: "Campos obrigatórios", description: "Preencha nome e sugestão.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("public_contributions").insert({
      project_id: newProject,
      user_id: user.id,
      author_name: newName.trim(),
      content: newContent.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Enviado!", description: "Sua contribuição foi registrada." });
      setNewContent("");
      setNewName("");
      setShowForm(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const getProjectName = (id: string) => homeProjects.find((p) => p.id === id)?.title || id;

  return (
    <section className="border-t border-border py-20 sm:py-28 px-4 sm:px-6 md:px-16 lg:px-20 bg-card/50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-12"
        >
          <span className="font-mono text-[0.55rem] tracking-[0.25em] text-muted-foreground uppercase">
            Comunidade
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-3">
            Contribuições <span className="text-primary italic font-light">Públicas</span>
          </h2>
          <p className="font-sans text-sm text-muted-foreground mt-3 max-w-md mx-auto">
            Sugestões validadas pela comunidade e integradas no ciclo Nexus. Realtime.
          </p>
          <div className="h-px w-20 mx-auto mt-6" style={{ background: "var(--gradient-gold)" }} />
        </motion.div>

        {/* Contributions list */}
        {contributions.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-sans text-sm text-muted-foreground">Nenhuma contribuição ainda. Seja o primeiro!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contributions.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ y: -2 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease }}
                className="border border-border bg-background p-5 sm:p-6 hover:border-primary/30 hover:shadow-[0_0_24px_-8px_hsl(var(--primary)/0.15)] transition-all duration-300"
              >
                <div className="flex gap-4">
                  {/* Vote column */}
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <button
                      onClick={() => handleVote(c.id, "up")}
                      className={`transition-all duration-200 hover:scale-125 active:scale-90 ${userVotes[c.id] === "up" ? "text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.5)]" : "text-muted-foreground hover:text-primary"}`}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-xs text-foreground font-medium">
                      {c.votes_up - c.votes_down}
                    </span>
                    <button
                      onClick={() => handleVote(c.id, "down")}
                      className={`transition-all duration-200 hover:scale-125 active:scale-90 ${userVotes[c.id] === "down" ? "text-destructive drop-shadow-[0_0_6px_hsl(var(--destructive)/0.5)]" : "text-muted-foreground hover:text-destructive"}`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="font-sans text-sm font-semibold text-primary">{c.author_name}</span>
                      <span className="font-mono text-[0.48rem] text-muted-foreground">•</span>
                      <span className="font-mono text-[0.48rem] text-muted-foreground tracking-wider">{formatDate(c.created_at)}</span>
                      <span className="font-mono text-[0.45rem] tracking-[0.1em] bg-secondary text-secondary-foreground px-2 py-0.5 uppercase">
                        {getProjectName(c.project_id)}
                      </span>
                    </div>
                    <p className="font-sans text-sm text-muted-foreground leading-relaxed">{c.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Submit form / CTA */}
        <div className="mt-8 text-center">
          {!user ? (
            <Link
              to="/access"
              className="font-mono text-[0.55rem] tracking-[0.12em] text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2 uppercase"
            >
              <LogIn className="w-3.5 h-3.5" /> Login para contribuir
            </Link>
          ) : showForm ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="border border-border bg-background p-6 text-left space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[0.5rem] tracking-[0.15em] text-muted-foreground uppercase block mb-1.5">
                    Seu Nome
                  </label>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    maxLength={100}
                    className="w-full bg-secondary border border-border text-foreground text-sm px-3 py-2 font-sans focus:outline-none focus:border-primary"
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <label className="font-mono text-[0.5rem] tracking-[0.15em] text-muted-foreground uppercase block mb-1.5">
                    Projeto
                  </label>
                  <select
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    className="w-full bg-secondary border border-border text-foreground text-sm px-3 py-2 font-sans focus:outline-none focus:border-primary"
                  >
                    {homeProjects.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="font-mono text-[0.5rem] tracking-[0.15em] text-muted-foreground uppercase block mb-1.5">
                  Sugestão
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  maxLength={1000}
                  rows={3}
                  className="w-full bg-secondary border border-border text-foreground text-sm px-3 py-2 font-sans focus:outline-none focus:border-primary resize-none"
                  placeholder="Descreva sua contribuição..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="font-mono text-[0.55rem] tracking-[0.12em] bg-primary text-primary-foreground px-5 py-2.5 hover:bg-primary/90 transition-colors flex items-center gap-2 uppercase disabled:opacity-50"
                >
                  <Send className="w-3 h-3" /> {submitting ? "Enviando..." : "Enviar"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="font-mono text-[0.55rem] tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors uppercase"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="font-mono text-[0.55rem] tracking-[0.12em] text-primary hover:text-primary/80 transition-colors flex items-center gap-2 mx-auto uppercase"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Enviar Contribuição
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContributionsSection;
