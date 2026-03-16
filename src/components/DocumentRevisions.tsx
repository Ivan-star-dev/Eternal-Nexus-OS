import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  History,
  Upload,
  FileText,
  Shield,
  Copyright,
  ChevronDown,
  ChevronUp,
  Eye,
  Download,
  Lock,
} from "lucide-react";

interface Revision {
  id: string;
  project_id: string;
  document_name: string;
  version_number: number;
  revision_notes: string | null;
  storage_path: string;
  file_size: number | null;
  author_name: string;
  author_institution: string | null;
  copyright_holder: string;
  copyright_year: number;
  license_type: string;
  classification: string;
  is_current: boolean;
  created_at: string;
}

const LICENSE_OPTIONS = [
  { value: "ALL_RIGHTS_RESERVED", label: "All Rights Reserved" },
  { value: "GOVERNMENT_USE_ONLY", label: "Government Use Only" },
  { value: "RESTRICTED_DISTRIBUTION", label: "Restricted Distribution" },
  { value: "NDA_REQUIRED", label: "NDA Required" },
];

const CLASSIFICATION_OPTIONS = [
  { value: "UNCLASSIFIED", label: "Unclassified" },
  { value: "CONFIDENTIAL", label: "Confidential" },
  { value: "SECRET", label: "Secret" },
  { value: "TOP_SECRET", label: "Top Secret" },
];

const DocumentRevisions = () => {
  const { user, isOwner } = useAuth();
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [projectId, setProjectId] = useState("deltaspine-nl");
  const fileRef = useRef<HTMLInputElement>(null);

  // Upload form state
  const [docName, setDocName] = useState("");
  const [revisionNotes, setRevisionNotes] = useState("");
  const [copyrightHolder, setCopyrightHolder] = useState("Ivanildo Michel Monteiro Fernandes");
  const [copyrightYear, setCopyrightYear] = useState(new Date().getFullYear());
  const [licenseType, setLicenseType] = useState("ALL_RIGHTS_RESERVED");
  const [classification, setClassification] = useState("CONFIDENTIAL");

  useEffect(() => {
    if (user && isOwner) fetchRevisions();
  }, [user, isOwner, projectId]);

  const fetchRevisions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("document_revisions")
      .select("*")
      .eq("project_id", projectId)
      .order("document_name", { ascending: true })
      .order("version_number", { ascending: false });

    if (data) setRevisions(data as unknown as Revision[]);
    if (error) console.error(error);
    setLoading(false);
  };

  const getNextVersion = (documentName: string): number => {
    const docRevisions = revisions.filter((r) => r.document_name === documentName);
    if (docRevisions.length === 0) return 1;
    return Math.max(...docRevisions.map((r) => r.version_number)) + 1;
  };

  const handleUploadRevision = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.name.endsWith(".pdf")) {
      toast({ title: "Invalid format", description: "Only PDF files are accepted.", variant: "destructive" });
      return;
    }

    const finalDocName = docName.trim() || file.name.replace(".pdf", "");
    const nextVersion = getNextVersion(finalDocName);

    setUploading(true);
    try {
      const storagePath = `${projectId}/revisions/${finalDocName}_v${nextVersion}.pdf`;

      const { error: uploadError } = await supabase.storage
        .from("whitepapers")
        .upload(storagePath, file, { upsert: true, contentType: "application/pdf" });

      if (uploadError) throw uploadError;

      // Mark previous versions as not current
      if (nextVersion > 1) {
        await supabase
          .from("document_revisions")
          .update({ is_current: false } as any)
          .eq("project_id", projectId)
          .eq("document_name", finalDocName);
      }

      // Insert new revision
      const { error: insertError } = await supabase.from("document_revisions").insert({
        project_id: projectId,
        document_name: finalDocName,
        version_number: nextVersion,
        revision_notes: revisionNotes.trim() || null,
        storage_path: storagePath,
        file_size: file.size,
        author_id: user.id,
        author_name: "Owner",
        author_institution: "Next Path Infra",
        copyright_holder: copyrightHolder,
        copyright_year: copyrightYear,
        license_type: licenseType,
        classification,
        is_current: true,
      } as any);

      if (insertError) throw insertError;

      // Log revision
      await supabase.from("edit_logs").insert({
        user_id: user.id,
        entity_type: "document_revision",
        entity_id: projectId,
        action: `revision_v${nextVersion}`,
        changes: {
          document: finalDocName,
          version: nextVersion,
          notes: revisionNotes,
          copyright: copyrightHolder,
          classification,
        },
      });

      toast({ title: "Revision uploaded", description: `${finalDocName} v${nextVersion}` });
      setDocName("");
      setRevisionNotes("");
      fetchRevisions();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDownloadRevision = async (revision: Revision) => {
    const { data, error } = await supabase.storage
      .from("whitepapers")
      .createSignedUrl(revision.storage_path, 60);
    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
    if (error) toast({ title: "Download failed", description: error.message, variant: "destructive" });
  };

  const restoreVersion = async (revision: Revision) => {
    if (!user) return;
    // Mark all versions as not current
    await supabase
      .from("document_revisions")
      .update({ is_current: false } as any)
      .eq("project_id", projectId)
      .eq("document_name", revision.document_name);

    // Mark selected as current
    await supabase
      .from("document_revisions")
      .update({ is_current: true } as any)
      .eq("id", revision.id);

    await supabase.from("edit_logs").insert({
      user_id: user.id,
      entity_type: "document_revision",
      entity_id: projectId,
      action: "restore_version",
      changes: { document: revision.document_name, restored_version: revision.version_number },
    });

    toast({ title: "Version restored", description: `${revision.document_name} v${revision.version_number} is now current` });
    fetchRevisions();
  };

  if (!user || !isOwner) return null;

  // Group revisions by document name
  const grouped = revisions.reduce<Record<string, Revision[]>>((acc, r) => {
    if (!acc[r.document_name]) acc[r.document_name] = [];
    acc[r.document_name].push(r);
    return acc;
  }, {});

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "—";
    return bytes > 1048576
      ? `${(bytes / 1048576).toFixed(1)} MB`
      : `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="space-y-6">
      {/* Upload new revision */}
      <div className="border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <History className="w-5 h-5 text-primary" />
          <h3 className="font-mono text-[0.72rem] tracking-[0.12em] text-foreground font-medium uppercase">
            NEW DOCUMENT REVISION
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-mono text-[0.55rem] tracking-[0.15em] text-muted-foreground uppercase block mb-1.5">
              DOCUMENT NAME
            </label>
            <input
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g. WhitePaper_DeltaSpine_NL"
              className="w-full bg-background border border-border px-3 py-2 font-mono text-[0.72rem] text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="font-mono text-[0.55rem] tracking-[0.15em] text-muted-foreground uppercase block mb-1.5">
              TARGET PROJECT
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 font-mono text-[0.72rem] text-foreground focus:border-primary focus:outline-none appearance-none"
            >
              <option value="deltaspine-nl">PRJ-001 · DeltaSpine NL</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="font-mono text-[0.55rem] tracking-[0.15em] text-muted-foreground uppercase block mb-1.5">
            REVISION NOTES
          </label>
          <textarea
            value={revisionNotes}
            onChange={(e) => setRevisionNotes(e.target.value)}
            placeholder="Describe changes in this version..."
            rows={2}
            className="w-full bg-background border border-border px-3 py-2 font-mono text-[0.72rem] text-foreground focus:border-primary focus:outline-none resize-none"
          />
        </div>

        {/* Copyright & Classification */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="font-mono text-[0.55rem] tracking-[0.15em] text-muted-foreground uppercase block mb-1.5">
              <Copyright className="w-3 h-3 inline mr-1" />COPYRIGHT HOLDER
            </label>
            <input
              value={copyrightHolder}
              onChange={(e) => setCopyrightHolder(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 font-mono text-[0.68rem] text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="font-mono text-[0.55rem] tracking-[0.15em] text-muted-foreground uppercase block mb-1.5">
              YEAR
            </label>
            <input
              type="number"
              value={copyrightYear}
              onChange={(e) => setCopyrightYear(parseInt(e.target.value))}
              className="w-full bg-background border border-border px-3 py-2 font-mono text-[0.68rem] text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="font-mono text-[0.55rem] tracking-[0.15em] text-muted-foreground uppercase block mb-1.5">
              <Lock className="w-3 h-3 inline mr-1" />LICENSE
            </label>
            <select
              value={licenseType}
              onChange={(e) => setLicenseType(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 font-mono text-[0.68rem] text-foreground focus:border-primary focus:outline-none appearance-none"
            >
              {LICENSE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-mono text-[0.55rem] tracking-[0.15em] text-muted-foreground uppercase block mb-1.5">
              <Shield className="w-3 h-3 inline mr-1" />CLASSIFICATION
            </label>
            <select
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 font-mono text-[0.68rem] text-foreground focus:border-primary focus:outline-none appearance-none"
            >
              {CLASSIFICATION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <label
          className={`block border border-dashed border-border hover:border-primary p-4 cursor-pointer transition-colors text-center ${
            uploading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <Upload className="w-5 h-5 text-primary mx-auto mb-1" />
          <span className="font-mono text-[0.68rem] text-muted-foreground">
            {uploading ? "UPLOADING REVISION..." : "SELECT PDF TO UPLOAD AS NEW REVISION"}
          </span>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            onChange={handleUploadRevision}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Revision History */}
      <div className="border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-mono text-[0.72rem] tracking-[0.12em] text-foreground font-medium uppercase">
            DOCUMENT REVISION HISTORY
          </h3>
          <span className="font-mono text-[0.55rem] text-muted-foreground ml-auto">
            {Object.keys(grouped).length} document{Object.keys(grouped).length !== 1 ? "s" : ""} · {revisions.length} revision{revisions.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <span className="font-mono text-sm text-muted-foreground">LOADING REVISIONS...</span>
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border">
            <History className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="font-mono text-sm text-muted-foreground">No document revisions yet</p>
            <p className="font-mono text-[0.6rem] text-muted-foreground/60 mt-1">Upload your first revision above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(grouped).map(([docName, docRevisions]) => {
              const currentVersion = docRevisions.find((r) => r.is_current) || docRevisions[0];
              const isExpanded = expandedDoc === docName;

              return (
                <div key={docName} className="border border-border">
                  {/* Document header */}
                  <button
                    onClick={() => setExpandedDoc(isExpanded ? null : docName)}
                    className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                      <div>
                        <span className="font-mono text-[0.72rem] text-foreground block font-medium">
                          {docName}
                        </span>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="font-mono text-[0.55rem] text-primary">
                            CURRENT: v{currentVersion.version_number}
                          </span>
                          <span className="font-mono text-[0.55rem] text-muted-foreground">
                            {docRevisions.length} version{docRevisions.length !== 1 ? "s" : ""}
                          </span>
                          <span
                            className={`font-mono text-[0.5rem] tracking-[0.12em] px-1.5 py-0.5 border ${
                              currentVersion.classification === "CONFIDENTIAL"
                                ? "border-destructive/40 text-destructive bg-destructive/5"
                                : currentVersion.classification === "SECRET"
                                ? "border-primary/40 text-primary bg-primary/5"
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            {currentVersion.classification}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>

                  {/* Expanded version list */}
                  {isExpanded && (
                    <div className="border-t border-border">
                      {/* Copyright banner */}
                      <div className="px-4 py-2.5 bg-primary/5 border-b border-border flex items-center gap-2">
                        <Copyright className="w-3.5 h-3.5 text-primary" />
                        <span className="font-mono text-[0.58rem] text-foreground">
                          © {currentVersion.copyright_year} {currentVersion.copyright_holder}
                        </span>
                        <span className="font-mono text-[0.5rem] text-muted-foreground ml-2">
                          {LICENSE_OPTIONS.find((l) => l.value === currentVersion.license_type)?.label}
                        </span>
                      </div>

                      {/* Version rows */}
                      {docRevisions.map((rev) => (
                        <div
                          key={rev.id}
                          className={`flex items-center gap-4 px-4 py-3 border-b border-border/50 last:border-b-0 ${
                            rev.is_current ? "bg-accent/5" : "hover:bg-primary/3"
                          }`}
                        >
                          <div className="flex-shrink-0 w-12 text-center">
                            <span
                              className={`font-mono text-[0.68rem] font-medium ${
                                rev.is_current ? "text-primary" : "text-muted-foreground"
                              }`}
                            >
                              v{rev.version_number}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {rev.is_current && (
                                <span className="font-mono text-[0.5rem] tracking-[0.12em] text-accent-foreground bg-accent/20 px-1.5 py-0.5 border border-accent/30">
                                  CURRENT
                                </span>
                              )}
                              <span className="font-mono text-[0.6rem] text-muted-foreground">
                                {rev.author_name}
                                {rev.author_institution && ` · ${rev.author_institution}`}
                              </span>
                            </div>
                            {rev.revision_notes && (
                              <p className="font-sans text-[0.72rem] text-foreground/80 mt-1 leading-relaxed">
                                {rev.revision_notes}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-1">
                              <span className="font-mono text-[0.5rem] text-muted-foreground">
                                {formatDate(rev.created_at)}
                              </span>
                              <span className="font-mono text-[0.5rem] text-muted-foreground">
                                {formatSize(rev.file_size)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleDownloadRevision(rev)}
                              className="p-1.5 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors"
                              title="Download"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            {!rev.is_current && (
                              <button
                                onClick={() => restoreVersion(rev)}
                                className="p-1.5 border border-border hover:border-accent text-muted-foreground hover:text-accent-foreground transition-colors"
                                title="Restore as current version"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Copyright protection notice */}
      <div className="border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-mono text-[0.62rem] tracking-[0.1em] text-primary font-medium mb-1">
              INTELLECTUAL PROPERTY PROTECTION
            </h4>
            <p className="font-mono text-[0.55rem] text-muted-foreground leading-relaxed">
              All documents are protected under international copyright law and the Berne Convention.
              Every revision is tracked with full attribution (author, institution, timestamp).
              Downloads are logged and access is restricted to verified government officials.
              Unauthorized distribution constitutes a breach of the Non-Disclosure Agreement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentRevisions;
