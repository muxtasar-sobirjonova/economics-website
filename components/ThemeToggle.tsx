"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark" | "system";

const STORAGE_KEY = "tse-theme";

export function applyTheme(mode: Mode) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = mode === "dark" || (mode === "system" && prefersDark);
  root.setAttribute("data-theme", dark ? "dark" : "light");
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Mode | null) ?? "light";
    setMode(stored);
    setMounted(true);

    // Keep "system" honest if the OS flips while the page is open.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if ((localStorage.getItem(STORAGE_KEY) as Mode | null) === "system") applyTheme("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const choose = (next: Mode) => {
    setMode(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  return (
    <div className="flex gap-s1 p-1 rounded-md bg-bg-sunk" role="group" aria-label="Appearance">
      {(["light", "dark", "system"] as const).map((m) => {
        const on = mounted && mode === m;
        return (
          <button
            key={m}
            onClick={() => choose(m)}
            aria-pressed={on}
            className={`px-s3 py-s2 rounded-sm text-meta capitalize transition-colors min-h-[40px] ${
              on ? "bg-surface text-ink shadow-sh1 font-medium" : "text-muted hover:text-ink"
            }`}
          >
            {m}
          </button>
        );
      })}
    </div>
  );
}
