"use client";

import { useMemo, useEffect, useState } from "react";
import stadium from "@/components/pawcup/assets/stadium.asset.json";

function Slide4() {
  const stars = useMemo(
    () => Array.from({ length: 45 }).map(() => ({ x: Math.random() * 100, y: Math.random() * 100, d: Math.random() * 3, s: 1 + Math.random() * 2 })),
    [],
  );
  const confetti = useMemo(
    () =>
      Array.from({ length: 22 }).map(() => ({
        x: Math.random() * 100,
        d: Math.random() * 6,
        dur: 5 + Math.random() * 5,
        c: ["#facc15", "#a855f7", "#ec4899", "#22d3ee", "#ffffff"][Math.floor(Math.random() * 5)],
        r: Math.random() * 360,
      })),
    [],
  );

  // countdown to a fixed match date
  const target = useMemo(() => new Date("2026-07-19T20:00:00Z").getTime(), []);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-[#0b0418]"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(11,4,24,0.85), rgba(11,4,24,0.95)), url(${stadium.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* ambient blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-fuchsia-600/20 blur-3xl" />

      {/* stars */}
      {stars.map((st, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s, animationDelay: `${st.d}s` }}
        />
      ))}

      {/* confetti */}
      {confetti.map((c, i) => (
        <div
          key={`c-${i}`}
          className="absolute top-[-20px] w-2 h-3 animate-confetti-fall"
          style={{ left: `${c.x}%`, background: c.c, animationDelay: `${c.d}s`, animationDuration: `${c.dur}s`, transform: `rotate(${c.r}deg)` }}
        />
      ))}

      {/* HEADER */}

      {/* ====== LEFT: ticket booth ====== */}
      <div className="absolute left-0 top-0 bottom-0 w-[28%] z-10 flex items-end justify-center pb-[4%]">
        <div className="relative w-[90%] translate-y-[2%] flex flex-col items-center">
          <img
            src="/ticket-booth.png"
            alt="Ticket booth"
            className="w-full h-auto block drop-shadow-[0_25px_35px_rgba(0,0,0,0.7)]"
          />
        </div>
      </div>

      {/* ====== RIGHT: Stadium Billboard ====== */}
      <div className="absolute right-0 top-0 bottom-0 w-[34%] z-10 flex items-center justify-center">
        <div className="relative w-[92%]">
          {/* billboard pole */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-8%] w-4 h-[22%] bg-gradient-to-b from-zinc-400 to-zinc-700 rounded-b-sm z-0" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-8%] w-10 h-3 bg-gradient-to-b from-zinc-500 to-zinc-800 rounded-full z-0" />

          {/* billboard outer frame */}
          <div className="relative rounded-2xl z-10"
            style={{
              background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
              border: "6px solid #374151",
              boxShadow: "0 0 0 2px #6b7280, 0 30px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}>

            {/* LED top strip */}
            <div className="flex gap-[3px] px-2 pt-2 pb-1 justify-center">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full animate-blink"
                  style={{ background: i % 3 === 0 ? "#facc15" : i % 3 === 1 ? "#a855f7" : "#ef4444", animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>

            {/* main screen */}
            <div className="mx-2 mb-2 rounded-xl overflow-hidden relative"
              style={{ background: "linear-gradient(135deg, #0f0728 0%, #1a0540 50%, #0a0318 100%)", minHeight: "320px" }}>

              {/* scanlines overlay */}
              <div className="absolute inset-0 pointer-events-none z-10"
                style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 4px)" }} />

              {/* glow blobs */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] rounded-full bg-amber-400/15 blur-3xl" />
              <div className="absolute bottom-0 left-1/4 w-[50%] h-[30%] rounded-full bg-purple-600/20 blur-2xl" />

              <div className="relative z-20 p-5 flex flex-col items-center gap-3">
                {/* world cup badge */}
                <div className="flex items-center gap-2">
                  <div className="w-px h-6 bg-amber-400/50" />
                  <span className="text-amber-300 text-[9px] font-black tracking-[0.5em]">WORLD CUP 2026</span>
                  <div className="w-px h-6 bg-amber-400/50" />
                </div>

                {/* THE GRAND FINAL */}
                <div className="text-center">
                  <div className="text-purple-300/70 text-[10px] tracking-[0.6em] font-bold">THE GRAND</div>
                  <div className="font-black text-6xl leading-none tracking-tight"
                    style={{ background: "linear-gradient(180deg, #ffffff 0%, #fde68a 40%, #f59e0b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    FINAL
                  </div>
                </div>

                {/* teams */}
                <div className="w-full flex items-center justify-around mt-1">
                  <div className="text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-700 grid place-items-center border-2 border-white/30 shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                      <span className="text-white font-black text-sm">GTH</span>
                    </div>
                    <div className="text-white/70 text-[8px] mt-1 tracking-widest">HOME</div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-white/40 text-[8px] tracking-widest">VS</div>
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/50 grid place-items-center">
                      <span className="text-amber-300 text-lg">{"\u26BD"}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-rose-500 to-red-700 grid place-items-center border-2 border-white/30 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                      <span className="text-white font-black text-sm">WRP</span>
                    </div>
                    <div className="text-white/70 text-[8px] mt-1 tracking-widest">AWAY</div>
                  </div>
                </div>

                {/* date + venue */}
                <div className="w-full rounded-lg px-3 py-2 flex items-center justify-around"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="text-center">
                    <div className="text-purple-300/60 text-[7px] tracking-widest">DATE</div>
                    <div className="text-white text-[11px] font-black">JUL 19, 2026</div>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <div className="text-purple-300/60 text-[7px] tracking-widest">KICK-OFF</div>
                    <div className="text-white text-[11px] font-black">20:00 UTC</div>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <div className="text-purple-300/60 text-[7px] tracking-widest">VENUE</div>
                    <div className="text-white text-[11px] font-black">METLIFE</div>
                  </div>
                </div>

                {/* ticker */}
                <div className="w-full overflow-hidden rounded bg-black/50 border-y border-amber-500/40">
                  <div className="ticker-track py-1 text-amber-300 text-[9px] tracking-widest font-mono">
                    <span className="ticker-segment">FINAL · 19/07 · GTH vs WRP · METLIFE STADIUM · GET YOUR TICKETS NOW · </span>
                    <span className="ticker-segment" aria-hidden="true">FINAL · 19/07 · GTH vs WRP · METLIFE STADIUM · GET YOUR TICKETS NOW · </span>
                  </div>
                </div>
              </div>
            </div>

            {/* LED bottom strip */}
            <div className="flex gap-[3px] px-2 pb-2 pt-1 justify-center">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full animate-blink"
                  style={{ background: i % 3 === 0 ? "#ef4444" : i % 3 === 1 ? "#facc15" : "#a855f7", animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>

          </div>{/* end billboard frame */}

        </div>
      </div>

      {/* ====== CENTER: card ====== */}
      <div data-wc-center-card className="absolute inset-0 z-20 flex items-center justify-center px-4 pointer-events-none">
        <div className="w-[440px] max-w-[90vw] rounded-3xl bg-[#161029]/85 backdrop-blur-xl border border-purple-400/20 shadow-[0_30px_80px_-20px_rgba(168,85,247,0.5)] p-7 pointer-events-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 grid place-items-center text-white font-black text-2xl shadow-lg">
              {"\u{1F3C6}"}
            </div>
            <div>
              <div className="text-purple-300/70 text-[10px] tracking-[0.35em] font-semibold">THE FINAL</div>
              <div className="text-white text-2xl font-bold">Match Day</div>
            </div>
          </div>

          <p className="mt-5 text-white/80 text-sm leading-relaxed">
            One game. One trophy. <span className="text-amber-400 font-bold">Purple Paws FC</span> step onto the grandest stage to claim the cup of all cups.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-purple-300/60 text-[9px] tracking-[0.3em]">DATE</div>
              <div className="text-white text-xl font-black mt-1">JUL 19</div>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-purple-300/60 text-[9px] tracking-[0.3em]">KICK-OFF</div>
              <div className="text-amber-400 text-xl font-black mt-1">20:00</div>
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-gradient-to-r from-purple-600/30 to-fuchsia-600/30 border border-purple-400/30 p-3">
            <div className="text-purple-200/70 text-[9px] tracking-[0.3em]">VENUE</div>
            <div className="text-white text-lg font-bold mt-1">MetLife Stadium · NJ</div>
            <div className="text-purple-300/60 text-[10px] mt-1">Capacity 82,500 · Final 2026</div>
          </div>

          <div className="mt-3 flex items-center justify-around text-center">
            <div>
              <div className="text-purple-300/60 text-[9px] tracking-[0.3em]">HOME</div>
              <div className="text-white font-black mt-1">GTH</div>
            </div>
            <div className="text-amber-400 font-black text-2xl">VS</div>
            <div>
              <div className="text-purple-300/60 text-[9px] tracking-[0.3em]">AWAY</div>
              <div className="text-white font-black mt-1">WRP</div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-purple-950 rounded-full px-3 py-1 text-[10px] font-black tracking-widest">
              <span>04</span><span>·</span><span>FINAL</span>
            </div>
            <div className="text-purple-300/60 text-[10px] tracking-[0.3em]">MATCH · DAY</div>
          </div>
        </div>
      </div>

      {/* footer */}

      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.15} 50%{opacity:1} }
        .animate-twinkle { animation: twinkle 2.5s ease-in-out infinite; }
        @keyframes confetti-fall { 0%{transform:translateY(-10vh) rotate(0)} 100%{transform:translateY(110vh) rotate(720deg)} }
        .animate-confetti-fall { animation: confetti-fall linear infinite; }
        @keyframes spot-sway { 0%,100%{transform:rotate(-6deg)} 50%{transform:rotate(6deg)} }
        .animate-spot-sway { animation: spot-sway 7s ease-in-out infinite; transform-origin: 50% 0%; }
        @keyframes glow-pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
        @keyframes trophy-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .animate-trophy-float { animation: trophy-float 4s ease-in-out infinite; }
        @keyframes screen-flicker { 0%,97%,100%{opacity:0} 98%{opacity:.08} 99%{opacity:0} }
        .animate-screen-flicker { animation: screen-flicker 6s linear infinite; background:#fff; }
        @keyframes title-glow { 0%,100%{filter:drop-shadow(0 0 6px rgba(250,204,21,0.4))} 50%{filter:drop-shadow(0 0 18px rgba(250,204,21,0.85))} }
        .animate-title-glow { animation: title-glow 2.6s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.2} }
        .animate-blink { animation: blink 1s ease-in-out infinite; }
        @keyframes ticker-loop { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .ticker-track {
          display: inline-flex;
          width: max-content;
          min-width: 200%;
          white-space: nowrap;
          animation: ticker-loop 18s linear infinite;
        }
        .ticker-segment {
          flex: 0 0 auto;
          padding-right: 2rem;
        }
      `}</style>
    </div>
  );
}

function CountBox({ v, l }: { v: number; l: string }) {
  const s = String(v).padStart(2, "0");
  return (
    <div className="relative rounded-md bg-gradient-to-b from-[#1c0f3a] to-[#0a0420] border border-amber-500/40 p-1.5 text-center overflow-hidden">
      <div className="absolute inset-x-0 top-1/2 h-px bg-black/60" />
      <div className="text-amber-300 font-black text-2xl leading-none font-mono tabular-nums">{s}</div>
      <div className="text-purple-300/70 text-[8px] tracking-[0.3em] mt-1">{l}</div>
    </div>
  );
}

function TrophySVG() {
  return (
    <svg viewBox="0 0 200 300" className="w-full h-auto drop-shadow-[0_20px_40px_rgba(250,204,21,0.5)]">
      <defs>
        <linearGradient id="tg1" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="25%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#fef3c7" />
          <stop offset="75%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id="tg2" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="60%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <radialGradient id="tglow" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
        </radialGradient>
        <filter id="tshine">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* glow aura */}
      <ellipse cx="100" cy="160" rx="80" ry="100" fill="url(#tglow)" opacity="0.5" />
      {/* base plate */}
      <rect x="52" y="276" width="96" height="12" rx="3" fill="url(#tg1)" />
      <rect x="60" y="268" width="80" height="10" rx="2" fill="url(#tg2)" />
      {/* stem column */}
      <rect x="82" y="220" width="36" height="50" rx="4" fill="url(#tg2)" />
      <rect x="90" y="220" width="8" height="50" fill="#fef3c7" opacity="0.25" />
      {/* middle knob */}
      <ellipse cx="100" cy="220" rx="28" ry="10" fill="url(#tg1)" />
      <ellipse cx="100" cy="218" rx="26" ry="9" fill="url(#tg2)" />
      {/* cup body */}
      <path d="M60 80 Q 56 140 68 200 L 132 200 Q 144 140 140 80 Z" fill="url(#tg1)" />
      <path d="M64 84 Q 60 140 72 196 L 128 196 Q 136 140 136 84 Z" fill="url(#tg2)" />
      {/* interior shine */}
      <path d="M72 88 Q 70 130 78 190 L 90 190 Q 84 130 84 88 Z" fill="#fef3c7" opacity="0.3" />
      {/* handles */}
      <path d="M60 100 Q 30 120 32 160 Q 34 195 58 190" stroke="url(#tg1)" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M60 100 Q 34 120 36 160 Q 38 192 62 188" stroke="url(#tg2)" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M140 100 Q 170 120 168 160 Q 166 195 142 190" stroke="url(#tg1)" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M140 100 Q 166 120 164 160 Q 162 192 138 188" stroke="url(#tg2)" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* rim */}
      <ellipse cx="100" cy="82" rx="42" ry="12" fill="url(#tg1)" />
      <ellipse cx="100" cy="80" rx="40" ry="10" fill="url(#tg2)" />
      <ellipse cx="100" cy="78" rx="36" ry="7" fill="#fef3c7" opacity="0.3" />
      {/* star on cup */}
      <text x="100" y="158" textAnchor="middle" fontSize="28" fill="#fef3c7" opacity="0.5" filter="url(#tshine)">{"\u2605"}</text>
      {/* specular */}
      <ellipse cx="82" cy="110" rx="10" ry="18" fill="#fff" opacity="0.18" transform="rotate(-15,82,110)" />
    </svg>
  );
}

export default Slide4;


