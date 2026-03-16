import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare, Bot, User, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// ═══════════════════════════════════════════════════════════════
// ProjectChat: Real-time chat + AI Assistant with streaming
// ═══════════════════════════════════════════════════════════════

interface ChatMessage {
  id: string;
  project_id: string;
  sender_id: string;
  sender_name: string;
  sender_institution: string | null;
  sender_country: string | null;
  message: string;
  is_owner_reply: boolean;
  created_at: string;
}

interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ProjectChatProps {
  projectId: string;
  projectContext?: string;
  isOwnerView?: boolean;
}

type ChatMode = "chat" | "ai";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/project-ai-chat`;

const ProjectChat = ({ projectId, projectContext, isOwnerView = false }: ProjectChatProps) => {
  const { user, isOwner, profile } = useAuth();
  const [mode, setMode] = useState<ChatMode>("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [aiStreaming, setAiStreaming] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ── Chat messages (realtime) ──
  useEffect(() => {
    if (!user) return;
    fetchMessages();

    const channel = supabase
      .channel(`chat-${projectId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `project_id=eq.${projectId}` },
        (payload) => setMessages((prev) => [...prev, payload.new as ChatMessage])
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, projectId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, aiMessages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true })
      .limit(200);
    if (data) setMessages(data as ChatMessage[]);
  };

  // ── Send chat message ──
  const sendChatMessage = async () => {
    if (!newMessage.trim() || !user) return;
    setSending(true);

    const senderName = isOwner ? "NPI Owner" : profile?.full_name || user.email || "User";
    const senderInstitution = isOwner ? "Next Path Infra" : profile?.institution || null;
    const senderCountry = isOwner ? null : profile?.country || null;

    await supabase.from("chat_messages").insert({
      project_id: projectId,
      sender_id: user.id,
      sender_name: senderName,
      sender_institution: senderInstitution,
      sender_country: senderCountry,
      message: newMessage.trim(),
      is_owner_reply: isOwner || false,
    });

    setNewMessage("");
    setSending(false);
  };

  // ── Send AI message with streaming ──
  const sendAiMessage = useCallback(async () => {
    if (!newMessage.trim() || aiStreaming) return;
    setAiError(null);

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setNewMessage("");
    setAiStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    let assistantContent = "";

    try {
      const allMessages = [
        ...aiMessages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: userMsg.content },
      ];

      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          messages: allMessages,
          projectId,
          projectContext,
        }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Create assistant message placeholder
      const assistantId = `ai-${Date.now()}`;
      setAiMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", timestamp: new Date().toISOString() },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setAiMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assistantContent } : m
                )
              );
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Final flush
      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setAiMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assistantContent } : m
                )
              );
            }
          } catch { /* ignore partial */ }
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      const errorMsg = err.message || "AI connection failed";
      setAiError(errorMsg);
    } finally {
      setAiStreaming(false);
      abortRef.current = null;
    }
  }, [newMessage, aiMessages, aiStreaming, projectId, projectContext]);

  const handleSend = () => {
    if (mode === "chat") sendChatMessage();
    else sendAiMessage();
  };

  const formatTime = (d: string) =>
    new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  if (!user) {
    return (
      <div className="border border-border p-8 text-center">
        <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="font-mono text-sm text-muted-foreground">Sign in to access project chat</p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-card flex flex-col" style={{ height: isOwnerView ? "600px" : "500px" }}>
      {/* Header with mode toggle */}
      <div className="border-b border-border p-3 flex items-center gap-2">
        <div className="flex gap-1 bg-muted/30 p-0.5 rounded-sm">
          <button
            onClick={() => setMode("chat")}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.1em] uppercase transition-all ${
              mode === "chat"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            Chat
          </button>
          <button
            onClick={() => setMode("ai")}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.1em] uppercase transition-all ${
              mode === "ai"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            AI Analyst
          </button>
        </div>
        <span className="font-mono text-[0.5rem] text-muted-foreground ml-auto">
          {mode === "chat" ? `${messages.length} messages` : `${aiMessages.length} exchanges`}
        </span>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {mode === "chat" ? (
          <>
            {messages.length === 0 && (
              <EmptyState text="No messages yet — start the conversation" />
            )}
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                isOwn={msg.sender_id === user.id}
                senderName={msg.sender_name}
                institution={msg.sender_institution}
                isOwnerReply={msg.is_owner_reply}
                message={msg.message}
                time={formatTime(msg.created_at)}
              />
            ))}
          </>
        ) : (
          <>
            {aiMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <Bot className="w-10 h-10 text-accent/40" />
                <p className="font-mono text-[0.65rem] text-muted-foreground/60 text-center max-w-[280px]">
                  AI Analyst ready — ask about project metrics, risks, timeline, or technical details
                </p>
              </div>
            )}
            <AnimatePresence mode="popLayout">
              {aiMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-accent" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-2.5 ${
                      msg.role === "user"
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-muted/50 border border-border"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="font-sans text-sm text-foreground leading-relaxed prose prose-sm prose-invert max-w-none">
                        <AIMarkdown content={msg.content} />
                      </div>
                    ) : (
                      <p className="font-sans text-sm text-foreground leading-relaxed">{msg.content}</p>
                    )}
                    {msg.role === "assistant" && !msg.content && aiStreaming && (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin text-accent" />
                        <span className="font-mono text-[0.5rem] text-accent/60">Analyzing…</span>
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-6 h-6 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Error banner */}
      {aiError && mode === "ai" && (
        <div className="border-t border-destructive/30 bg-destructive/5 px-4 py-2 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
          <span className="font-mono text-[0.55rem] text-destructive">{aiError}</span>
          <button
            onClick={() => setAiError(null)}
            className="font-mono text-[0.5rem] text-destructive/60 hover:text-destructive ml-auto"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-3 flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder={
            mode === "ai"
              ? "Ask about metrics, risks, timeline..."
              : isOwner
              ? "Reply as owner..."
              : "Type your message..."
          }
          className="flex-1 bg-background border border-border px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
          disabled={aiStreaming}
        />
        <button
          onClick={handleSend}
          disabled={sending || aiStreaming || !newMessage.trim()}
          className={`px-4 py-2 font-mono text-[0.62rem] tracking-[0.1em] transition-colors disabled:opacity-50 flex items-center gap-2 ${
            mode === "ai"
              ? "bg-accent text-accent-foreground hover:bg-accent/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {aiStreaming ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : mode === "ai" ? (
            <Sparkles className="w-3.5 h-3.5" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          {aiStreaming ? "ANALYZING" : mode === "ai" ? "ASK AI" : "SEND"}
        </button>
      </div>
    </div>
  );
};

// ── Sub-components ──

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="font-mono text-[0.68rem] text-muted-foreground/50">{text}</p>
    </div>
  );
}

function ChatBubble({
  isOwn,
  senderName,
  institution,
  isOwnerReply,
  message,
  time,
}: {
  isOwn: boolean;
  senderName: string;
  institution: string | null;
  isOwnerReply: boolean;
  message: string;
  time: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="font-mono text-[0.55rem] tracking-[0.1em] text-muted-foreground">
          {senderName}
        </span>
        {institution && (
          <span className="font-mono text-[0.5rem] text-primary/60">{institution}</span>
        )}
        {isOwnerReply && (
          <span className="font-mono text-[0.5rem] tracking-[0.1em] px-1.5 py-0.5 border border-primary/30 text-primary bg-primary/5">
            OWNER
          </span>
        )}
      </div>
      <div
        className={`max-w-[80%] px-4 py-2.5 ${
          isOwnerReply
            ? "bg-primary/10 border border-primary/20"
            : isOwn
            ? "bg-accent/10 border border-accent/20"
            : "bg-muted border border-border"
        }`}
      >
        <p className="font-sans text-sm text-foreground leading-relaxed">{message}</p>
      </div>
      <span className="font-mono text-[0.5rem] text-muted-foreground/50 mt-1">{time}</span>
    </motion.div>
  );
}

/** Simple markdown-like renderer (no extra dependency) */
function AIMarkdown({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: JSX.Element[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("### ")) {
      elements.push(
        <h4 key={i} className="font-mono text-[0.65rem] tracking-[0.1em] text-primary uppercase mt-3 mb-1">
          {line.slice(4)}
        </h4>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h3 key={i} className="font-mono text-[0.7rem] tracking-[0.1em] text-primary uppercase mt-3 mb-1">
          {line.slice(3)}
        </h3>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h2 key={i} className="font-mono text-[0.75rem] tracking-[0.1em] text-primary uppercase mt-3 mb-1">
          {line.slice(2)}
        </h2>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <div key={i} className="flex gap-2 ml-2">
          <span className="text-accent text-xs">▸</span>
          <span className="text-sm">{formatInlineMarkdown(line.slice(2))}</span>
        </div>
      );
    } else if (line.startsWith("```")) {
      // Collect code block
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="bg-background/80 border border-border p-2 my-2 overflow-x-auto">
          <code className="font-mono text-[0.6rem] text-foreground/80">{codeLines.join("\n")}</code>
        </pre>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-1.5" />);
    } else {
      elements.push(
        <p key={i} className="text-sm leading-relaxed">{formatInlineMarkdown(line)}</p>
      );
    }
  }

  return <>{elements}</>;
}

function formatInlineMarkdown(text: string): string | JSX.Element[] {
  // Bold + code inline (simplified)
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  if (parts.length <= 1) return text;

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="bg-muted px-1 py-0.5 font-mono text-[0.65rem] text-accent">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  }) as unknown as JSX.Element[];
}

export default ProjectChat;
