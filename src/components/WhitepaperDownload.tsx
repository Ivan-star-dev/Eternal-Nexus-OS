import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Download, Lock, FileText, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface WhitepaperDownloadProps {
  projectId: string;
  documentName: string;
}

const WhitepaperDownload = ({ projectId, documentName }: WhitepaperDownloadProps) => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [downloading, setDownloading] = useState(false);
  const [fileExists, setFileExists] = useState<boolean | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  // Check if file exists in storage
  useEffect(() => {
    const checkFile = async () => {
      if (!user) return;
      const storagePath = `${projectId}/${documentName}`;
      const { data, error } = await supabase.storage
        .from("whitepapers")
        .list(projectId, { limit: 100 });

      if (data) {
        const file = data.find((f) => f.name === documentName);
        if (file) {
          setFileExists(true);
          const bytes = file.metadata?.size || 0;
          setFileSize(bytes > 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`);
        } else {
          setFileExists(false);
        }
      } else {
        setFileExists(false);
      }
    };
    checkFile();
  }, [user, projectId, documentName]);

  const handleDownload = async () => {
    if (!user || !profile) return;
    setDownloading(true);
    try {
      const storagePath = `${projectId}/${documentName}`;

      // Log the download first
      await supabase.from("download_logs").insert({
        user_id: user.id,
        project_id: projectId,
        document_name: documentName,
        institution: profile.institution,
        country: profile.country,
        user_agent: navigator.userAgent,
      });

      // Log in edit_logs
      await supabase.from("edit_logs").insert({
        user_id: user.id,
        entity_type: "whitepaper_download",
        entity_id: projectId,
        action: "download",
        changes: { document: documentName, institution: profile.institution },
        institution: profile.institution,
      });

      // Download the file
      const { data, error } = await supabase.storage
        .from("whitepapers")
        .download(storagePath);

      if (error) throw error;

      // Create blob URL and trigger download
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = documentName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download initiated",
        description: `${documentName} — logged under ${profile.institution}, ${profile.country}`,
      });
    } catch (err: any) {
      toast({ title: "Download error", description: err.message, variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="border border-border p-6 bg-card"
    >
      <div className="flex items-start gap-4">
        <FileText className="w-8 h-8 text-primary flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-mono text-[0.72rem] tracking-[0.12em] text-foreground font-medium uppercase">
            {documentName}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-mono text-[0.58rem] tracking-[0.08em] text-muted-foreground">
              PDF · CLASSIFIED · {projectId.toUpperCase()}
            </span>
            {fileSize && (
              <span className="font-mono text-[0.55rem] text-teal">{fileSize}</span>
            )}
            {fileExists === false && user && (
              <span className="font-mono text-[0.55rem] text-muted-foreground flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> PENDING UPLOAD
              </span>
            )}
          </div>

          {user && profile ? (
            <div className="mt-4">
              <div className="font-mono text-[0.55rem] tracking-[0.1em] text-muted-foreground/60 mb-3">
                AUTHENTICATED AS: {profile.full_name} · {profile.institution}
              </div>
              <button
                onClick={handleDownload}
                disabled={downloading || fileExists === false}
                className="py-2.5 px-5 bg-primary text-primary-foreground font-mono text-[0.65rem] tracking-[0.12em] hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                {downloading ? "DOWNLOADING..." : fileExists === false ? "DOCUMENT NOT YET AVAILABLE" : t("download_whitepaper")}
              </button>
              <p className="font-mono text-[0.5rem] tracking-[0.08em] text-destructive mt-2">
                ⚠ ALL DOWNLOADS ARE LOGGED WITH TIMESTAMP, INSTITUTION, COUNTRY AND DEVICE
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <Lock className="w-3.5 h-3.5" />
                <span className="font-mono text-[0.62rem] tracking-[0.1em]">
                  {t("download_requires_auth")}
                </span>
              </div>
              <Link
                to="/owner"
                className="inline-block py-2.5 px-5 border border-primary text-primary font-mono text-[0.65rem] tracking-[0.12em] hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {t("nav_login")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WhitepaperDownload;
