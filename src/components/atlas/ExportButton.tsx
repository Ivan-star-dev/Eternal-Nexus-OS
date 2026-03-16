import { useCallback } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Scene } from "three";

interface ExportButtonProps {
  getScene: () => Scene | null;
}

export default function ExportButton({ getScene }: ExportButtonProps) {
  const handleExport = useCallback(async () => {
    const scene = getScene();
    if (!scene) return;

    const { GLTFExporter } = await import("three/examples/jsm/exporters/GLTFExporter.js");
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (gltf) => {
        const blob = new Blob([JSON.stringify(gltf)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "nova-terra-atlas.gltf";
        a.click();
        URL.revokeObjectURL(url);
      },
      (error) => console.error("GLTF export error:", error),
      {}
    );
  }, [getScene]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      className="gap-2 font-mono text-[0.6rem] tracking-widest uppercase border-primary/30 text-primary hover:bg-primary/10"
    >
      <Download className="h-3.5 w-3.5" />
      Export GLTF
    </Button>
  );
}
