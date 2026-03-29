import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "rx-theme";

function resolveInitialTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem(STORAGE_KEY) as "dark" | "light" | null;
  if (saved === "dark" || saved === "light") return saved;
  // Fall back to system preference when no saved value
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme: "dark" | "light") {
  document.documentElement.classList.toggle("light", theme === "light");
  localStorage.setItem(STORAGE_KEY, theme);
}

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"dark" | "light">(resolveInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === "dark" || e.newValue === "light")) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback(() => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  }, []);

  // Label shows the state you will ENTER on click
  const label = theme === "dark" ? "LIGHT" : "DARK";

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="font-mono text-[0.48rem] tracking-[0.18em] text-muted-foreground hover:text-primary border border-border hover:border-primary/40 transition-all duration-200 px-2.5 py-1 uppercase"
    >
      {label}
    </button>
  );
};

export default ThemeToggle;
