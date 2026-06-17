"use client";

import { motion } from "framer-motion";
import { useRef, useMemo, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { mapToFlat } from "@/components/wrapped/flatProfile";
import { PlanetStage, Stars, MobilePlanet } from "@/components/wrapped/shared";
import { buildFallbackNarrative } from "@/lib/fallbackNarrative";
import { captureElement } from "@/lib/captureElement";
import { ChapterHeadingAnchor, ChapterHeadingMobile } from "@/components/ui/ChapterHeading";
import { Glyph, type GlyphName } from "@/components/wrapped/TrophyIcons";
import { SlideCard } from "@/components/wrapped/SlideCard";
import type { ArchetypeId, WrappedProfile } from "@/types/wrapped";


const LANG_PALETTES: Record<string, { a: string; b: string; glow: string }> = {
  TypeScript: { a: "#3178c6", b: "#cdd6e3", glow: "rgba(49,120,198,0.55)" },
  Python: { a: "#f1c40f", b: "#2ecc71", glow: "rgba(241,196,15,0.5)" },
  Rust: { a: "#ff5a1f", b: "#8b1e08", glow: "rgba(255,90,31,0.55)" },
  Go: { a: "#22d3ee", b: "#0d9488", glow: "rgba(34,211,238,0.5)" },
  JavaScript: { a: "#facc15", b: "#a855f7", glow: "rgba(250,204,21,0.45)" },
  default: { a: "#a78bfa", b: "#f5f3ff", glow: "rgba(167,139,250,0.55)" },
};

function deriveArchetype(nightRatio: number, longestStreak: number, prsMerged: number, totalCommits: number, archetype: string): string {
  if (archetype) return archetype.toUpperCase().startsWith("THE ") ? archetype.toUpperCase() : `THE ${archetype.toUpperCase()}`;
  if (nightRatio >= 0.5) return "THE NIGHT OWL";
  if (longestStreak > 14) return "THE SPRINTER";
  if (prsMerged > 30) return "THE COLLABORATOR";
  if (totalCommits > 300) return "THE BUILDER";
  return "THE EXPLORER";
}

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return n.toString();
}

type PlanetPalette = { a: string; b: string; glow: string };

type PlanetSpec = {
  palette: PlanetPalette;
  username: string;
  primary: ArchetypeId;
  secondary: ArchetypeId | null;
  topLanguage: string;
  topLanguageShare: number;
  languageCount: number;
  totalRepos: number;
  totalStars: number;
  followers: number;
  mergedPrs: number;
  totalCommits: number;
  nightRatio: number;
  focusScore: number;
  explorerScore: number;
  consistencyScore: number;
  growthTrend: "up" | "down" | "flat";
  weekendWarrior: boolean;
};

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(s, 1664525) + 1013904223;
    return (s >>> 0) / 4294967296;
  };
}

function buildPlanetSpec(profile: WrappedProfile, flat: ReturnType<typeof mapToFlat>, palette: PlanetPalette, nightRatio: number): PlanetSpec {
  return {
    palette,
    username: flat.username,
    primary: profile.archetypeBlend.primary.id,
    secondary: profile.archetypeBlend.secondary?.id ?? null,
    topLanguage: flat.topLanguages[0]?.name ?? "default",
    topLanguageShare: flat.topLanguages[0]?.percentage ?? 0,
    languageCount: flat.languageCount,
    totalRepos: flat.totalRepos,
    totalStars: flat.totalStars,
    followers: flat.followers,
    mergedPrs: flat.pullRequests.merged,
    totalCommits: flat.totalCommits,
    nightRatio,
    focusScore: flat.scores.focus,
    explorerScore: flat.scores.explorer,
    consistencyScore: flat.scores.consistency,
    growthTrend: flat.growth.trend,
    weekendWarrior: flat.weekendWarrior,
  };
}

function Planet({ spec }: { spec: PlanetSpec }) {
  const { palette, username, primary, secondary } = spec;
  const moons = primary === "constellation_weaver" || primary === "signal_booster" || secondary === "signal_booster";
  const comets = primary === "flashpoint" || primary === "lone_orbit" || spec.growthTrend === "up";
  const cities = primary === "afterglow" || primary === "archive_keeper" || secondary === "archive_keeper";
  const geometric =
    primary === "foundry" ||
    primary === "cartographer" ||
    primary === "deep_diver" ||
    primary === "caretaker" ||
    secondary === "cartographer";
  const misty =
    primary === "trail_mapper" ||
    primary === "chaos_pilot" ||
    primary === "silent_current" ||
    secondary === "trail_mapper";
  const ringed = spec.totalRepos >= 20 || primary === "cartographer" || primary === "constellation_weaver";
  const aurora = spec.nightRatio >= 0.35 || primary === "afterglow" || primary === "silent_current";
  const satellites = Math.min(4, Math.max(1, Math.floor((spec.followers + spec.totalStars) / 60))) + (moons ? 1 : 0);
  const orbitDots = Math.min(20, 8 + Math.floor(spec.mergedPrs / 4) + Math.floor(spec.languageCount / 2));
  const craterCount = Math.min(16, 5 + Math.floor(spec.totalCommits / 180) + (primary === "caretaker" ? 3 : 0));
  const bandCount = Math.max(3, Math.min(7, Math.round(spec.topLanguageShare / 18)));
  const rng = makeRng(hashString(`${username}-${primary}-${secondary ?? "none"}-${spec.topLanguage}`));
  const craters = Array.from({ length: craterCount }).map((_, i) => ({
    cx: 20 + rng() * 60,
    cy: 18 + rng() * 62,
    rx: 6 + rng() * 10 + (i % 3),
    ry: 4 + rng() * 7,
    o: 0.12 + rng() * 0.18,
  }));
  const glowNodes = Array.from({ length: Math.min(28, 10 + Math.floor((spec.totalStars + spec.followers) / 12)) }).map(() => ({
    cx: 8 + rng() * 84,
    cy: 10 + rng() * 80,
    r: 0.8 + rng() * 1.8,
    o: 0.35 + rng() * 0.55,
  }));
  const ridgeLines = Array.from({ length: Math.min(8, 3 + Math.floor(spec.languageCount / 2)) }).map((_, i) => ({
    y: 24 + i * 18 + rng() * 6,
    x: 15 + rng() * 12,
    w: 95 + rng() * 45,
    rot: -10 + rng() * 20,
  }));
  const orbitRadii = Array.from({ length: ringed ? 2 : 1 }).map((_, i) => 198 + i * 18);
  const languageStyle = spec.topLanguage.toLowerCase();

  return (
    <div className="relative flex flex-col items-center">
      <motion.div className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
        {[...Array(orbitDots)].map((_, i) => {
          const angle = (i / orbitDots) * Math.PI * 2;
          const r = 194 + (i % 3) * 10;
          return (
            <span key={i} className="absolute h-1 w-1 rounded-full"
              style={{ background: i % 4 === 0 ? palette.b : palette.a, boxShadow: `0 0 8px ${palette.glow}`, transform: `translate(${Math.cos(angle) * r}px, ${Math.sin(angle) * r}px)` }} />
          );
        })}
      </motion.div>
      <div className="relative overflow-hidden rounded-full" style={{ width: 360, height: 360 }}>
        <motion.div className="relative h-full w-full overflow-hidden rounded-full"
          style={{ background: `radial-gradient(circle at 30% 30%, ${palette.b}, ${palette.a} 55%, #000 110%)`, boxShadow: `0 0 54px ${palette.glow}, inset -30px -30px 80px rgba(0,0,0,0.7), inset 20px 20px 60px ${palette.glow}` }}
          animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }}>
          {aurora && (
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background: `conic-gradient(from 210deg at 45% 35%, transparent 0deg, ${palette.b}66 55deg, transparent 110deg, ${palette.a}55 190deg, transparent 250deg, ${palette.b}44 310deg, transparent 360deg)`,
                mixBlendMode: "screen",
              }}
            />
          )}
          {ringed && orbitRadii.map((radius, i) => (
            <div
              key={radius}
              className="absolute left-1/2 top-1/2 rounded-full border"
              style={{
                width: radius,
                height: 46 + i * 10,
                transform: "translate(-50%, -50%) rotate(-16deg)",
                borderColor: i === 0 ? `${palette.b}77` : `${palette.a}55`,
                boxShadow: `0 0 16px ${palette.glow}`,
              }}
            />
          ))}
          {Array.from({ length: bandCount }).map((_, i) => (
            <div
              key={`band-${i}`}
              className="absolute left-[-8%] right-[-8%] rounded-full"
              style={{
                top: `${20 + i * 10}%`,
                height: `${7 + (i % 2) * 2}%`,
                transform: `rotate(${i % 2 === 0 ? -14 : 10}deg)`,
                background:
                  languageStyle === "typescript"
                    ? `linear-gradient(90deg, transparent, ${palette.a}66 20%, ${palette.b}55 55%, transparent)`
                    : languageStyle === "python"
                      ? `linear-gradient(90deg, transparent, #f1c40f77 24%, #2ecc7177 64%, transparent)`
                      : languageStyle === "rust"
                        ? `linear-gradient(90deg, transparent, #ff5a1f77 20%, #8b1e0866 60%, transparent)`
                        : languageStyle === "go"
                          ? `linear-gradient(90deg, transparent, #22d3ee66 20%, #0d948866 60%, transparent)`
                          : languageStyle === "javascript"
                            ? `linear-gradient(90deg, transparent, #facc1577 20%, #a855f766 60%, transparent)`
                            : `linear-gradient(90deg, transparent, ${palette.b}66 20%, ${palette.a}55 60%, transparent)`,
                opacity: 0.44 + (i % 3) * 0.08,
              }}
            />
          ))}
          {geometric && (
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full opacity-50">
              {[...Array(12)].map((_, i) => <rect key={i} x={(i * 17) % 180} y={(i * 23) % 170} width={8 + (i % 4) * 3} height={8 + (i % 3) * 3} fill={palette.b} opacity="0.4" />)}
            </svg>
          )}
          {cities && (
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
              {[...Array(30)].map((_, i) => <circle key={i} cx={(i * 13) % 190 + 5} cy={(i * 19) % 190 + 5} r="1.2" fill="#fde047" opacity="0.9" />)}
            </svg>
          )}
          {misty && <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 40% 60%, rgba(255,255,255,0.25), transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.2), transparent 50%)" }} />}
          {!geometric && !cities && !misty && (
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full opacity-40">
              {[...Array(8)].map((_, i) => <ellipse key={i} cx={(i * 29) % 180 + 10} cy={(i * 37) % 180 + 10} rx={8 + (i % 3) * 4} ry={5 + (i % 2) * 3} fill={palette.b} opacity="0.35" />)}
            </svg>
          )}
          <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full opacity-55">
            {craters.map((c, i) => (
              <ellipse key={i} cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry} fill="#000" opacity={c.o} />
            ))}
            {ridgeLines.map((r, i) => (
              <rect
                key={`ridge-${i}`}
                x={r.x}
                y={r.y}
                width={r.w}
                height="2.6"
                rx="2"
                fill={palette.b}
                opacity="0.18"
                transform={`rotate(${r.rot} 100 100)`}
              />
            ))}
            {glowNodes.map((n, i) => (
              <circle key={`node-${i}`} cx={n.cx} cy={n.cy} r={n.r} fill={palette.b} opacity={n.o} />
            ))}
          </svg>
        </motion.div>
        {comets && (
          <motion.div className="absolute inset-0" animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
            <div className="absolute left-1/2 top-0 h-1 w-24 -translate-x-1/2 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${palette.b})` }} />
          </motion.div>
        )}
        {Array.from({ length: satellites }).map((_, i) => (
          <motion.div key={i} className="absolute left-1/2 top-1/2"
            animate={{ rotate: 360 }} transition={{ duration: 18 + i * 8, repeat: Infinity, ease: "linear" }} style={{ width: 0, height: 0 }}>
            <span className="absolute block rounded-full bg-zinc-200"
              style={{ width: Math.max(6, 12 - i * 1.5), height: Math.max(6, 12 - i * 1.5), transform: `translate(${176 + i * 14}px, -6px)`, boxShadow: moons ? "0 0 10px rgba(255,255,255,0.5)" : `0 0 12px ${palette.glow}` }} />
          </motion.div>
        ))}
      </div>
      <motion.div className="mt-8 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Planet</p>
        <p className="mt-1 text-lg italic text-zinc-200" style={{ fontFamily: "serif" }}>{username}</p>
      </motion.div>
    </div>
  );
}

export default function SlideShare({
  profile,
  showStartOver = true,
}: {
  profile: WrappedProfile;
  showStartOver?: boolean;
}) {
  const flat = mapToFlat(profile);
  const cardRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const nightRatio = flat.totalCommits > 0 ? flat.nightCommits / flat.totalCommits : 0;
  const archetype = deriveArchetype(nightRatio, flat.longestStreak, flat.pullRequests.merged, flat.totalCommits, flat.archetype);
  const palette = LANG_PALETTES[flat.topLanguages[0]?.name ?? "default"] || LANG_PALETTES.default;
  const planetSpec = useMemo(
    () => buildPlanetSpec(profile, flat, palette, nightRatio),
    [profile, flat, palette, nightRatio],
  );

  // Profile-driven fallback, re-rolled per render — used only if the AI narrative
  // never arrived (e.g. the narrative request failed entirely).
  const fallback = useMemo(
    () => buildFallbackNarrative(
      {
        username: flat.username,
        archetype: flat.archetype,
        totalCommits: flat.totalCommits,
        longestStreak: flat.longestStreak,
        currentStreak: flat.currentStreak,
        peakHour: flat.peakHour,
        topLanguage: flat.topLanguages[0]?.name ?? "code",
        topRepo: flat.topRepos[0]?.name ?? "your repo",
        nightRatio,
        prsMerged: flat.pullRequests.merged,
        totalRepos: flat.totalRepos,
        periodLabel: flat.period.label,
      },
      profile.tone,
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flat.username, profile.tone],
  );

  const roastLine = profile.narrative?.roastLine ?? fallback.roastLine;
  const narrativeText = profile.narrative?.archetypeDescription ?? fallback.archetypeDescription;

  const badgesEarned = flat.traitBadges.slice(0, 5);

  const share = async () => {
    if (!cardRef.current) return;
    try {
      const main = cardRef.current.closest("main") as HTMLElement | null;
      const blob = main
        ? await captureElement(main, { cropTo: cardRef.current })
        : await captureElement(cardRef.current, {});
      if (!blob) return;
      const file = new File([blob], "planet.png", { type: "image/png" });
      const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void>; canShare?: (d: ShareData) => boolean };
      if (nav.share && nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], title: "My Planet", text: `${archetype} — @${flat.username}` });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `planet-${flat.username}.png`; a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) { console.error(e); }
  };

  const startOver = () => {
    try { sessionStorage.removeItem("wrappedProfile"); } catch {}
    window.location.href = "/";
  };

  return (
    <>
    <main className="relative min-h-full overflow-hidden" style={{ backgroundColor: "#080612" }}>
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 15% 80%, rgba(120,80,200,0.18), transparent 60%)" }} />
      <Stars />
      <ChapterHeadingAnchor n={8} title="Your Planet" />

<div className="relative z-10 grid min-h-screen grid-cols-1 items-start gap-8 px-4 pb-16 pt-16 lg:items-center lg:gap-4 lg:px-8 lg:py-16 lg:grid-cols-3">
        {/* LEFT — cat rocket bobbing */}
        <motion.div className="hidden h-[420px] items-center justify-center lg:flex lg:h-full lg:justify-end" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }}>
          <motion.div animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cat-rocket.png" alt="Cat astronaut" width={280} height={280}
              className="select-none object-contain drop-shadow-[0_0_30px_rgba(167,139,250,0.35)]"
              draggable={false} />
          </motion.div>
        </motion.div>

        {/* CENTER — share card */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5 }} className="flex flex-col items-center justify-center">
          <div className="w-[min(380px,92vw)] lg:hidden">
            <ChapterHeadingMobile n={8} title="Your Planet" />
            <MobilePlanet color={palette.a} />
          </div>
          <SlideCard ref={cardRef} accentColor={palette.a} chapter={8} title="Your Planet">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-base font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${palette.a}, ${palette.b})`, boxShadow: `0 0 20px ${palette.glow}` }}>
                {flat.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={flat.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : flat.username.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Your Planet</p>
                <p className="text-base font-bold text-zinc-100">@{flat.username}</p>
              </div>
            </div>
            <h1 className="mt-3 font-extrabold leading-tight"
              style={{ fontSize: 28, background: `linear-gradient(90deg, ${palette.b}, ${palette.a})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", letterSpacing: "-0.02em" }}>
              {archetype}
            </h1>
            {roastLine && (
              <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: palette.a }}>&ldquo;{roastLine}&rdquo;</p>
            )}
            <p className="mt-2 whitespace-pre-line text-sm italic leading-relaxed text-zinc-300">{narrativeText}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {badgesEarned.map((b) => (
                <span key={b.id} className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs text-zinc-100"
                  style={{ borderColor: `${b.color}55`, background: `${b.color}14`, boxShadow: `0 0 12px ${b.color}44` }}>
                  <span style={{ color: b.color }}><Glyph name={b.icon as GlyphName} size={14} /></span>
                  {b.label}
                </span>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { n: formatNum(flat.totalCommits), l: "commits" },
                { n: formatNum(flat.totalLinesOfCode), l: "lines of code" },
                { n: formatNum(flat.pullRequests.merged), l: "PRs merged" },
                { n: formatNum(flat.totalRepos), l: "repos" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border px-3 py-3"
                  style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.025)" }}>
                  <p className="text-xl font-semibold text-zinc-50">{s.n}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-widest text-zinc-500">{s.l}</p>
                </div>
              ))}
            </div>
          </SlideCard>

          {/* mobile: animated scene below the card (scroll to reveal) */}
          <div className="mt-6 flex justify-center lg:hidden">
            <motion.img src="/cat-rocket.png" alt="Cat astronaut" width={220} height={220}
              className="w-[min(220px,60vw)] select-none object-contain drop-shadow-[0_0_30px_rgba(167,139,250,0.35)]"
              animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              draggable={false} />
          </div>
        </motion.div>

        {/* RIGHT — planet */}
        <motion.div className="relative hidden lg:block" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.8 }}>
          <PlanetStage>
            <Planet spec={planetSpec} />
          </PlanetStage>
        </motion.div>
      </div>

    </main>
    {mounted && showStartOver && createPortal(
      <motion.div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
        <button onClick={startOver} className="flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-5 py-2 text-sm font-medium text-white/70 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:bg-white/10 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Start over
        </button>
      </motion.div>,
      document.body
    )}
    </>
  );
}
