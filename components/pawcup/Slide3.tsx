"use client";

import Image from "next/image";
import { useState } from "react";
import stadium from "@/components/pawcup/assets/stadium.asset.json";
import catMascot from "@/components/pawcup/assets/cat-mascot.asset.json";

function Slide3() {
  const [stars] = useState(() => Array.from({ length: 40 }).map(() => ({ x: Math.random() * 100, y: Math.random() * 100, d: Math.random() * 3, s: 1 + Math.random() * 2 })));
  const [sparks] = useState(() => Array.from({ length: 18 }).map(() => ({ x: 5 + Math.random() * 90, y: 5 + Math.random() * 90, d: Math.random() * 4, s: 1 + Math.random() * 2 })));

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-[#0b0418]"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(11,4,24,0.85), rgba(11,4,24,0.95)), url(${stadium.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* purple ambient blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-fuchsia-600/20 blur-3xl" />

      {/* stars */}
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }}
        />
      ))}

      {/* TOP HEADER */}

      {/* ====== LEFT: Coach talking with cat ====== */}
      <div className="absolute left-0 top-0 bottom-0 w-[30%] z-10">
        <div className="relative w-full h-full">
          {/* floor glow */}
          

          {/* caption */}

          {/* Coach cat */}
          <div className="absolute left-[-2%] bottom-[4%] w-[56%] origin-bottom">
            <Image src="/cat-coach.png" alt="Coach cat" width={1024} height={1024} className="w-full h-auto block drop-shadow-[0_25px_30px_rgba(0,0,0,0.7)]" unoptimized />
          </div>

          {/* Cat captain listening · same mascot as homepage */}
          <div className="absolute right-[2%] bottom-[4%] w-[44%] origin-bottom">
            <Image
              src={catMascot.url}
              alt="Cat captain listening"
              width={1024}
              height={1024}
              className="w-full h-auto block drop-shadow-[0_20px_25px_rgba(0,0,0,0.7)] scale-x-[-1]"
              unoptimized
            />
          </div>

          {/* floor shadows */}
          <div className="absolute left-[4%] bottom-[2%] w-[48%] h-5 rounded-[50%] bg-black/60 blur-md" />
          <div className="absolute right-[4%] bottom-[2%] w-[36%] h-4 rounded-[50%] bg-black/60 blur-md" />
        </div>
      </div>

      {/* ====== RIGHT: Holographic tactics board ====== */}
      <div className="absolute right-0 top-0 bottom-0 w-[28%] z-10 pointer-events-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* sparks around hologram */}
          {sparks.map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-fuchsia-300 animate-twinkle"
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }}
            />
          ))}

          <HoloPitch />

          {/* base / emitter */}
          <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[55%] h-3 rounded-full bg-fuchsia-500/40 blur-md" />
          <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[45%] h-2 rounded-full bg-purple-400/70 shadow-[0_0_30px_rgba(217,70,239,0.8)]" />
        </div>
      </div>

      {/* ====== CENTER: Strategy card ====== */}
      <div data-wc-center-card className="absolute inset-0 z-20 flex items-center justify-center px-4">
        <div className="w-[440px] max-w-[90vw] rounded-3xl bg-[#161029]/85 backdrop-blur-xl border border-purple-400/20 shadow-[0_30px_80px_-20px_rgba(168,85,247,0.5)] p-7">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 grid place-items-center text-white text-2xl shadow-lg">
              {"\u{1F4CB}"}
            </div>
            <div>
              <div className="text-purple-300/70 text-[10px] tracking-[0.35em] font-semibold">GAME PLAN</div>
              <div className="text-white text-2xl font-bold">Tactics Talk</div>
            </div>
          </div>

          <p className="mt-5 text-white/80 text-sm leading-relaxed">
            Coach Whiskers reveals the matchday playbook · High press, quick switches and a left-wing overload to free the captain in the box.
          </p>

          <div className="mt-5">
            <div className="text-purple-300/70 text-[10px] tracking-[0.35em] mb-3">KEY INSTRUCTIONS</div>
            <Instruction n="01" label="High press from minute 1" color="from-cyan-400 to-sky-500" />
            <Instruction n="02" label="Overload the left flank" color="from-fuchsia-500 to-purple-500" />
            <Instruction n="03" label="Cutback to captain @WM" color="from-amber-400 to-orange-500" />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <Stat label="FORMATION" value="4-3-3" accent="text-purple-300" />
            <Stat label="TEMPO" value="HIGH" accent="text-fuchsia-300" />
            <Stat label="MOOD" value={"\u{1F525}\u{1F525}\u{1F525}"} accent="text-amber-300" />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-purple-950 rounded-full px-3 py-1 text-[10px] font-black tracking-widest">
              <span>03</span><span>·</span><span>TACTICS</span>
            </div>
            <div className="text-purple-300/60 text-[10px] tracking-[0.3em]">TEAM · TALK</div>
          </div>
        </div>
      </div>

      {/* footer */}

      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.15} 50%{opacity:1} }
        .animate-twinkle { animation: twinkle 2.5s ease-in-out infinite; }
        @keyframes bubble {
          0%,100% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-4px) scale(1.03); opacity: .95; }
        }
        .animate-bubble { animation: bubble 3s ease-in-out infinite; }
        .animate-bubble-2 { animation: bubble 3s ease-in-out infinite; animation-delay: 1.2s; }
        @keyframes holo-flicker {
          0%,100% { opacity: 0.9; filter: drop-shadow(0 0 10px rgba(217,70,239,0.6)); }
          50% { opacity: 1; filter: drop-shadow(0 0 24px rgba(217,70,239,0.95)); }
        }
        .animate-holo { animation: holo-flicker 2.6s ease-in-out infinite; }
        @keyframes holo-rise {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-holo-rise { animation: holo-rise 4s ease-in-out infinite; }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan { animation: scan 4s linear infinite; }
        @keyframes dash-flow {
          to { stroke-dashoffset: -40; }
        }
        .flow { stroke-dasharray: 6 4; animation: dash-flow 1.6s linear infinite; }
      `}</style>
    </div>
  );
}

function Instruction({ n, label, color }: { n: string; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${color} grid place-items-center text-white text-[10px] font-black`}>
        {n}
      </div>
      <div className="text-white/85 text-sm">{label}</div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-2 text-center">
      <div className="text-purple-300/60 text-[9px] tracking-[0.25em]">{label}</div>
      <div className={`${accent} text-lg font-black mt-0.5`}>{value}</div>
    </div>
  );
}

function HoloPitch() {
  return (
    <div className="relative w-[68%] aspect-[3/5] animate-holo-rise">
      <div className="absolute inset-0 rounded-2xl border-2 border-fuchsia-400/60 bg-gradient-to-b from-purple-900/40 via-fuchsia-900/30 to-purple-900/40 backdrop-blur-sm overflow-hidden animate-holo shadow-[0_0_60px_rgba(217,70,239,0.5)_inset]">
        {/* scanline */}
        <div className="absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-fuchsia-300/20 to-transparent animate-scan" />

        {/* pitch (vertical) */}
        <svg viewBox="0 0 200 340" className="absolute inset-0 w-full h-full p-3">
          <defs>
            <linearGradient id="pitchGlow" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#d946ef" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.9" />
            </linearGradient>
            <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="#f0abfc" />
            </marker>
          </defs>

          {/* pitch outline */}
          <rect x="6" y="6" width="188" height="328" fill="none" stroke="url(#pitchGlow)" strokeWidth="2" rx="6" />
          <line x1="6" y1="170" x2="194" y2="170" stroke="#d946ef" strokeWidth="1.2" opacity="0.7" />
          <circle cx="100" cy="170" r="28" fill="none" stroke="#d946ef" strokeWidth="1.2" opacity="0.7" />
          <circle cx="100" cy="170" r="2.5" fill="#f0abfc" />
          {/* boxes */}
          <rect x="50" y="6" width="100" height="38" fill="none" stroke="#d946ef" strokeWidth="1.2" opacity="0.7" />
          <rect x="78" y="6" width="44" height="16" fill="none" stroke="#d946ef" strokeWidth="1.2" opacity="0.7" />
          <rect x="50" y="296" width="100" height="38" fill="none" stroke="#d946ef" strokeWidth="1.2" opacity="0.7" />
          <rect x="78" y="318" width="44" height="16" fill="none" stroke="#d946ef" strokeWidth="1.2" opacity="0.7" />

          {/* players (defense bottom -> attack top) */}
          {[
            [100, 310],
            [30, 255], [75, 260], [125, 260], [170, 255],
            [55, 200], [100, 215], [145, 200],
            [40, 110], [100, 95], [160, 110],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="8" fill="#fde68a" stroke="#7c3aed" strokeWidth="1.5" />
              <circle cx={x} cy={y} r="3" fill="#7c3aed" />
            </g>
          ))}

          {/* opponents */}
          {[[60, 60], [140, 60], [100, 40]].map(([x, y], i) => (
            <g key={`o${i}`}>
              <text x={x - 5} y={y + 4} fill="#f87171" fontSize="14" fontWeight="900">X</text>
            </g>
          ))}

          {/* tactic arrows (flowing dashes) */}
          <path d="M100 215 Q 80 160 60 110" stroke="#f0abfc" strokeWidth="2" fill="none" markerEnd="url(#ah)" className="flow" />
          <path d="M55 200 Q 30 150 40 110" stroke="#67e8f9" strokeWidth="2" fill="none" markerEnd="url(#ah)" className="flow" />
          <path d="M40 110 Q 70 80 100 60" stroke="#fde68a" strokeWidth="2" fill="none" markerEnd="url(#ah)" className="flow" />
          <path d="M145 200 Q 160 150 160 110" stroke="#67e8f9" strokeWidth="2" fill="none" markerEnd="url(#ah)" className="flow" />
          <path d="M160 110 Q 130 80 100 60" stroke="#fde68a" strokeWidth="2" fill="none" markerEnd="url(#ah)" className="flow" />

          {/* ball path */}
          <circle cx="100" cy="215" r="3" fill="#fff" />
        </svg>

        {/* corner hud labels */}
        <div className="absolute top-1 left-2 text-fuchsia-200/80 text-[9px] tracking-[0.3em] font-mono">PLAY · 4-3-3</div>
        <div className="absolute top-1 right-2 text-fuchsia-200/80 text-[9px] tracking-[0.3em] font-mono">v2.6</div>
        <div className="absolute bottom-1 left-2 text-fuchsia-200/80 text-[9px] tracking-[0.3em] font-mono">LEFT · OVERLOAD</div>
        <div className="absolute bottom-1 right-2 text-fuchsia-200/80 text-[9px] tracking-[0.3em] font-mono">●REC</div>
      </div>
    </div>
  );
}

export default Slide3;



