"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import stadium from "@/components/pawcup/assets/stadium.asset.json";
import commentators from "@/components/pawcup/assets/commentators.png.asset.json";

// Deterministic pseudo-random so SSR and client agree (no hydration mismatch)
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

const rand = seeded(424242);
const STARS = Array.from({ length: 40 }).map(() => ({
  x: rand() * 100,
  y: rand() * 100,
  d: rand() * 3,
  s: 1 + rand() * 2,
}));

function Slide6() {
  // animate the clock client-side only to avoid SSR mismatch
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(i);
  }, []);
  const minute = 67 + Math.floor(tick / 10);
  const second = tick % 60;

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
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s, animationDelay: `${st.d}s` }}
        />
      ))}

      {/* HEADER */}

      {/* ====== LEFT: live match on pitch ====== */}
      <div className="absolute left-[3%] top-[16%] bottom-[7%] w-[27%] z-10 pointer-events-none">
        {/* pitch */}
        <div className="absolute inset-4 rounded-2xl overflow-hidden border-2 border-emerald-700/60 shadow-[0_20px_60px_rgba(34,197,94,0.25)]"
             style={{ background: "repeating-linear-gradient(90deg, #166534 0 40px, #15803d 40px 80px)" }}>
          {/* pitch markings + goals */}
          <svg viewBox="0 0 300 700" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <rect x="6" y="6" width="288" height="688" fill="none" stroke="#fff" strokeWidth="2" opacity="0.85" />
            <line x1="6" y1="350" x2="294" y2="350" stroke="#fff" strokeWidth="2" opacity="0.85" />
            <circle cx="150" cy="350" r="48" fill="none" stroke="#fff" strokeWidth="2" opacity="0.85" />
            <circle cx="150" cy="350" r="3" fill="#fff" />
            {/* top penalty box */}
            <rect x="70" y="6" width="160" height="60" fill="none" stroke="#fff" strokeWidth="2" opacity="0.85" />
            <rect x="110" y="6" width="80" height="22" fill="none" stroke="#fff" strokeWidth="2" opacity="0.85" />
            {/* bottom penalty box */}
            <rect x="70" y="634" width="160" height="60" fill="none" stroke="#fff" strokeWidth="2" opacity="0.85" />
            <rect x="110" y="672" width="80" height="22" fill="none" stroke="#fff" strokeWidth="2" opacity="0.85" />
            {/* top goal */}
            <rect x="115" y="0" width="70" height="8" fill="rgba(255,255,255,0.18)" stroke="#fff" strokeWidth="2" opacity="0.95" />
            {/* bottom goal */}
            <rect x="115" y="692" width="70" height="8" fill="rgba(255,255,255,0.18)" stroke="#fff" strokeWidth="2" opacity="0.95" />
          </svg>

          {/* white-kit cat team (Purple Paws · wearing white) */}
          <Player x={50} y={88} kit="white" num={1} />
          <Player x={22} y={70} kit="white" num={4} />
          <Player x={50} y={65} kit="white" num={6} />
          <Player x={78} y={70} kit="white" num={3} />
          <Player x={30} y={50} kit="white" num={10} />
          <Player x={70} y={48} kit="white" num={7} />

          {/* opposing team · purple/fuchsia kit */}
          <Player x={50} y={12} kit="opp" num={1} />
          <Player x={25} y={28} kit="opp" num={2} />
          <Player x={75} y={28} kit="opp" num={5} />
          <Player x={45} y={40} kit="opp" num={9} delay="0.6s" />
          <Player x={60} y={42} kit="opp" num={8} delay="0.3s" />

          {/* ball racing toward goal */}
          <div className="absolute animate-ball-run" style={{ left: "55%", top: "45%" }}>
            <div className="w-3 h-3 rounded-full bg-white border border-black shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
          </div>

          {/* action sparkle */}
          <div className="absolute left-[52%] top-[12%] text-yellow-300 text-xs font-black animate-action-pop">
            SHOT!
          </div>

          {/* corner ribbon */}
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur text-white text-[10px] tracking-[0.3em] font-mono px-2 py-1 rounded">
            CAM · 02
          </div>
        </div>

        {/* scoreboard · vertical sidebar on right edge */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20">
          <div className="flex flex-col items-center gap-1.5 bg-black/80 backdrop-blur border border-amber-400/40 border-r-0 rounded-l-xl px-2 py-3 text-white shadow-[0_0_20px_rgba(251,191,36,0.2)]">
            <div className="flex flex-col items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-white border border-black/40" />
              <span className="font-black text-[11px]">GTH</span>
            </div>
            <div className="font-black text-xl font-mono text-amber-400 tabular-nums">2</div>
            <div className="w-4 h-px bg-amber-400/60" />
            <div className="font-black text-xl font-mono text-amber-400 tabular-nums">1</div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-black text-[11px]">WRP</span>
              <span className="w-3 h-3 rounded-sm bg-gradient-to-br from-fuchsia-500 to-purple-700" />
            </div>
            <div className="mt-1 text-amber-300 text-[8px] font-mono tabular-nums" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
              {mounted ? `${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}` : "67:00"}
            </div>
          </div>
        </div>
      </div>

      {/* ====== RIGHT: TV broadcasting commentary ====== */}
      <div className="absolute right-0 top-0 bottom-0 w-[30%] z-10 flex items-center justify-center pt-10">
        <div className="relative w-[75%]">
          {/* TV outer housing */}
          <div className="relative rounded-2xl bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-500 p-[10px] shadow-[0_20px_60px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.5)]"
               style={{ border: "2px solid #6b7280" }}>
            {/* power LED */}
            <div className="absolute top-2 right-4 w-2 h-2 rounded-full bg-green-400 animate-blink shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
            {/* brand */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-zinc-600 text-[7px] font-black tracking-[0.3em]">PAW·VISION</div>
            {/* color accent strip */}
            <div className="absolute top-0 left-6 right-6 h-1 rounded-full bg-gradient-to-r from-purple-500 via-amber-400 to-purple-500 opacity-80" />

            {/* inner bezel */}
            <div className="rounded-xl bg-black p-[5px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
              {/* screen */}
              <div className="relative rounded-lg overflow-hidden bg-gradient-to-b from-[#1a0f3a] via-[#160a30] to-[#0a0420] border border-purple-400/20 aspect-[5/6]">
                {/* scanlines */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.04)_0,rgba(255,255,255,0.04)_1px,transparent_1px,transparent_4px)] pointer-events-none z-10" />
                {/* studio backlight */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(168,85,247,0.45),transparent_60%)]" />
                {/* flicker */}
                <div className="absolute inset-0 bg-white/0 animate-screen-flicker pointer-events-none z-10" />

                {/* tiny back wall monitors */}
                <div className="absolute top-4 left-4 w-10 h-6 rounded-sm bg-emerald-400/30 border border-emerald-300/50 animate-screen-flicker" />
                <div className="absolute top-4 right-4 w-10 h-6 rounded-sm bg-amber-400/30 border border-amber-300/50 animate-screen-flicker" />

                {/* commentators */}
                <Image
                  src={commentators.url}
                  alt="Two cat commentators with headsets"
                  width={1024}
                  height={1024}
                  className="absolute bottom-[14%] left-1/2 -translate-x-1/2 w-[92%] drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
                  loading="lazy"
                  unoptimized
                />
                {/* studio desk */}
                <div className="absolute bottom-0 left-0 right-0 h-[16%] z-20" style={{
                  background: "linear-gradient(180deg, #2d1b69 0%, #1a0f3a 100%)",
                  borderTop: "1.5px solid rgba(168,85,247,0.6)",
                  boxShadow: "inset 0 2px 12px rgba(168,85,247,0.15)",
                }}>
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />
                  {/* desk logo */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-300/50 text-[8px] tracking-[0.4em] font-black">PAW·VISION</div>
                </div>
                {/* commentator name banners */}
                <div className="absolute bottom-[15%] left-[4%] z-20 flex flex-col" style={{ borderLeft: "2px solid #a855f7" }}>
                  <div className="bg-purple-900/95 px-1.5 py-0.5">
                    <div className="text-purple-300 text-[5.5px] tracking-[0.3em] font-semibold">ANALYST</div>
                    <div className="text-white text-[7px] font-black leading-tight">Whisker McPaws</div>
                  </div>
                </div>
                <div className="absolute bottom-[15%] right-[4%] z-20 flex flex-col items-end" style={{ borderRight: "2px solid #f59e0b" }}>
                  <div className="bg-amber-900/95 px-1.5 py-0.5 text-right">
                    <div className="text-amber-300 text-[5.5px] tracking-[0.3em] font-semibold">COMMENTATOR</div>
                    <div className="text-white text-[7px] font-black leading-tight">Furball Jones</div>
                  </div>
                </div>
                <div className="absolute bottom-[5%] left-[8%] right-[8%] h-2 rounded-[50%] bg-black/60 blur-md" />

                {/* glass reflections */}
                <div className="pointer-events-none absolute inset-0 z-20">
                  <div className="absolute -top-6 -left-10 w-[60%] h-20 bg-white/8 blur-2xl rotate-[18deg]" />
                </div>

                {/* ON AIR */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-red-600 text-white text-[9px] font-black tracking-[0.3em] px-2 py-1 rounded shadow-lg z-20">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-blink" />
                  ON AIR
                </div>

                <div className="absolute top-[28%] left-2 bg-white text-purple-900 text-[9px] font-bold px-2 py-1 rounded-lg shadow-lg animate-bubble z-20">
                  &quot;What a strike!&quot;
                  <span className="absolute -bottom-1 left-4 w-2 h-2 bg-white rotate-45" />
                </div>
                <div className="absolute top-[24%] right-2 bg-amber-300 text-purple-950 text-[9px] font-bold px-2 py-1 rounded-lg shadow-lg animate-bubble-2 z-20">
                  &quot;Unbelievable!&quot;
                  <span className="absolute -bottom-1 right-4 w-2 h-2 bg-amber-300 rotate-45" />
                </div>

                {/* channel ticker */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 border-t border-amber-500/30 py-1 z-20 overflow-hidden">
                  <div className="ticker-track text-amber-300 text-[8px] tracking-widest font-mono">
                    <span className="ticker-segment">CH26 · LIVE · GTH 2-1 WRP · 67&apos; · CAT FC BROADCASTS · </span>
                    <span className="ticker-segment" aria-hidden="true">CH26 · LIVE · GTH 2-1 WRP · 67&apos; · CAT FC BROADCASTS · </span>
                  </div>
                </div>
              </div>
            </div>

            {/* control panel */}
            <div className="mt-2 flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-b from-zinc-200 to-zinc-400 border border-zinc-500 shadow-inner grid place-items-center">
                  <div className="w-2 h-2 rounded-full bg-zinc-600" />
                </div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-b from-zinc-200 to-zinc-400 border border-zinc-500 shadow-inner grid place-items-center">
                  <div className="w-2 h-2 rounded-full bg-zinc-600" />
                </div>
              </div>
              <div className="flex gap-1">
                {["▶","◀","▲","▼"].map(b => (
                  <div key={b} className="w-4 h-4 rounded bg-zinc-500 text-zinc-200 text-[8px] grid place-items-center">{b}</div>
                ))}
              </div>
            </div>
          </div>

          {/* TV neck + base */}
          <div className="mx-auto mt-0 w-[16%] h-5 bg-gradient-to-b from-zinc-400 to-zinc-600 rounded-b-sm" />
          <div className="mx-auto w-[58%] h-4 bg-gradient-to-b from-zinc-400 to-zinc-700 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.5)]" />
          <div className="mx-auto mt-1 w-[62%] h-2 rounded-[50%] bg-black/35 blur-md" />

          {/* antennas */}
          <div className="absolute -top-9 left-[30%]">
            <div className="w-[2px] h-10 bg-gradient-to-t from-zinc-500 to-zinc-300 rotate-[-15deg] origin-bottom" />
          </div>
          <div className="absolute -top-9 right-[30%]">
            <div className="w-[2px] h-10 bg-gradient-to-t from-zinc-500 to-zinc-300 rotate-[15deg] origin-bottom" />
          </div>

        </div>
      </div>

      {/* ====== CENTER CARD ====== */}
      <div data-wc-center-card className="absolute inset-0 z-20 flex items-center justify-center px-4 pt-6 pointer-events-none">
        <div className="w-[440px] max-w-[90vw] rounded-3xl bg-[#161029]/85 backdrop-blur-xl border border-purple-400/20 shadow-[0_30px_80px_-20px_rgba(168,85,247,0.5)] p-7 pointer-events-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 grid place-items-center text-white font-black text-2xl shadow-lg">
              {"\u26BD"}
            </div>
            <div>
              <div className="text-purple-300/70 text-[10px] tracking-[0.35em] font-semibold">LIVE NOW</div>
              <div className="text-white text-2xl font-bold">Match In Play</div>
            </div>
          </div>

          <p className="mt-5 text-white/80 text-sm leading-relaxed">
            Purple Paws FC are pressing high, the captain just buried a thunderbolt from outside the box · the booth is going wild!
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-purple-300/60 text-[9px] tracking-[0.3em]">SHOTS</div>
              <div className="text-white text-2xl font-black mt-1">14</div>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-purple-300/60 text-[9px] tracking-[0.3em]">POSS</div>
              <div className="text-amber-400 text-2xl font-black mt-1">63%</div>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-purple-300/60 text-[9px] tracking-[0.3em]">xG</div>
              <div className="text-purple-300 text-2xl font-black mt-1">2.4</div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-gradient-to-r from-purple-600/30 to-fuchsia-600/30 border border-purple-400/30 p-3 flex items-center justify-between">
            <div>
              <div className="text-purple-200/70 text-[9px] tracking-[0.3em]">LATEST</div>
              <div className="text-white text-sm font-bold mt-0.5">GOAL · @whiskermessi 67&apos;</div>
            </div>
            <div className="text-amber-400 font-black text-xl">2-1</div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-purple-950 rounded-full px-3 py-1 text-[10px] font-black tracking-widest">
              <span>06</span><span>·</span><span>LIVE</span>
            </div>
            <div className="text-purple-300/60 text-[10px] tracking-[0.3em]">SECOND · HALF</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.15} 50%{opacity:1} }
        .animate-twinkle { animation: twinkle 2.5s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.15} }
        .animate-blink { animation: blink 1s ease-in-out infinite; }
        @keyframes ball-run {
          0%   { transform: translate(0,0) }
          40%  { transform: translate(-20px,-90px) }
          70%  { transform: translate(-10px,-180px) }
          100% { transform: translate(0,-260px); opacity: 0.2 }
        }
        .animate-ball-run { animation: ball-run 2.4s cubic-bezier(.4,.7,.5,1) infinite; }
        @keyframes action-pop { 0%,80%,100%{opacity:0; transform:scale(.6)} 85%,95%{opacity:1; transform:scale(1.1)} }
        .animate-action-pop { animation: action-pop 2.4s ease-in-out infinite; }
        @keyframes screen-flicker { 0%,97%,100%{opacity:.7} 98%{opacity:.2} 99%{opacity:.9} }
        .animate-screen-flicker { animation: screen-flicker 4s linear infinite; }
        @keyframes bubble { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        .animate-bubble { animation: bubble 3s ease-in-out infinite; }
        .animate-bubble-2 { animation: bubble 3s ease-in-out 1.5s infinite; }
        @keyframes player-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
        .animate-player-bob { animation: player-bob 1.8s ease-in-out infinite; }
        @keyframes ticker-loop { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .ticker-track {
          display: inline-flex;
          width: max-content;
          min-width: 200%;
          white-space: nowrap;
          animation: ticker-loop 14s linear infinite;
        }
        .ticker-segment {
          flex: 0 0 auto;
          padding-right: 1.75rem;
        }
      `}</style>
    </div>
  );
}

function Player({ x, y, kit, num, delay = "0s" }: { x: number; y: number; kit: "white" | "opp"; num: number; delay?: string }) {
  const isWhite = kit === "white";
  const kitColor = isWhite ? "#7c3aed" : "#f59e0b";
  const shirtFill = isWhite ? "#ffffff" : "url(#oppKit)";
  const shortsFill = isWhite ? "#4c1d95" : "#d97706";
  const sockFill = isWhite ? "#7c3aed" : "#92400e";
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 animate-player-bob" style={{ left: `${x}%`, top: `${y}%`, animationDelay: delay }}>
      <svg width="32" height="55" viewBox="0 0 22 38">
        <defs>
          <radialGradient id="catFace" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
          <linearGradient id="oppKit" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        {/* ground shadow */}
        <ellipse cx="11" cy="37" rx="7" ry="1.5" fill="#000" opacity="0.3" />
        {/* legs + socks */}
        <rect x="6" y="26" width="4" height="7" rx="2" fill={shortsFill} />
        <rect x="12" y="26" width="4" height="7" rx="2" fill={shortsFill} />
        <rect x="6" y="30" width="4" height="5" rx="1" fill={sockFill} />
        <rect x="12" y="30" width="4" height="5" rx="1" fill={sockFill} />
        {/* boots */}
        <ellipse cx="8" cy="35.5" rx="4" ry="2" fill="#111" />
        <ellipse cx="14" cy="35.5" rx="4" ry="2" fill="#111" />
        {/* shorts */}
        <rect x="5" y="21" width="12" height="7" rx="1" fill={shortsFill} />
        {/* shirt */}
        <rect x="4" y="13" width="14" height="10" rx="2" fill={shirtFill} stroke={kitColor} strokeWidth="0.5" />
        {/* shirt number */}
        <text x="11" y="21" textAnchor="middle" fontSize="4.5" fontWeight="900" fill={isWhite ? kitColor : "#fff"} fontFamily="Arial">{num}</text>
        {/* arms */}
        <rect x="1" y="14" width="3.5" height="7" rx="1.5" fill={shirtFill} stroke={kitColor} strokeWidth="0.5" />
        <rect x="17.5" y="14" width="3.5" height="7" rx="1.5" fill={shirtFill} stroke={kitColor} strokeWidth="0.5" />
        {/* neck */}
        <rect x="9" y="10" width="4" height="4" rx="1" fill="url(#catFace)" />
        {/* head */}
        <ellipse cx="11" cy="8" rx="5.5" ry="5" fill="url(#catFace)" />
        {/* cat ears */}
        <polygon points="6,4.5 5,0.5 9,3.5" fill="url(#catFace)" stroke="#d97706" strokeWidth="0.3" />
        <polygon points="16,4.5 17,0.5 13,3.5" fill="url(#catFace)" stroke="#d97706" strokeWidth="0.3" />
        {/* inner ear */}
        <polygon points="6.5,4 6,1.5 8.5,3.5" fill="#f87171" opacity="0.7" />
        <polygon points="15.5,4 16,1.5 13.5,3.5" fill="#f87171" opacity="0.7" />
        {/* eyes */}
        <ellipse cx="8.5" cy="8" rx="1.5" ry="1.8" fill="#22c55e" />
        <ellipse cx="8.5" cy="8" rx="0.7" ry="1.5" fill="#000" />
        <ellipse cx="13.5" cy="8" rx="1.5" ry="1.8" fill="#22c55e" />
        <ellipse cx="13.5" cy="8" rx="0.7" ry="1.5" fill="#000" />
        <circle cx="9" cy="7" r="0.5" fill="#fff" opacity="0.8" />
        <circle cx="14" cy="7" r="0.5" fill="#fff" opacity="0.8" />
        {/* nose */}
        <path d="M10.2 10.2 L 11 10.8 L 11.8 10.2 Z" fill="#f472b6" />
        {/* whiskers */}
        <line x1="5.5" y1="10" x2="2" y2="9.2" stroke="#fff" strokeWidth="0.4" opacity="0.6" />
        <line x1="5.5" y1="10.5" x2="2" y2="11" stroke="#fff" strokeWidth="0.4" opacity="0.6" />
        <line x1="16.5" y1="10" x2="20" y2="9.2" stroke="#fff" strokeWidth="0.4" opacity="0.6" />
        <line x1="16.5" y1="10.5" x2="20" y2="11" stroke="#fff" strokeWidth="0.4" opacity="0.6" />
      </svg>
    </div>
  );
}

export default Slide6;
