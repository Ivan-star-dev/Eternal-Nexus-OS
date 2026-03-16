import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Upload, FileText, Trash2, Check } from "lucide-react";

interface WhitepaperUploadProps {
  onUploadComplete?: () => void;
}

interface UploadedFile {
  name: string;
  projectId: string;
  size: string;
  uploadedAt: string;
}

const WhitepaperUpload = ({ onUploadComplete }: WhitepaperUploadProps) => {
  const { user, isOwner } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [projectId, setProjectId] = useState("deltaspine-nl");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user || !isOwner) return null;

  const loadFiles = async () => {
    setLoadingFiles(true);
    const { data } = await supabase.storage.from("whitepapers").list(projectId, { limit: 100 });
    if (data) {
      setFiles(
        data
          .filter((f) => f.name !== ".emptyFolderPlaceholder")
          .map((f) => ({
            name: f.name,
            projectId,
            size: f.metadata?.size > 1048576 ? `${(f.metadata.size / 1048576).toFixed(1)} MB` : `${(f.metadata?.size / 1024 || 0).toFixed(0)} KB`,
            uploadedAt: f.created_at || "",
          }))
      );
    }
    setLoadingFiles(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".pdf")) {
      toast({ title: "Invalid format", description: "Only PDF files are accepted.", variant: "destructive" });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum 50 MB per file.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const storagePath = `${projectId}/${file.name}`;
      const { error } = await supabase.storage
        .from("whitepapers")
        .upload(storagePath, file, { upsert: true, contentType: "application/pdf" });

      if (error) throw error;

      // Log the upload
      await supabase.from("edit_logs").insert({
        user_id: user.id,
        entity_type: "whitepaper",
        entity_id: projectId,
        action: "upload",
        changes: { filename: file.name, size: file.size, project: projectId },
      });

      toast({ title: "Upload complete", description: `${file.name} uploaded to ${projectId}` });
      loadFiles();
      onUploadComplete?.();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (filename: string) => {
    const storagePath = `${projectId}/${filename}`;
    const { error } = await supabase.storage.from("whitepapers").remove([storagePath]);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      await supabase.from("edit_logs").insert({
        user_id: user.id,
        entity_type: "whitepaper",
        entity_id: projectId,
        action: "delete",
        changes: { filename, project: projectId },
      });
      toast({ title: "Deleted", description: filename });
      loadFiles();
    }
  };

  return (
    <div className="border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <Upload className="w-5 h-5 text-primary" />
        <h3 className="font-mono text-[0.72rem] tracking-[0.12em] text-foreground font-medium uppercase">
          WHITEPAPER MANAGEMENT
        </h3>
      </div>

      <div className="space-y-4">
        {/* Project selector */}
        <div>
          <label className="font-mono text-[0.58rem] tracking-[0.15em] text-muted-foreground uppercase block mb-2">
            TARGET PROJECT
          </label>
          <select
            value={projectId}
            onChange={(e) => { setProjectId(e.target.value); setFiles([]); }}
            className="w-full bg-background border border-border px-4 py-2.5 font-mono text-[0.72rem] text-foreground focus:border-primary focus:outline-none transition-colors appearance-none"
          >
            <option value="deltaspine-nl">PRJ-001 · DeltaSpine NL</option>
          </select>
        </div>

        {/* Upload */}
        <div>
          <label className="font-mono text-[0.58rem] tracking-[0.15em] text-muted-foreground uppercase block mb-2">
            UPLOAD PDF
          </label>
          <div className="flex gap-3">
            <label className={`flex-1 border border-dashed border-border hover:border-primary p-4 cursor-pointer transition-colors flex items-center justify-center gap-2 ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
              <Upload className="w-4 h-4 text-primary" />
              <span className="font-mono text-[0.68rem] text-muted-foreground">
                {uploading ? "UPLOADING..." : "SELECT PDF FILE (max 50 MB)"}
              </span>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* List files */}
        <div>
          <button
            onClick={loadFiles}
            disabled={loadingFiles}
            className="font-mono text-[0.62rem] tracking-[0.1em] text-primary hover:underline disabled:opacity-50 mb-3"
          >
            {loadingFiles ? "LOADING..." : "↻ REFRESH FILE LIST"}
          </button>

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((f) => (
                <div key={f.name} className="flex items-center justify-between border border-border bg-background p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-primary" />
                    <div>
                      <span className="font-mono text-[0.72rem] text-foreground block">{f.name}</span>
                      <span className="font-mono text-[0.55rem] text-muted-foreground">{f.size}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-teal" />
                    <button
                      onClick={() => handleDelete(f.name)}
                      className="text-destructive-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 bg-destructive/5 border border-destructive/20 p-3">
        <p className="font-mono text-[0.55rem] tracking-[0.08em] text-muted-foreground leading-relaxed">
          <span className="text-destructive-foreground font-medium">⚠ NOTICE</span> — All uploads and deletions are logged with timestamp. Files are stored encrypted and accessible only to authenticated government users.
        </p>
      </div>
    </div>
  );
};

export default WhitepaperUpload;
