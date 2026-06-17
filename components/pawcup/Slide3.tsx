"use client";

import { useMemo } from "react";
import stadium from "@/components/pawcup/assets/stadium.asset.json";
import catMascot from "@/components/pawcup/assets/cat-mascot.asset.json";

function Slide3() {
  const stars = useMemo(
    () => Array.from({ length: 40 }).map(() => ({ x: Math.random() * 100, y: Math.random() * 100, d: Math.random() * 3, s: 1 + Math.random() * 2 })),
    [],
  );
  const sparks = useMemo(
    () => Array.from({ length: 18 }).map(() => ({ x: 5 + Math.random() * 90, y: 5 + Math.random() * 90, d: Math.random() * 4, s: 1 + Math.random() * 2 })),
    [],
  );

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
            <img src="/cat-coach.png" alt="Coach cat" className="w-full h-auto block drop-shadow-[0_25px_30px_rgba(0,0,0,0.7)]" />
          </div>

          {/* Cat captain listening · same mascot as homepage */}
          <div className="absolute right-[2%] bottom-[4%] w-[44%] origin-bottom">
            <img
              src={catMascot.url}
              alt="Cat captain listening"
              className="w-full h-auto block drop-shadow-[0_20px_25px_rgba(0,0,0,0.7)] scale-x-[-1]"
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

function CoachCat() {
  return (
    <svg viewBox="0 0 240 400" className="w-full h-auto drop-shadow-[0_25px_30px_rgba(0,0,0,0.7)]">
      <defs>
        <radialGradient id="gFur" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#d0d0d0" />
          <stop offset="55%" stopColor="#909090" />
          <stop offset="100%" stopColor="#555555" />
        </radialGradient>
        <radialGradient id="gFurDark" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#a0a0a0" />
          <stop offset="100%" stopColor="#404040" />
        </radialGradient>
        <radialGradient id="gMuzzle" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f0eded" />
          <stop offset="100%" stopColor="#d8d0d0" />
        </radialGradient>
        <linearGradient id="gJacket" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#080808" />
        </linearGradient>
        <linearGradient id="gClip" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f0c050" />
          <stop offset="100%" stopColor="#c08010" />
        </linearGradient>
      </defs>

      {/* shadow */}
      <ellipse cx="116" cy="395" rx="76" ry="6" fill="#000" opacity="0.35" />

      {/* tail */}
      <path d="M168 318 Q 210 275 214 232 Q 217 208 202 203" stroke="#3a3a3a" strokeWidth="20" fill="none" strokeLinecap="round" />
      <path d="M168 318 Q 210 275 214 232 Q 217 208 202 203" stroke="#888" strokeWidth="12" fill="none" strokeLinecap="round" />

      {/* legs */}
      <path d="M84 338 Q 76 363 72 380 Q 82 386 98 380 Q 102 360 100 336 Z" fill="url(#gFur)" />
      <path d="M148 338 Q 156 363 160 380 Q 146 386 132 380 Q 130 358 134 336 Z" fill="url(#gFur)" />
      <ellipse cx="85"  cy="380" rx="17" ry="7" fill="#444" />
      <ellipse cx="146" cy="380" rx="17" ry="7" fill="#444" />

      {/* body */}
      <ellipse cx="116" cy="284" rx="62" ry="60" fill="url(#gFur)" />
      {/* belly patch */}
      <ellipse cx="116" cy="296" rx="30" ry="35" fill="url(#gMuzzle)" opacity="0.6" />

      {/* jacket (black) */}
      <path d="M62 260 Q 116 236 170 260 L 167 334 Q 116 350 65 334 Z" fill="url(#gJacket)" />
      {/* lapels */}
      <path d="M116 238 L 100 258 L 116 254 L 132 258 Z" fill="#222" />
      {/* collar white shirt */}
      <path d="M108 240 Q 116 248 124 240 L 122 252 Q 116 256 110 252 Z" fill="#e8e8e8" />
      {/* jacket buttons */}
      <circle cx="116" cy="272" r="2.5" fill="#333" stroke="#666" strokeWidth="0.5" />
      <circle cx="116" cy="284" r="2.5" fill="#333" stroke="#666" strokeWidth="0.5" />
      <circle cx="116" cy="296" r="2.5" fill="#333" stroke="#666" strokeWidth="0.5" />

      {/* left arm · hanging down */}
      <path d="M66 270 Q 56 300 58 336 Q 68 340 80 335 Q 82 300 86 270 Z" fill="url(#gJacket)" />
      <ellipse cx="69" cy="336" rx="13" ry="7" fill="url(#gFur)" />
      {/* right arm · hanging down, slightly forward holding clipboard low */}
      <path d="M146 270 Q 156 300 158 336 Q 146 340 134 335 Q 132 300 136 270 Z" fill="url(#gJacket)" />
      <ellipse cx="148" cy="336" rx="13" ry="7" fill="url(#gFur)" />

      {/* clipboard · held low at side */}
      <rect x="152" y="296" width="44" height="56" rx="4" fill="url(#gClip)" />
      <rect x="165" y="291" width="16" height="8" rx="2.5" fill="#888" />
      <rect x="157" y="308" width="34" height="2" rx="1" fill="#fff" opacity="0.75" />
      <rect x="157" y="314" width="28" height="2" rx="1" fill="#fff" opacity="0.6"  />
      <rect x="157" y="320" width="32" height="2" rx="1" fill="#fff" opacity="0.6"  />
      <rect x="157" y="326" width="24" height="2" rx="1" fill="#fff" opacity="0.5"  />
      <rect x="157" y="336" width="34" height="10" rx="2" fill="#15803d" opacity="0.8" />
      <line x1="174" y1="336" x2="174" y2="346" stroke="#fff" strokeWidth="0.8" opacity="0.7" />

      {/* -- HEAD -- */}
      {/* ears */}
      <polygon points="74,134 86,86  112,136" fill="url(#gFur)" />
      <polygon points="120,136 146,86 158,134" fill="url(#gFur)" />
      <polygon points="81,128 90,102 106,130" fill="#e8a0a8" opacity="0.7" />
      <polygon points="126,130 144,102 153,128" fill="#e8a0a8" opacity="0.7" />

      {/* head */}
      <ellipse cx="116" cy="170" rx="64" ry="60" fill="url(#gFur)" />

      {/* muzzle */}
      <ellipse cx="116" cy="192" rx="25" ry="17" fill="url(#gMuzzle)" opacity="0.8" />

      {/* eyes */}
      <ellipse cx="96"  cy="163" rx="15" ry="11" fill="#fff" />
      <ellipse cx="136" cy="163" rx="15" ry="11" fill="#fff" />
      <ellipse cx="96"  cy="164" rx="9"  ry="10" fill="#4a7a30" />
      <ellipse cx="136" cy="164" rx="9"  ry="10" fill="#4a7a30" />
      <ellipse cx="96"  cy="165" rx="3"  ry="9"  fill="#111" />
      <ellipse cx="136" cy="165" rx="3"  ry="9"  fill="#111" />
      <ellipse cx="91"  cy="158" rx="3"  ry="2"  fill="#fff" opacity="0.9" />
      <ellipse cx="131" cy="158" rx="3"  ry="2"  fill="#fff" opacity="0.9" />
      {/* eyelid */}
      <path d="M81 158 Q 96 150 111 158" stroke="#555" strokeWidth="1.8" fill="none" />
      <path d="M121 158 Q 136 150 151 158" stroke="#555" strokeWidth="1.8" fill="none" />

      {/* nose */}
      <path d="M110 191 Q 116 188 122 191 L 119 198 Q 116 200 113 198 Z" fill="#d46090" />
      <line x1="116" y1="198" x2="116" y2="203" stroke="#a03060" strokeWidth="1.2" />
      <path d="M116 203 Q 108 210 102 207" stroke="#7a2040" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M116 203 Q 124 210 130 207" stroke="#7a2040" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* whiskers */}
      <line x1="90"  y1="194" x2="52"  y2="187" stroke="#ccc" strokeWidth="1.2" opacity="0.7" />
      <line x1="90"  y1="200" x2="52"  y2="206" stroke="#ccc" strokeWidth="1.2" opacity="0.7" />
      <line x1="90"  y1="206" x2="56"  y2="216" stroke="#ccc" strokeWidth="1"   opacity="0.5" />
      <line x1="142" y1="194" x2="180" y2="187" stroke="#ccc" strokeWidth="1.2" opacity="0.7" />
      <line x1="142" y1="200" x2="180" y2="206" stroke="#ccc" strokeWidth="1.2" opacity="0.7" />
      <line x1="142" y1="206" x2="176" y2="216" stroke="#ccc" strokeWidth="1"   opacity="0.5" />

      {/* coach cap · black */}
      <path d="M64 136 Q 116 114 168 136 L 166 154 Q 116 158 66 154 Z" fill="#111" />
      <path d="M62 134 Q 116 112 170 134 L 168 144 Q 116 148 64 144 Z" fill="#222" />
      <path d="M44 144 Q 64 136 66 148 L 44 152 Z" fill="#0a0a0a" />
      <circle cx="116" cy="116" r="4" fill="#444" />
      {/* cap badge */}
      <rect x="104" y="135" width="24" height="14" rx="3" fill="#a855f7" />
      <text x="116" y="146" textAnchor="middle" fontSize="8" fontWeight="900" fill="#fde68a" fontFamily="Arial">FC</text>
    </svg>
  );
}

export default Slide3;




