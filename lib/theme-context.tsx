"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "gh-wrapped-theme";
const THEME_EVENT = "gh-wrapped-theme-change";

type ThemeCtx = { worldCup: boolean; toggleWorldCup: () => void };

const ThemeContext = createContext<ThemeCtx>({ worldCup: false, toggleWorldCup: () => {} });

export const useTheme = () => useContext(ThemeContext);

function getStoredWorldCup(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "worldcup";
  } catch {
    return false;
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const notify = () => callback();
  window.addEventListener("storage", notify);
  window.addEventListener(THEME_EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(THEME_EVENT, notify);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const worldCup = useSyncExternalStore(subscribe, getStoredWorldCup, () => false);

  useEffect(() => {
    if (worldCup) {
      document.documentElement.style.setProperty("--slide-bg", "transparent");
      document.documentElement.classList.add("wc-theme");
    } else {
      document.documentElement.style.removeProperty("--slide-bg");
      document.documentElement.classList.remove("wc-theme");
    }
  }, [worldCup]);

  const toggleWorldCup = () => {
    const next = !worldCup;
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "worldcup" : "normal");
      window.dispatchEvent(new Event(THEME_EVENT));
    } catch {
      // Ignore storage failures and keep the current theme.
    }
  };

  return (
    <ThemeContext.Provider value={{ worldCup, toggleWorldCup }}>
      {children}
    </ThemeContext.Provider>
  );
}
