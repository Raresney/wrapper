"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

// Reference desktop height for scale calculation.
// scale = physicalHeight / DESKTOP_H → 100dvh ≈ DESKTOP_H after browser scales content.
const DESKTOP_H = 810;

type ViewportState = "desktop" | "landscape" | "portrait";

function applyLandscapeViewport(w: number, h: number) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (!meta) return;
  const scale = h / DESKTOP_H;
  const cssWidth = Math.round(w / scale);
  meta.content = `width=${cssWidth}, initial-scale=${scale}, maximum-scale=${scale}, user-scalable=no, viewport-fit=cover`;
}

function resetViewport() {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (meta) meta.content = "width=device-width, initial-scale=1, viewport-fit=cover";
}

// ── MobileGate ──────────────────────────────────────────────────────────────
export function MobileGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ViewportState>("desktop");
  // Store the physical dimensions used for scaling so we can re-apply on any navigation.
  const dims = useRef<{ w: number; h: number } | null>(null);
  const ready = useRef(false);
  const pathname = usePathname();

  // ── Initial setup (runs once on mount) ──────────────────────────────────
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    ready.current = true;

    if (!isTouch) {
      setState("desktop");
      return;
    }

    // Capture physical dimensions BEFORE any viewport change.
    // After applyLandscapeViewport(), innerWidth/Height change — don't re-read for detection.
    const physW = window.innerWidth;
    const physH = window.innerHeight;

    // Tablets (max dim ≥ 1024px) → show desktop layout untouched
    if (Math.max(physW, physH) >= 1024) {
      setState("desktop");
      return;
    }

    const applyPhone = (w: number, h: number) => {
      if (w > h) {
        dims.current = { w, h };
        applyLandscapeViewport(w, h);
        setState("landscape");
      } else {
        dims.current = null;
        resetViewport();
        setState("portrait");
      }
    };

    applyPhone(physW, physH);

    // orientationchange: reset viewport first to recover real CSS px dimensions,
    // then wait for browser to finish rotation before re-detecting.
    // We deliberately avoid "resize" — changing viewport meta fires resize,
    // creating a feedback loop (scaled width ≥ 1024 → reset → real width → scale → ...).
    const onOrientationChange = () => {
      resetViewport();
      setTimeout(() => applyPhone(window.innerWidth, window.innerHeight), 200);
    };

    // pageshow with e.persisted = true means the browser restored the page from
    // bfcache (back/forward navigation). In that case the viewport meta may have
    // been reset to its cached value — re-apply immediately.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted && dims.current) {
        applyLandscapeViewport(dims.current.w, dims.current.h);
      }
    };

    window.addEventListener("orientationchange", onOrientationChange);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("orientationchange", onOrientationChange);
      window.removeEventListener("pageshow", onPageShow);
      resetViewport();
    };
  }, []);

  // ── Re-apply on every Next.js client-side navigation ────────────────────
  // Covers the case where the browser or Next.js resets the viewport meta
  // when the route changes (e.g. back button handled by the router, not bfcache).
  useEffect(() => {
    if (!ready.current) return;
    if (dims.current) {
      applyLandscapeViewport(dims.current.w, dims.current.h);
    }
  }, [pathname]);

  return <>{children}</>;
}
