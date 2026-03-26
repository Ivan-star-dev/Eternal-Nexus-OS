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
    document.title = "Owner Dashboard — Sovereign Cockpit · Eternal Nexus OS";
  }, []);

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

  if (loading) return <Layout><div className="min-h-screen flex items-center justify-center"><span className="font-mono text-[0.6rem] tracking-[0.2em] text-paper-dim uppercase">Loading…</span></div></Layout>;
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
      <div className="flex min-h-[calc(100vh-56px)] bg-[#04040e]">
        {/* Sidebar */}
        <aside className="w-64 bg-[#08081a] border-r border-white/[0.06] flex-shrink-0 hidden md:block">
          <div className="p-5 border-b border-white/[0.06]">
            <span className="font-mono text-[0.48rem] tracking-[0.28em] uppercase" style={{ color: "rgba(200,164,78,0.5)" }}>Owner Workspace</span>
            <div className="mt-1" style={{ height: "0.5px", background: "rgba(200,164,78,0.15)", width: "40px" }} />
          </div>
          <div className="p-5 border-b border-white/[0.06]">
            <div className="font-mono text-[0.6rem] text-paper-dim leading-relaxed">
              Ivanildo Michel<br />
              <span className="text-white/30">Monteiro Fernandes</span>
            </div>
            <div className="mt-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[0.45rem] tracking-[0.15em] uppercase px-2 py-0.5">
                Owner Active
              </span>
            </div>
          </div>
          <nav className="py-3">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 px-5 py-3 font-mono text-[0.55rem] tracking-[0.1em] uppercase transition-all border-l-2 ${
                  activeTab === item.key
                    ? "border-gold/60 text-gold bg-gold/[0.04]"
                    : "border-transparent text-paper-dim hover:text-paper/80 hover:bg-white/[0.02]"
                }`}
              >
                <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                {item.label}
                {item.count !== undefined && item.count > 0 && (
                  <span className="ml-auto font-mono text-[0.45rem] tracking-[0.1em] px-1.5 py-0.5 bg-gold/10 text-gold border border-gold/20 rounded-sm">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#08081a] border-t border-white/[0.06] overflow-x-auto flex">
          {navItems.slice(0, 5).map((item) => (
            <button key={item.key} onClick={() => setActiveTab(item.key)}
              className={`flex-1 py-3 px-2 flex flex-col items-center gap-1 font-mono text-[0.48rem] tracking-[0.12em] uppercase ${
                activeTab === item.key ? "text-gold" : "text-paper-dim"
              }`}>
              <item.icon className="w-3.5 h-3.5" />
              {item.label.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[calc(100vh-56px)]">
          {/* Overview */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-6">
                <p className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase mb-1">
                  Restricted — Owner Access Only
                </p>
                <h1 className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-paper/70 border-b border-white/[0.06] pb-3 mb-4">
                  Owner Dashboard · All Actions Logged
                </h1>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04] border border-white/[0.06] mb-8">
                {[
                  { val: pendingBids, label: "Pending Bids" },
                  { val: downloads.length, label: "Total Downloads" },
                  { val: notes.length, label: "Gov Notes" },
                  { val: pendingNotifs, label: "Notifications" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#08081a] p-5">
                    <div className="font-mono text-2xl text-paper/90 mb-1">{s.val}</div>
                    <div className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent bids */}
              <p className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-paper/70 border-b border-white/[0.06] pb-3 mb-4">
                Recent Bids
              </p>
              {bids.slice(0, 3).map((bid) => (
                <div key={bid.id} className="border-b border-white/[0.04] py-3 font-mono">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[0.6rem] text-paper-dim">{bid.subject}</span>
                    <span className={`font-mono text-[0.45rem] tracking-[0.15em] px-2 py-0.5 border uppercase ${
                      bid.status === "pending"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "border-white/[0.12] text-paper-dim"
                    }`}>
                      {bid.status}
                    </span>
                  </div>
                  <span className="font-mono text-[0.6rem] text-paper-dim">{bid.institution} · {bid.country} · {formatDate(bid.created_at)}</span>
                </div>
              ))}
              {bids.length === 0 && <p className="font-mono text-[0.6rem] text-paper-dim">No bids yet.</p>}
            </motion.div>
          )}

          {/* Bids */}
          {activeTab === "bids" && (
            <div>
              <p className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase mb-1">Bids & Inquiries</p>
              <p className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-paper/70 border-b border-white/[0.06] pb-3 mb-6">
                Government submissions and expressions of interest
              </p>
              <div className="space-y-px">
                {bids.length === 0 ? (
                  <div className="border border-white/[0.06] p-10 text-center">
                    <Briefcase className="w-6 h-6 text-white/20 mx-auto mb-3" />
                    <p className="font-mono text-[0.6rem] text-paper-dim">No bids or inquiries yet</p>
                  </div>
                ) : bids.map((bid) => (
                  <motion.div key={bid.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-white/[0.06] bg-[#08081a] p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-[0.45rem] tracking-[0.15em] px-2 py-0.5 border uppercase ${
                          bid.status === "pending"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : bid.status === "reviewed"
                            ? "border-white/[0.12] text-paper-dim"
                            : "border-white/[0.06] text-white/30"
                        }`}>{bid.status}</span>
                        <span className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase">
                          {bid.bid_type.replace(/_/g, " ")}
                        </span>
                      </div>
                      <span className="font-mono text-[0.6rem] text-paper-dim">{formatDate(bid.created_at)}</span>
                    </div>
                    <p className="font-mono text-[0.6rem] text-paper-dim mb-1">{bid.subject}</p>
                    <p className="font-mono text-[0.6rem] text-paper-dim border-b border-white/[0.04] pb-3 mb-3">{bid.message}</p>
                    <div className="flex items-center gap-4 font-mono text-[0.6rem] text-paper-dim">
                      <span><Users className="w-3 h-3 inline mr-1 opacity-40" />{bid.contact_name}</span>
                      <span>{bid.institution}</span>
                      <span>{bid.country}</span>
                    </div>
                    {bid.status === "pending" && (
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => updateBidStatus(bid.id, "reviewed")} className="border border-white/[0.12] text-paper-dim font-mono text-[0.55rem] tracking-[0.1em] uppercase px-4 py-2 hover:border-gold/40 hover:text-gold transition-all duration-200">
                          Mark Reviewed
                        </button>
                        <button onClick={() => updateBidStatus(bid.id, "responded")} className="border border-white/[0.12] text-paper-dim font-mono text-[0.55rem] tracking-[0.1em] uppercase px-4 py-2 hover:border-gold/40 hover:text-gold transition-all duration-200">
                          Mark Responded
                        </button>
                        <button onClick={() => updateBidStatus(bid.id, "declined")} className="border border-rose-500/40 text-rose-400 font-mono text-[0.55rem] tracking-[0.1em] uppercase px-4 py-2 hover:border-rose-500/60 transition-all duration-200">
                          Decline
                        </button>
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
              <p className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase mb-1">Download Logs</p>
              <p className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-paper/70 border-b border-white/[0.06] pb-3 mb-6">
                Tracked document downloads by governments
              </p>
              <div className="border border-white/[0.06] overflow-hidden">
                <div className="grid grid-cols-5 gap-0 bg-[#08081a] border-b border-white/[0.06] p-3 font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase">
                  <span>Document</span><span>Project</span><span>Institution</span><span>Country</span><span>Date</span>
                </div>
                {downloads.map((dl) => (
                  <div key={dl.id} className="grid grid-cols-5 gap-0 p-3 border-b border-white/[0.04] font-mono text-[0.6rem] text-paper-dim hover:bg-white/[0.02] transition-colors">
                    <span className="truncate">{dl.document_name}</span>
                    <span>{dl.project_id}</span>
                    <span>{dl.institution}</span>
                    <span>{dl.country}</span>
                    <span>{formatDate(dl.downloaded_at)}</span>
                  </div>
                ))}
                {downloads.length === 0 && <div className="p-8 text-center font-mono text-[0.6rem] text-paper-dim">No downloads recorded</div>}
              </div>
            </div>
          )}

          {/* Edit Logs */}
          {activeTab === "logs" && (
            <div>
              <p className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase mb-1">Edit History</p>
              <p className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-paper/70 border-b border-white/[0.06] pb-3 mb-6">
                Complete audit trail of all changes
              </p>
              <div className="space-y-px">
                {editLogs.map((log) => (
                  <div key={log.id} className="border border-white/[0.06] bg-[#08081a] p-4 flex items-start gap-4">
                    <Clock className="w-3.5 h-3.5 text-white/20 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1 border-b border-white/[0.04] pb-2">
                        <span className="font-mono text-[0.6rem] text-paper-dim">{log.action}</span>
                        <span className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase">{log.entity_type}</span>
                        <span className="font-mono text-[0.6rem] text-paper-dim">{log.institution}</span>
                      </div>
                      <span className="font-mono text-[0.6rem] text-paper-dim">{formatDate(log.created_at)}</span>
                      {log.changes && (
                        <pre className="mt-2 font-mono text-[0.55rem] text-paper-dim bg-black/30 border border-white/[0.04] p-2 overflow-x-auto">
                          {JSON.stringify(log.changes, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
                {editLogs.length === 0 && <div className="border border-white/[0.06] p-8 text-center font-mono text-[0.6rem] text-paper-dim">No edit logs recorded</div>}
              </div>
            </div>
          )}

          {/* Notes */}
          {activeTab === "notes" && (
            <div>
              <p className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase mb-1">Government Notes</p>
              <p className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-paper/70 border-b border-white/[0.06] pb-3 mb-6">
                Notes submitted by government entities
              </p>
              <div className="space-y-px">
                {notes.map((note) => (
                  <div key={note.id} className="border border-white/[0.06] bg-[#08081a] p-5">
                    <div className="flex items-center justify-between mb-3 border-b border-white/[0.04] pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase border border-gold/20 px-2 py-0.5">{note.note_type}</span>
                        <span className="font-mono text-[0.6rem] text-paper-dim">{note.institution} · {note.country}</span>
                      </div>
                      <span className="font-mono text-[0.6rem] text-paper-dim">{formatDate(note.created_at)}</span>
                    </div>
                    <p className="font-mono text-[0.6rem] text-paper-dim leading-relaxed">{note.content}</p>
                  </div>
                ))}
                {notes.length === 0 && <div className="border border-white/[0.06] p-8 text-center font-mono text-[0.6rem] text-paper-dim">No government notes submitted</div>}
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
              <p className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase mb-1">Live Chat</p>
              <p className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-paper/70 border-b border-white/[0.06] pb-3 mb-6">
                Real-time communication with government entities
              </p>
              <ProjectChat projectId="deltaspine-nl" isOwnerView />
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div>
              <p className="font-mono text-[0.48rem] tracking-[0.28em] text-gold/60 uppercase mb-1">Notifications</p>
              <p className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-paper/70 border-b border-white/[0.06] pb-3 mb-6">
                Automated alerts for bids and downloads
              </p>
              <div className="space-y-px">
                {notifications.length === 0 ? (
                  <div className="border border-white/[0.06] p-10 text-center">
                    <Bell className="w-6 h-6 text-white/20 mx-auto mb-3" />
                    <p className="font-mono text-[0.6rem] text-paper-dim">No notifications yet</p>
                  </div>
                ) : notifications.map((notif) => (
                  <motion.div key={notif.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-white/[0.06] bg-[#08081a] p-5">
                    <div className="flex items-start justify-between gap-4 mb-3 border-b border-white/[0.04] pb-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[0.45rem] tracking-[0.15em] px-2 py-0.5 border uppercase ${
                          notif.notification_type === "new_bid"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : "border-white/[0.12] text-paper-dim"
                        }`}>{notif.notification_type === "new_bid" ? "New Bid" : "Download"}</span>
                        <span className={`font-mono text-[0.45rem] tracking-[0.15em] px-2 py-0.5 border uppercase ${
                          notif.status === "pending"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : "border-white/[0.06] text-white/30"
                        }`}>{notif.status}</span>
                      </div>
                      <span className="font-mono text-[0.6rem] text-paper-dim">{formatDate(notif.created_at)}</span>
                    </div>
                    <p className="font-mono text-[0.6rem] text-paper-dim mb-1">{notif.subject}</p>
                    <p className="font-mono text-[0.6rem] text-paper-dim whitespace-pre-line">{notif.body}</p>
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
