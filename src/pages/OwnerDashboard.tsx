import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Navigate } from "react-router-dom";
import { Shield, Users, Clock, Download, Briefcase, Upload, History, Bell, MessagesSquare, MessageSquare, BarChart3 } from "lucide-react";
import WhitepaperUpload from "@/components/WhitepaperUpload";
import DocumentRevisions from "@/components/DocumentRevisions";
import ProjectChat from "@/components/ProjectChat";

interface BidRow {
  id: string; project_id: string; bid_type: string; subject: string; message: string;
  institution: string | null; country: string | null; contact_name: string | null;
  contact_email: string | null; status: string; created_at: string;
}
interface DownloadRow {
  id: string; project_id: string; document_name: string;
  institution: string | null; country: string | null; downloaded_at: string;
}
interface EditLogRow {
  id: string; entity_type: string; entity_id: string; action: string;
  changes: any; institution: string | null; created_at: string;
}
interface NoteRow {
  id: string; project_id: string; note_type: string; content: string;
  institution: string | null; country: string | null; created_at: string;
}

type TabKey = "overview" | "bids" | "downloads" | "logs" | "notes" | "files" | "revisions" | "notifications" | "chat";

const OwnerDashboard = () => {
  const { user, isOwner, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [bids, setBids] = useState<BidRow[]>([]);
  const [downloads, setDownloads] = useState<DownloadRow[]>([]);
  const [editLogs, setEditLogs] = useState<EditLogRow[]>([]);
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user || !isOwner) return;
    fetchData();
    const channel = supabase
      .channel("owner-bids")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "government_bids" }, (payload) => {
        setBids((prev) => [payload.new as BidRow, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, isOwner]);

  const fetchData = async () => {
    const [bidsRes, downloadsRes, logsRes, notesRes, notifRes] = await Promise.all([
      supabase.from("government_bids").select("*").order("created_at", { ascending: false }),
      supabase.from("download_logs").select("*").order("downloaded_at", { ascending: false }),
      supabase.from("edit_logs").select("*").order("created_at", { ascending: false }),
      supabase.from("project_notes").select("*").order("created_at", { ascending: false }),
      supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(50),
    ]);
    if (bidsRes.data) setBids(bidsRes.data as BidRow[]);
    if (downloadsRes.data) setDownloads(downloadsRes.data as DownloadRow[]);
    if (logsRes.data) setEditLogs(logsRes.data as EditLogRow[]);
    if (notesRes.data) setNotes(notesRes.data as NoteRow[]);
    if (notifRes.data) setNotifications(notifRes.data);
  };

  const updateBidStatus = async (bidId: string, status: string) => {
    await supabase.from("government_bids").update({ status }).eq("id", bidId);
    setBids((prev) => prev.map((b) => (b.id === bidId ? { ...b, status } : b)));
  };

  if (loading) return <Layout><div className="min-h-screen flex items-center justify-center"><span className="font-mono text-sm text-muted-foreground">LOADING...</span></div></Layout>;
  if (!user || !isOwner) return <Navigate to="/" replace />;

  const formatDate = (d: string) => new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const navItems: { key: TabKey; label: string; icon: typeof Shield; count?: number }[] = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "bids", label: "Bids & Inquiries", icon: Briefcase, count: bids.filter((b) => b.status === "pending").length },
    { key: "downloads", label: "Download Logs", icon: Download, count: downloads.length },
    { key: "logs", label: "Edit History", icon: Clock, count: editLogs.length },
    { key: "notes", label: "Gov Notes", icon: MessageSquare, count: notes.length },
    { key: "chat", label: "Live Chat", icon: MessagesSquare },
    { key: "files", label: "Whitepapers", icon: Upload },
    { key: "revisions", label: "Revisions", icon: History },
    { key: "notifications", label: "Notifications", icon: Bell, count: notifications.filter((n) => n.status === "pending").length },
  ];

  const pendingBids = bids.filter((b) => b.status === "pending").length;
  const pendingNotifs = notifications.filter((n) => n.status === "pending").length;

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border flex-shrink-0 hidden md:block">
          <div className="p-5 border-b border-border">
            <span className="font-mono text-[0.55rem] tracking-[0.2em] text-primary uppercase">OWNER WORKSPACE</span>
          </div>
          <div className="p-5 border-b border-border">
            <div className="font-mono text-[0.64rem] text-accent-foreground leading-relaxed">
              Ivanildo Michel<br />
              <span className="text-muted-foreground">Monteiro Fernandes</span>
            </div>
          </div>
          <nav className="py-3">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 px-5 py-3 font-mono text-[0.64rem] tracking-[0.08em] transition-all border-l-2 ${
                  activeTab === item.key
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-primary/[0.02]"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.count !== undefined && item.count > 0 && (
                  <span className="ml-auto font-mono text-[0.5rem] px-1.5 py-0.5 bg-primary/10 text-primary rounded-sm">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border overflow-x-auto flex">
          {navItems.slice(0, 5).map((item) => (
            <button key={item.key} onClick={() => setActiveTab(item.key)}
              className={`flex-1 py-3 px-2 flex flex-col items-center gap-1 font-mono text-[0.5rem] ${
                activeTab === item.key ? "text-primary" : "text-muted-foreground"
              }`}>
              <item.icon className="w-4 h-4" />
              {item.label.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[calc(100vh-56px)]">
          {/* Overview */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-1">
                Owner <span className="text-primary">Dashboard</span>
              </h1>
              <p className="font-mono text-[0.62rem] tracking-[0.1em] text-muted-foreground mb-8">
                RESTRICTED — OWNER ACCESS ONLY · ALL ACTIONS LOGGED
              </p>
              <div className="gold-rule mb-8" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border mb-8">
                {[
                  { val: pendingBids, label: "PENDING BIDS" },
                  { val: downloads.length, label: "TOTAL DOWNLOADS" },
                  { val: notes.length, label: "GOV NOTES" },
                  { val: pendingNotifs, label: "NOTIFICATIONS" },
                ].map((s) => (
                  <div key={s.label} className="bg-card p-5">
                    <div className="metric-value text-2xl">{s.val}</div>
                    <div className="metric-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent bids */}
              <h2 className="font-serif text-xl font-bold text-foreground mb-4">Recent Bids</h2>
              {bids.slice(0, 3).map((bid) => (
                <div key={bid.id} className="border border-border bg-card p-4 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-foreground">{bid.subject}</span>
                    <span className={`font-mono text-[0.52rem] px-2 py-0.5 border ${bid.status === "pending" ? "border-primary/40 text-primary" : "border-border text-muted-foreground"}`}>
                      {bid.status.toUpperCase()}
                    </span>
                  </div>
                  <span className="font-mono text-[0.58rem] text-muted-foreground">{bid.institution} · {bid.country} · {formatDate(bid.created_at)}</span>
                </div>
              ))}
              {bids.length === 0 && <p className="font-mono text-sm text-muted-foreground">No bids yet.</p>}
            </motion.div>
          )}

          {/* Bids */}
          {activeTab === "bids" && (
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Bids & Inquiries</h1>
              <p className="font-mono text-[0.6rem] text-muted-foreground mb-6">Government submissions and expressions of interest</p>
              <div className="gold-rule mb-8" />
              <div className="space-y-3">
                {bids.length === 0 ? (
                  <div className="border border-border p-10 text-center">
                    <Briefcase className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="font-mono text-sm text-muted-foreground">No bids or inquiries yet</p>
                  </div>
                ) : bids.map((bid) => (
                  <motion.div key={bid.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-border bg-card p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <span className={`font-mono text-[0.55rem] tracking-[0.15em] px-2 py-0.5 border ${
                          bid.status === "pending" ? "border-primary/40 text-primary bg-primary/5" :
                          bid.status === "reviewed" ? "border-accent/40 text-accent-foreground bg-accent/10" :
                          "border-border text-muted-foreground"
                        }`}>{bid.status.toUpperCase()}</span>
                        <span className="font-mono text-[0.55rem] tracking-[0.1em] text-muted-foreground ml-3">
                          {bid.bid_type.replace(/_/g, " ").toUpperCase()}
                        </span>
                      </div>
                      <span className="font-mono text-[0.55rem] text-muted-foreground">{formatDate(bid.created_at)}</span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-foreground mb-1">{bid.subject}</h3>
                    <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-3">{bid.message}</p>
                    <div className="flex items-center gap-4 text-[0.6rem] font-mono text-muted-foreground">
                      <span><Users className="w-3 h-3 inline mr-1" />{bid.contact_name}</span>
                      <span>{bid.institution}</span>
                      <span>{bid.country}</span>
                    </div>
                    {bid.status === "pending" && (
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => updateBidStatus(bid.id, "reviewed")} className="py-1.5 px-4 border border-accent text-accent-foreground font-mono text-[0.6rem] tracking-[0.1em] hover:bg-accent/10 transition-colors">MARK REVIEWED</button>
                        <button onClick={() => updateBidStatus(bid.id, "responded")} className="py-1.5 px-4 border border-primary text-primary font-mono text-[0.6rem] tracking-[0.1em] hover:bg-primary/10 transition-colors">MARK RESPONDED</button>
                        <button onClick={() => updateBidStatus(bid.id, "declined")} className="py-1.5 px-4 border border-destructive text-destructive-foreground font-mono text-[0.6rem] tracking-[0.1em] hover:bg-destructive/10 transition-colors">DECLINE</button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Downloads */}
          {activeTab === "downloads" && (
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Download Logs</h1>
              <p className="font-mono text-[0.6rem] text-muted-foreground mb-6">Tracked document downloads by governments</p>
              <div className="gold-rule mb-8" />
              <div className="border border-border overflow-hidden">
                <div className="grid grid-cols-5 gap-0 bg-card border-b border-border p-3 font-mono text-[0.55rem] tracking-[0.15em] text-primary uppercase">
                  <span>Document</span><span>Project</span><span>Institution</span><span>Country</span><span>Date</span>
                </div>
                {downloads.map((dl) => (
                  <div key={dl.id} className="grid grid-cols-5 gap-0 p-3 border-b border-border/50 font-mono text-[0.72rem] text-foreground hover:bg-primary/5 transition-colors">
                    <span className="truncate">{dl.document_name}</span>
                    <span className="text-muted-foreground">{dl.project_id}</span>
                    <span className="text-muted-foreground">{dl.institution}</span>
                    <span className="text-muted-foreground">{dl.country}</span>
                    <span className="text-muted-foreground">{formatDate(dl.downloaded_at)}</span>
                  </div>
                ))}
                {downloads.length === 0 && <div className="p-8 text-center font-mono text-sm text-muted-foreground">No downloads recorded</div>}
              </div>
            </div>
          )}

          {/* Edit Logs */}
          {activeTab === "logs" && (
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Edit History</h1>
              <p className="font-mono text-[0.6rem] text-muted-foreground mb-6">Complete audit trail of all changes</p>
              <div className="gold-rule mb-8" />
              <div className="space-y-2">
                {editLogs.map((log) => (
                  <div key={log.id} className="border border-border bg-card p-4 flex items-start gap-4">
                    <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-[0.68rem] text-foreground">{log.action}</span>
                        <span className="font-mono text-[0.55rem] text-primary">{log.entity_type}</span>
                        <span className="font-mono text-[0.55rem] text-muted-foreground">{log.institution}</span>
                      </div>
                      <span className="font-mono text-[0.55rem] text-muted-foreground">{formatDate(log.created_at)}</span>
                      {log.changes && (
                        <pre className="mt-2 font-mono text-[0.6rem] text-muted-foreground bg-background p-2 border border-border overflow-x-auto">
                          {JSON.stringify(log.changes, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
                {editLogs.length === 0 && <div className="border border-border p-8 text-center font-mono text-sm text-muted-foreground">No edit logs recorded</div>}
              </div>
            </div>
          )}

          {/* Notes */}
          {activeTab === "notes" && (
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Government Notes</h1>
              <p className="font-mono text-[0.6rem] text-muted-foreground mb-6">Notes submitted by government entities</p>
              <div className="gold-rule mb-8" />
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="border border-border bg-card p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[0.55rem] tracking-[0.1em] text-primary border border-primary/40 px-2 py-0.5">{note.note_type.toUpperCase()}</span>
                        <span className="font-mono text-[0.6rem] text-muted-foreground">{note.institution} · {note.country}</span>
                      </div>
                      <span className="font-mono text-[0.55rem] text-muted-foreground">{formatDate(note.created_at)}</span>
                    </div>
                    <p className="font-sans text-sm text-foreground leading-relaxed">{note.content}</p>
                  </div>
                ))}
                {notes.length === 0 && <div className="border border-border p-8 text-center font-mono text-sm text-muted-foreground">No government notes submitted</div>}
              </div>
            </div>
          )}

          {/* Files */}
          {activeTab === "files" && <WhitepaperUpload />}

          {/* Revisions */}
          {activeTab === "revisions" && <DocumentRevisions />}

          {/* Chat */}
          {activeTab === "chat" && (
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Live Chat</h1>
              <p className="font-mono text-[0.6rem] text-muted-foreground mb-6">Real-time communication with government entities</p>
              <div className="gold-rule mb-8" />
              <ProjectChat projectId="deltaspine-nl" isOwnerView />
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Notifications</h1>
              <p className="font-mono text-[0.6rem] text-muted-foreground mb-6">Automated alerts for bids and downloads</p>
              <div className="gold-rule mb-8" />
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="border border-border p-10 text-center">
                    <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="font-mono text-sm text-muted-foreground">No notifications yet</p>
                  </div>
                ) : notifications.map((notif) => (
                  <motion.div key={notif.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-border bg-card p-5">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[0.55rem] tracking-[0.12em] px-2 py-0.5 border ${
                          notif.notification_type === "new_bid" ? "border-primary/40 text-primary bg-primary/5" : "border-accent/40 text-accent-foreground bg-accent/10"
                        }`}>{notif.notification_type === "new_bid" ? "NEW BID" : "DOWNLOAD"}</span>
                        <span className={`font-mono text-[0.5rem] ${notif.status === "pending" ? "text-primary" : "text-muted-foreground"}`}>{notif.status.toUpperCase()}</span>
                      </div>
                      <span className="font-mono text-[0.55rem] text-muted-foreground">{formatDate(notif.created_at)}</span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-foreground mb-1">{notif.subject}</h3>
                    <p className="font-sans text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{notif.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default OwnerDashboard;
