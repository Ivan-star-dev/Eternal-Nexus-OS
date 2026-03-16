import { useState, useEffect, useCallback } from "react";
import { Sun, Moon } from "lucide-react";

function getTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem("npi-theme") as "dark" | "light") || "dark";
}

function applyTheme(theme: "dark" | "light") {
  const root = document.documentElement;
  if (theme === "light") {
    root.classList.add("light");
  } else {
    root.classList.remove("light");
  }
  localStorage.setItem("npi-theme", theme);
}

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"dark" | "light">(getTheme);

  // Apply on mount and sync across instances via storage event
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "npi-theme" && e.newValue) {
        setTheme(e.newValue as "dark" | "light");
      }
    };
    // Also listen for custom event for same-tab sync
    const onCustom = () => setTheme(getTheme());
    window.addEventListener("storage", onStorage);
    window.addEventListener("npi-theme-change", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("npi-theme-change", onCustom);
    };
  }, []);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    window.dispatchEvent(new Event("npi-theme-change"));
  }, [theme]);

  return (
    <button
      onClick={toggle}
      className="p-1.5 border border-border/50 hover:border-primary/50 transition-colors bg-secondary/30 hover:bg-secondary/60"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="w-3.5 h-3.5 text-muted-foreground" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-muted-foreground" />
      )}
    </button>
  );
};

export default ThemeToggle;
