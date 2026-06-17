"use client";

import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "gh-wrapped-theme";

type ThemeCtx = { worldCup: boolean; toggleWorldCup: () => void };

const ThemeContext = createContext<ThemeCtx>({ worldCup: false, toggleWorldCup: () => {} });

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [worldCup, setWorldCup] = useState(false);
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    try {
      setWorldCup(window.localStorage.getItem(STORAGE_KEY) === "worldcup");
    } catch {
      setWorldCup(false);
    } finally {
      setThemeReady(true);
    }
  }, []);

  useEffect(() => {
    if (!themeReady) return;

    if (worldCup) {
      document.documentElement.style.setProperty("--slide-bg", "transparent");
      document.documentElement.classList.add("wc-theme");
      window.localStorage.setItem(STORAGE_KEY, "worldcup");
    } else {
      document.documentElement.style.removeProperty("--slide-bg");
      document.documentElement.classList.remove("wc-theme");
      window.localStorage.setItem(STORAGE_KEY, "normal");
    }
  }, [themeReady, worldCup]);

  return (
    <ThemeContext.Provider value={{ worldCup, toggleWorldCup: () => setWorldCup((v) => !v) }}>
      {children}
    </ThemeContext.Provider>
  );
}
