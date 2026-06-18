"use client";

import Image from "next/image";
import React from "react";
import stadium from "@/components/pawcup/assets/stadium.asset.json";
import champion from "@/components/pawcup/assets/champion-cat.png.asset.json";
import stadiumCelebration from "@/components/pawcup/assets/stadium-celebration.jpg.asset.json";
import catGrey from "@/components/pawcup/assets/cat-grey.png.asset.json";
import catWhite from "@/components/pawcup/assets/cat-white.png.asset.json";
import catBrown from "@/components/pawcup/assets/cat-brown.png.asset.json";
import catSilver from "@/components/pawcup/assets/cat-silver.png.asset.json";

// Deterministic RNG so SSR and client output match (no hydration mismatch)
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}
const r1 = seeded(770077);
const STARS = Array.from({ length: 40 }).map(() => ({
  x: r1() * 100, y: r1() * 100, d: r1() * 3, s: 1 + r1() * 2,
}));
const r2 = seeded(330033);
const CONFETTI = Array.from({ length: 28 }).map(() => ({
  x: r2() * 100,
  d: r2() * 6,
  dur: 5 + r2() * 5,
  c: ["#facc15", "#a855f7", "#ec4899", "#22d3ee", "#ffffff"][Math.floor(r2() * 5)],
  rot: r2() * 360,
}));
const r3 = seeded(990011);
const FIREWORKS = Array.from({ length: 6 }).map(() => ({
  x: 10 + r3() * 80, y: 10 + r3() * 40, d: r3() * 4,
  c: ["#facc15", "#a855f7", "#ec4899", "#22d3ee"][Math.floor(r3() * 4)],
}));
const SCREEN_FW = [
  { x: 12, y: 18, d: 0,    c: "#facc15", size: 72,  n: 16 },
  { x: 82, y: 12, d: 0.95, c: "#a855f7", size: 58,  n: 14 },
  { x: 48, y: 8,  d: 1.8,  c: "#ec4899", size: 86,  n: 16 },
  { x: 22, y: 55, d: 2.7,  c: "#22d3ee", size: 64,  n: 14 },
  { x: 74, y: 50, d: 0.5,  c: "#facc15", size: 78,  n: 16 },
  { x: 92, y: 30, d: 1.4,  c: "#a855f7", size: 52,  n: 12 },
  { x: 8,  y: 38, d: 2.1,  c: "#ec4899", size: 68,  n: 14 },
  { x: 60, y: 22, d: 0.7,  c: "#22d3ee", size: 60,  n: 14 },
  { x: 36, y: 32, d: 1.6,  c: "#facc15", size: 74,  n: 16 },
  { x: 88, y: 68, d: 1.1,  c: "#a855f7", size: 54,  n: 12 },
  { x: 44, y: 72, d: 3.0,  c: "#ec4899", size: 66,  n: 14 },
  { x: 5,  y: 65, d: 1.3,  c: "#22d3ee", size: 58,  n: 12 },
  { x: 67, y: 78, d: 2.3,  c: "#facc15", size: 70,  n: 14 },
  { x: 30, y: 15, d: 0.3,  c: "#a855f7", size: 62,  n: 14 },
];

function Slide7() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-[#0b0418]"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(11,4,24,0.85), rgba(11,4,24,0.95)), url(${stadium.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-fuchsia-600/20 blur-3xl" />

      {STARS.map((st, i) => (
        <div key={i} className="absolute rounded-full bg-white animate-twinkle"
          style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s, animationDelay: `${st.d}s` }} />
      ))}
      {CONFETTI.map((c, i) => (
        <div key={`c-${i}`} className="absolute top-[-20px] w-2 h-3 animate-confetti-fall"
          style={{ left: `${c.x}%`, background: c.c, animationDelay: `${c.d}s`, animationDuration: `${c.dur}s`, transform: `rotate(${c.rot}deg)` }} />
      ))}

      {/* screen-wide fireworks */}
      {SCREEN_FW.map((f, i) => {
        const sparkLen = f.size * 0.52;
        const angles = Array.from({ length: f.n }, (_, j) => (360 / f.n) * j);
        return (
          <div key={`sfw-${i}`} className="absolute pointer-events-none z-[5]"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}>
            {/* outer ring */}
            <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-fw-ring"
              style={{ width: f.size * 1.35, height: f.size * 1.35, border: `1px solid ${f.c}`, animationDelay: `${f.d + 0.08}s`, opacity: 0.35 }} />
            {/* main ring */}
            <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-fw-ring"
              style={{ width: f.size, height: f.size, border: `2px solid ${f.c}`, boxShadow: `0 0 8px ${f.c}88`, animationDelay: `${f.d}s` }} />
            {/* inner ring */}
            <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-fw-ring"
              style={{ width: f.size * 0.48, height: f.size * 0.48, border: `1.5px solid ${f.c}`, animationDelay: `${f.d + 0.2}s`, opacity: 0.75 }} />
            {/* center burst — white core fading to color */}
            <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-fw-burst"
              style={{ width: 16, height: 16, background: "#fff", boxShadow: `0 0 16px 6px #fff, 0 0 36px 14px ${f.c}`, animationDelay: `${f.d}s` }} />
            {/* directional sparks — each rotated via CSS var so animation works */}
            {angles.map((angle, j) => {
              const isThick = j % 2 === 0;
              return (
                <div key={j} className="absolute animate-fw-spark"
                  style={{
                    "--angle": `${angle}deg`,
                    left: "50%",
                    top: "50%",
                    marginLeft: isThick ? -1.5 : -1,
                    marginTop: -sparkLen,
                    width: isThick ? 3 : 1.5,
                    height: sparkLen,
                    background: isThick
                      ? `linear-gradient(to top, ${f.c}, #fff 65%, transparent)`
                      : `linear-gradient(to top, ${f.c}99, transparent)`,
                    transformOrigin: "50% 100%",
                    borderRadius: 2,
                    animationDelay: `${f.d}s`,
                    boxShadow: isThick ? `0 0 4px ${f.c}` : "none",
                  } as React.CSSProperties} />
              );
            })}
          </div>
        );
      })}

      {/* ====== LEFT: champion cat on podium with teammates ====== */}
      <div className="absolute left-0 top-0 bottom-0 w-[34%] z-10">
        <div className="relative w-full h-full">
          {/* spotlights */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[140%] h-[80%] origin-top">
            <div className="absolute inset-0 bg-[conic-gradient(from_205deg_at_50%_0%,transparent_0deg,rgba(250,204,21,0.25)_25deg,transparent_55deg,rgba(168,85,247,0.25)_80deg,transparent_110deg)] animate-spot-sway" />
          </div>

          {/* aura glow behind champion */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[12%] w-[70%] h-[70%]">
            <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-3xl animate-glow-pulse" />
          </div>

          {/* all 5 cats on the podium — same height, evenly spaced */}
          <Teammate className="absolute z-10"
            style={{ left: "-4%", bottom: "22%", width: "28%" }}
            src={catGrey.url} delay="0.4s" />
          <Teammate className="absolute z-10"
            style={{ left: "16%", bottom: "22%", width: "28%" }}
            src={catWhite.url} delay="0.2s" />
          {/* center champion */}
          <div className="absolute z-20"
               style={{ left: "34%", bottom: "22%", width: "33%" }}>
            <Image
              src={champion.url}
              alt="Champion cat lifting the World Cup trophy"
              width={1024}
              height={1024}
              className="w-full h-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.7)]"
              loading="lazy"
              unoptimized
            />
          </div>
          <Teammate className="absolute z-10"
            style={{ left: "56%", bottom: "22%", width: "28%" }}
            src={catBrown.url} delay="0.2s" />
          <Teammate className="absolute z-10"
            style={{ right: "-4%", bottom: "22%", width: "28%" }}
            src={catSilver.url} delay="0.4s" />

          {/* single-level uniform podium */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[19%] w-[96%] z-0">
            <div className="relative h-14 rounded-md bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 border-2 border-amber-200/80 shadow-[0_0_40px_rgba(250,204,21,0.55)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-amber-200/80" />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-900/60" />
              <div className="absolute inset-x-3 top-2 bottom-2 flex justify-between opacity-60">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} className="w-[2px] bg-amber-900/70" />
                ))}
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 px-4 py-1 rounded bg-purple-950 text-amber-300 text-[11px] font-black tracking-[0.4em] border border-amber-300/60 shadow">
                CHAMPIONS · 2026
              </div>
            </div>
            <div className="mx-auto mt-1 w-[92%] h-3 rounded-[50%] bg-black/60 blur-md" />
          </div>

          {/* caption */}
        </div>
      </div>

      {/* ====== RIGHT: modern flat-screen TV ====== */}
      <div className="absolute right-0 top-0 bottom-0 w-[32%] z-10 flex items-center justify-center">
        <div className="relative w-[65%]">
          {/* TV chassis — slim dark panel */}
          <div className="relative rounded-[10px] shadow-[0_30px_80px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.4)]"
               style={{ background: "linear-gradient(160deg,#d4d4d8,#a1a1aa,#71717a)", padding: "9px 9px 12px", border: "2px solid #6b7280" }}>

            {/* top bezel row */}
            <div className="flex items-center justify-between px-2 mb-2">
              <div className="text-zinc-600 text-[6px] tracking-[0.5em] font-semibold">PAW·VISION</div>
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-blink shadow-[0_0_5px_rgba(239,68,68,0.9)]" />
            </div>

            {/* screen */}
            <div className="relative rounded-[5px] overflow-hidden aspect-[4/5] shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]">
              <Image
                src={stadiumCelebration.url}
                alt="Packed stadium celebrating with fireworks and confetti"
                width={1024}
                height={1280}
                className="absolute inset-0 w-full h-full object-cover animate-zoom-slow"
                loading="lazy"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-purple-900/20" />
              {/* subtle scanlines */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.12)_0,rgba(0,0,0,0.12)_1px,transparent_1px,transparent_3px)] z-10 pointer-events-none" />
              {/* glass glare */}
              <div className="absolute inset-0 pointer-events-none z-10"
                   style={{ background: "linear-gradient(130deg,rgba(255,255,255,0.07) 0%,transparent 35%,transparent 65%,rgba(255,255,255,0.03) 100%)" }} />
              {/* flicker */}
              <div className="absolute inset-0 bg-white/0 animate-screen-flicker pointer-events-none z-10" />

              {/* fireworks on screen */}
              {FIREWORKS.map((f, i) => (
                <div key={i} className="absolute w-2 h-2 rounded-full animate-firework z-20"
                  style={{ left: `${f.x}%`, top: `${f.y}%`, background: f.c, boxShadow: `0 0 30px 8px ${f.c}`, animationDelay: `${f.d}s` }} />
              ))}

              {/* LIVE pill */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-[9px] font-black tracking-[0.3em] px-2 py-0.5 rounded shadow-lg z-20">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-blink" />LIVE · FINAL
              </div>
              <div className="absolute top-2 right-2 text-amber-200 text-[8px] tracking-[0.3em] font-mono z-20">CAM · 04</div>

              {/* CHAMPIONS overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-20">
                <div className="px-3 pb-1">
                  <div className="text-amber-300/90 text-[9px] tracking-[0.4em] font-bold">GTH · WORLD CUP</div>
                  <h2 className="text-4xl font-black leading-[0.9] tracking-tight bg-gradient-to-b from-white via-amber-200 to-amber-500 bg-clip-text text-transparent animate-title-glow">
                    CHAMPIONS
                  </h2>
                </div>
                <div className="overflow-hidden bg-black/70 border-t border-amber-500/40">
                  <div className="whitespace-nowrap py-0.5 text-amber-300 text-[8px] tracking-widest font-mono animate-ticker">
                    ★ FT · GTH 2–1 WRP · WORLD CHAMPIONS · 82,500 FANS · ★ FT · GTH 2–1 WRP · WORLD CHAMPIONS · 82,500 FANS ·
                  </div>
                </div>
              </div>
            </div>

            {/* bottom bezel — brand strip */}
            <div className="flex items-center justify-center mt-2.5">
              <div className="text-zinc-600 text-[7px] tracking-[0.6em] font-bold select-none">PAW · VISION</div>
            </div>

            {/* bottom edge highlight */}
            <div className="absolute bottom-0 left-6 right-6 h-[1px] rounded-full bg-white/5" />
          </div>

          {/* slim neck */}
          <div className="mx-auto w-[7%] h-7 bg-gradient-to-b from-zinc-400 to-zinc-600" />
          <div className="mx-auto w-[55%] h-[10px] rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.6)]"
               style={{ background: "linear-gradient(180deg,#a1a1aa,#52525b)" }} />
          {/* base shadow */}
          <div className="mx-auto mt-1 w-[58%] h-1.5 rounded-[50%] bg-black/40 blur-md" />
        </div>
      </div>

      {/* ====== CENTER CARD ====== */}
      <div data-wc-center-card className="absolute inset-0 z-20 flex items-center justify-center px-4 pointer-events-none">
        <div className="w-[440px] max-w-[90vw] rounded-3xl bg-[#161029]/85 backdrop-blur-xl border border-purple-400/20 shadow-[0_30px_80px_-20px_rgba(168,85,247,0.5)] p-7 pointer-events-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 grid place-items-center text-purple-950 font-black text-2xl shadow-[0_0_30px_rgba(250,204,21,0.6)]">
              🏆
            </div>
            <div>
              <div className="text-amber-300/80 text-[10px] tracking-[0.35em] font-semibold">WORLD CUP 2026</div>
              <div className="text-white text-2xl font-bold">Champions!</div>
            </div>
          </div>

          <p className="mt-5 text-white/80 text-sm leading-relaxed">
            <span className="text-amber-400 font-bold">Purple Paws FC</span> lift the cup! A dream season ends with cats on top of the world — gold around their necks and the trophy held to the sky.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-purple-300/60 text-[9px] tracking-[0.3em]">FINAL</div>
              <div className="text-white text-xl font-black mt-1">2-1</div>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-purple-300/60 text-[9px] tracking-[0.3em]">TITLES</div>
              <div className="text-amber-400 text-xl font-black mt-1">01</div>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-purple-300/60 text-[9px] tracking-[0.3em]">UNBEATEN</div>
              <div className="text-purple-300 text-xl font-black mt-1">7-0</div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-gradient-to-r from-amber-500/30 to-fuchsia-600/30 border border-amber-400/40 p-3">
            <div className="text-amber-200/80 text-[9px] tracking-[0.3em]">GOLDEN PAW</div>
            <div className="text-white text-lg font-bold mt-1">@whiskermessi · 8 goals</div>
            <div className="text-purple-300/60 text-[10px] mt-1">Top scorer · Player of the tournament</div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-purple-950 rounded-full px-3 py-1 text-[10px] font-black tracking-widest">
              <span>07</span><span>·</span><span>CHAMPIONS</span>
            </div>
            <div className="text-amber-300/70 text-[10px] tracking-[0.3em]">FULL · TIME</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.15} 50%{opacity:1} }
        .animate-twinkle { animation: twinkle 2.5s ease-in-out infinite; }
        @keyframes confetti-fall { 0%{transform:translateY(-10vh) rotate(0)} 100%{transform:translateY(110vh) rotate(720deg)} }
        .animate-confetti-fall { animation: confetti-fall linear infinite; }
        @keyframes spot-sway { 0%,100%{transform:rotate(-6deg)} 50%{transform:rotate(6deg)} }
        .animate-spot-sway { animation: spot-sway 7s ease-in-out infinite; transform-origin: 50% 0%; }
        @keyframes glow-pulse { 0%,100%{opacity:.55} 50%{opacity:1} }
        .animate-glow-pulse { animation: glow-pulse 3.5s ease-in-out infinite; }
        @keyframes cat-hold { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .animate-cat-hold { animation: cat-hold 3.6s ease-in-out infinite; transform-origin: bottom center; }
        @keyframes team-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        .animate-team-bob { animation: team-bob 2.6s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.15} }
        .animate-blink { animation: blink 1s ease-in-out infinite; }
        @keyframes title-glow { 0%,100%{filter:drop-shadow(0 0 8px rgba(250,204,21,0.5))} 50%{filter:drop-shadow(0 0 22px rgba(250,204,21,0.9))} }
        .animate-title-glow { animation: title-glow 2.6s ease-in-out infinite; }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .animate-ticker { animation: ticker 18s linear infinite; display:inline-block; padding-left:100%; }
        @keyframes zoom-slow { 0%,100%{transform:scale(1.02)} 50%{transform:scale(1.08)} }
        .animate-zoom-slow { animation: zoom-slow 14s ease-in-out infinite; }
        @keyframes screen-flicker { 0%,97%,100%{opacity:0} 98%{opacity:.08} 99%{opacity:0} }
        .animate-screen-flicker { animation: screen-flicker 6s linear infinite; background:#fff; }
        @keyframes fw-ring {
          0%   { transform: translate(-50%,-50%) scale(0.05); opacity: 1; }
          55%  { opacity: 0.85; }
          100% { transform: translate(-50%,-50%) scale(1); opacity: 0; }
        }
        .animate-fw-ring { animation: fw-ring 1.55s cubic-bezier(0.22,0.61,0.36,1) infinite; }
        @keyframes fw-burst {
          0%,8%  { transform: translate(-50%,-50%) scale(2.2); opacity: 1; }
          40%    { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
          100%   { transform: translate(-50%,-50%) scale(0); opacity: 0; }
        }
        .animate-fw-burst { animation: fw-burst 1.55s ease-out infinite; }
        @keyframes fw-spark {
          0%   { transform: rotate(var(--angle,0deg)) scaleY(0); opacity: 1; }
          22%  { transform: rotate(var(--angle,0deg)) scaleY(1); opacity: 1; }
          65%  { transform: rotate(var(--angle,0deg)) scaleY(0.85); opacity: 0.65; }
          100% { transform: rotate(var(--angle,0deg)) scaleY(0.2); opacity: 0; }
        }
        .animate-fw-spark { animation: fw-spark 1.55s ease-out infinite; }
        @keyframes firework {
          0%   { transform:scale(.2); opacity:0 }
          20%  { transform:scale(1); opacity:1 }
          60%  { transform:scale(2.4); opacity:.6 }
          100% { transform:scale(3.2); opacity:0 }
        }
        .animate-firework { animation: firework 2.6s ease-out infinite; }
      `}</style>
    </div>
  );
}

function Teammate({ className, src, style }: { className?: string; src: string; delay: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={style}>
      <Image
        src={src}
        alt="Teammate cat celebrating"
        width={1024}
        height={1024}
        className="w-full h-auto drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)]"
        loading="lazy"
        unoptimized
      />
    </div>
  );
}

export default Slide7;


