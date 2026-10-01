"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const themeStorageKey = "gen-alpha-lab-theme";

function themeFromDocument(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    let initial = themeFromDocument();
    try {
      const savedTheme = window.localStorage.getItem(themeStorageKey);
      if (savedTheme === "light" || savedTheme === "dark") initial = savedTheme;
    } catch { /* Theme switching also works when browser storage is unavailable. */ }
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { window.localStorage.setItem(themeStorageKey, next); } catch { /* Keep the current page usable. */ }
  }

  const themeLabel = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={themeLabel}
      onClick={toggleTheme}
    >
      {theme === "dark" ? <Sun aria-hidden="true" size={17} /> : <Moon aria-hidden="true" size={17} />}
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
