import { Slider } from "@/components/ui/slider";
import { Clock, Sun, Moon } from "lucide-react";

interface TimelineSliderProps {
  value: number;
  onChange: (v: number) => void;
}

export default function TimelineSlider({ value, onChange }: TimelineSliderProps) {
  const isDayTime = value > 25 && value < 75;

  return (
    <div className="flex items-center gap-3 bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg px-4 py-2 min-w-[240px]">
      {isDayTime ? (
        <Sun className="h-3.5 w-3.5 text-primary shrink-0" />
      ) : (
        <Moon className="h-3.5 w-3.5 text-primary shrink-0" />
      )}
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={0}
        max={100}
        step={1}
        className="flex-1"
      />
      <div className="flex flex-col items-end">
        <span className="font-mono text-[0.5rem] tracking-widest text-primary">
          {Math.floor(value * 24 / 100).toString().padStart(2, "0")}:{Math.floor((value * 24 / 100 % 1) * 60).toString().padStart(2, "0")}
        </span>
        <span className="font-mono text-[0.35rem] text-muted-foreground">UTC</span>
      </div>
    </div>
  );
}
