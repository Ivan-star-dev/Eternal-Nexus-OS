import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface RightClickPromptProps {
  x: number;
  y: number;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export default function RightClickPrompt({ x, y, onSubmit, onCancel }: RightClickPromptProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  return (
    <div
      className="fixed z-[100] pointer-events-auto"
      style={{ left: x, top: y }}
    >
      <div className="bg-background border-2 border-primary p-3 shadow-2xl min-w-[220px]">
        <span className="font-mono text-[0.5rem] tracking-[0.2em] text-primary uppercase block mb-2">
          + NOVO PROJETO
        </span>
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              onSubmit(value.trim());
            }
          }}
          placeholder="Nome do projeto..."
          className="h-8 text-xs font-mono bg-card border-border"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="font-mono text-[0.45rem] text-muted-foreground">ENTER para confirmar · ESC para cancelar</span>
        </div>
      </div>
    </div>
  );
}
