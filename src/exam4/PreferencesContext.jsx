import { createContext, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";

export const PreferencesContext = createContext(null);

const COLS = 48; // how many "paint drips" across the screen
const DURATION = 1600; // ms, make bigger for a slower pour

const easeOut = (t) => 1 - (1 - t) ** 2;

// builds the keyframes of a wavy, dripping polygon edge
function makePourFrames(fromTop) {
  // random start delay for each column, smoothed so the drips look blobby
  let delays = Array.from({ length: COLS + 1 }, () => Math.random() * 0.35);
  for (let pass = 0; pass < 3; pass++) {
    delays = delays.map(
      (d, i) =>
        (delays[i - 1] ?? d) * 0.25 + d * 0.5 + (delays[i + 1] ?? d) * 0.25,
    );
  }

  const frames = [];
  const STEPS = 45;
  for (let s = 0; s <= STEPS; s++) {
    const p = s / STEPS;
    const points = [];
    for (let i = 0; i <= COLS; i++) {
      const local = Math.min(1, Math.max(0, (p - delays[i]) / 0.65));
      const reach = easeOut(local) * 130; // 130% so the screen is fully covered at the end
      const ripple = Math.sin(i * 0.55 + p * 9) * 3 * (1 - p);
      const h = Math.max(0, reach + ripple * Math.min(1, reach / 5));
      const x = (i / COLS) * 100;
      points.push(`${x}% ${fromTop ? h : 100 - h}%`);
    }
    const start = fromTop ? "0% 0%" : "0% 100%";
    const end = fromTop ? "100% 0%" : "100% 100%";
    frames.push({
      clipPath: `polygon(${start}, ${points.join(", ")}, ${end})`,
    });
  }
  return frames;
}

export function PreferencesProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState(16);

  // keeps the "dark" class on <html> in sync (also handles the first render)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains("theme-pouring")) return; // ignore clicks mid-pour

    const next = theme === "light" ? "dark" : "light";
    const apply = () => {
      flushSync(() => setTheme(next));
      root.classList.toggle("dark", next === "dark");
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!document.startViewTransition || reduceMotion) {
      apply();
      return;
    }

    root.classList.add("theme-pouring");
    const transition = document.startViewTransition(apply);

    transition.ready
      .then(() => {
        const options = {
          duration: DURATION,
          easing: "linear",
          fill: "forwards",
          pseudoElement: "::view-transition-new(root)",
        };
        // the paint pouring over the old screen (dark = from top, light = from bottom)
        root.animate(makePourFrames(next === "dark"), options);
        // wet, glossy flash that settles down
        root.animate(
          [
            { filter: "brightness(1.3) saturate(1.7)" },
            { filter: "brightness(1) saturate(1)" },
          ],
          { ...options, duration: DURATION * 1.1, easing: "ease-out" },
        );
      })
      .catch(() => {});

    transition.finished.finally(() => root.classList.remove("theme-pouring"));
  };

  const value = { theme, fontSize, toggleTheme, setFontSize };
  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === null) {
    throw new Error("usePreferences must be used inside a PreferencesProvider");
  }
  return context;
}
