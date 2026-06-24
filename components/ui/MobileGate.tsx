"use client";

import { useEffect, useState, type ReactNode } from "react";

// Reference desktop height used to calculate the viewport scale on mobile landscape.
// Chosen so the desktop layout (designed at ~1440×810) fits the phone screen perfectly:
// scale = innerHeight / DESKTOP_H  →  100dvh ≈ DESKTOP_H in CSS px after scaling.
const DESKTOP_H = 810;

type ViewportState = "desktop" | "landscape" | "portrait";

function detectState(w: number, h: number): ViewportState {
  // (pointer: coarse) = touch device — distinguishes phone/tablet from desktop browser
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  // Tablets in landscape (≥1024px) get the desktop layout untouched
  if (!isTouch || w >= 1024) return "desktop";
  return h > w ? "portrait" : "landscape";
}

function applyLandscapeViewport(w: number, h: number) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (!meta) return;
  // Scale so the phone height equals DESKTOP_H CSS px; width follows proportionally.
  // Result: 100dvh ≈ DESKTOP_H, 100vw ≈ w/scale (≥1440 for common phones),
  // lg: breakpoint (1024px) fires → desktop 3-column layout activates naturally.
  const scale = h / DESKTOP_H;
  const cssWidth = Math.round(w / scale);
  meta.content = `width=${cssWidth}, initial-scale=${scale}, maximum-scale=${scale}, user-scalable=no, viewport-fit=cover`;
}

function resetViewport() {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (meta) meta.content = "width=device-width, initial-scale=1, viewport-fit=cover";
}

// ── Portrait overlay ────────────────────────────────────────────────────────
function PortraitOverlay() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-8"
      style={{ background: "var(--space-deep, #080612)" }}
    >
      <style>{`
        @keyframes mg-phone-tilt {
          0%, 30%  { transform: rotate(0deg); }
          55%, 75% { transform: rotate(-90deg); }
          100%     { transform: rotate(0deg); }
        }
        @keyframes mg-glow-pulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50%      { opacity: 0.55; transform: scale(1.14); }
        }
      `}</style>

      {/* ambient glow ring */}
      <div className="relative flex items-center justify-center">
        <div
          className="absolute h-28 w-28 rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.72 0.18 295 / 0.28), transparent 70%)",
            animation: "mg-glow-pulse 2.6s ease-in-out infinite",
          }}
        />

        {/* phone icon that tilts to landscape */}
        <div style={{ animation: "mg-phone-tilt 2.8s ease-in-out infinite" }}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
            <rect
              x="14" y="7" width="28" height="42" rx="5.5"
              stroke="oklch(0.72 0.18 295)"
              strokeWidth="2.5"
              fill="oklch(0.72 0.18 295 / 0.07)"
            />
            <circle cx="28" cy="42.5" r="2.8" fill="oklch(0.72 0.18 295 / 0.5)" />
            <rect x="21" y="10.5" width="14" height="2" rx="1" fill="oklch(0.72 0.18 295 / 0.3)" />
          </svg>
        </div>
      </div>

      {/* text */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p
          className="text-[16px] font-semibold tracking-tight"
          style={{ color: "rgba(255,255,255,0.9)" }}
        >
          Rotate your device
        </p>
        <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.38)" }}>
          Landscape mode is required
        </p>
      </div>

      {/* ← landscape → arrows */}
      <div
        className="flex items-center gap-3"
        style={{ color: "oklch(0.72 0.18 295 / 0.4)" }}
      >
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden
        >
          <path d="M19 12H5M9 6l-6 6 6 6" />
        </svg>
        <span
          className="text-[10px] uppercase tracking-[0.24em]"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          landscape
        </span>
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 12h14M15 6l6 6-6 6" />
        </svg>
      </div>
    </div>
  );
}

// ── MobileGate ──────────────────────────────────────────────────────────────
export function MobileGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ViewportState>("desktop");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const s = detectState(w, h);
      if (s === "landscape") {
        applyLandscapeViewport(w, h);
      } else {
        resetViewport();
      }
      setState(s);
    };

    update();
    window.addEventListener("resize", update);
    // orientationchange fires before innerWidth/Height update — small delay
    const onOrientation = () => setTimeout(update, 150);
    window.addEventListener("orientationchange", onOrientation);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", onOrientation);
      resetViewport();
    };
  }, []);

  if (state === "portrait") return <PortraitOverlay />;
  return <>{children}</>;
}
