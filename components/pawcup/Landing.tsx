"use client";

import { useMemo, useRef, useCallback } from "react";
import stadium from "@/components/pawcup/assets/stadium.asset.json";
import logo from "@/components/pawcup/assets/logo3.asset.json";
import catMascot from "@/components/pawcup/assets/cat-mascot.asset.json";

function FootballPixelTitle({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="relative select-none text-left">
      <div className="absolute -left-3 -top-4 h-5 w-2 rounded-sm bg-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]" />
      <div
        className="relative rounded-[9px] border border-emerald-200/14 bg-[#07120c]/68 px-4 py-3 shadow-[0_14px_38px_rgba(0,0,0,0.34),inset_0_0_0_1px_rgba(255,255,255,0.025),inset_0_1px_0_rgba(255,255,255,0.05)]"
        style={{ backdropFilter: "blur(8px)" }}
      >
        <div className="mb-2 flex items-center justify-between gap-4">
          <span className="text-[8px] font-black uppercase tracking-[0.28em] text-emerald-200/55">Sub board</span>
          <span className="rounded bg-emerald-300/8 px-2 py-0.5 text-[8px] font-black tabular-nums text-emerald-100/70">90+4</span>
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.1]"
          style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(52,211,153,0.28) 5px, rgba(52,211,153,0.28) 6px)" }}
        />
        <div className="relative">
          <div
            className="font-black uppercase leading-[0.84] tracking-[-0.06em] text-white"
            style={{
              fontSize: "clamp(34px, 4.1vw, 62px)",
              textShadow:
                "0 0 8px rgba(52,211,153,0.26), 0 0 18px rgba(250,204,21,0.18), 0 8px 22px rgba(0,0,0,0.5)",
            }}
          >
            ALL TIME
            <br />
            WRAPPER
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.22em] ${
                isLoggedIn
                  ? "border-emerald-300/45 bg-emerald-300/12 text-emerald-200"
                  : "border-amber-300/35 bg-amber-300/10 text-amber-200"
              }`}
            >
              {isLoggedIn ? "UNLOCKED" : "SUB IN 90+4"}
            </span>
            <span className="h-px w-14 bg-gradient-to-r from-emerald-200/40 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Fireworks() {
  const bursts = useMemo(() => [
    { x: 28, y: 28, color: "#facc15", delay: 0,   dur: 3.2 },
    { x: 70, y: 20, color: "#34d399", delay: 1.2, dur: 2.8 },
    { x: 52, y: 62, color: "#f472b6", delay: 2.1, dur: 3.5 },
    { x: 18, y: 48, color: "#38bdf8", delay: 0.7, dur: 3.0 },
  ], []);
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <div className="pointer-events-none absolute inset-0">
      {bursts.map((b, bi) => (
        <div key={bi} className="absolute" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
          <div style={{
            position: "absolute", width: 4, height: 4, borderRadius: "50%",
            background: b.color, transform: "translate(-50%,-50%)",
            boxShadow: `0 0 6px ${b.color}`,
            animation: `fw-center ${b.dur}s ${b.delay}s ease-out infinite`,
          }} />
          {angles.map((angle, ai) => (
            <div key={ai} style={{
              position: "absolute", top: 0, left: 0,
              transform: `translate(-50%,-50%) rotate(${angle}deg)`,
            }}>
              <div style={{
                width: 2, height: 2, borderRadius: "50%",
                background: b.color, boxShadow: `0 0 3px ${b.color}`,
                animation: `fw-ray ${b.dur}s ${b.delay + 0.05}s ease-out infinite`,
              }} />
            </div>
          ))}
        </div>
      ))}
      <style>{`
        @keyframes fw-center {
          0%,100%{opacity:0;transform:translate(-50%,-50%) scale(0)}
          6%{opacity:1;transform:translate(-50%,-50%) scale(3)}
          18%{opacity:0.6;transform:translate(-50%,-50%) scale(1.2)}
          32%{opacity:0;transform:translate(-50%,-50%) scale(0.4)}
        }
        @keyframes fw-ray {
          0%,5%,100%{opacity:0;transform:translateY(0)}
          12%{opacity:1;transform:translateY(-3px)}
          55%{opacity:0.5;transform:translateY(-13px)}
          78%{opacity:0;transform:translateY(-18px)}
        }
      `}</style>
    </div>
  );
}

function BallTelevision() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<"playing" | "fading" | "replay" | "fading-in">("playing");
  const prevTimeRef = useRef(0);
  const replayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeInStartRef = useRef(0);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    const o = overlayRef.current;
    if (!v || !v.duration || !o) return;

    const t = v.currentTime;
    const d = v.duration;
    const prev = prevTimeRef.current;
    prevTimeRef.current = t;
    const phase = phaseRef.current;

    // Detect loop: jumped from near end back to beginning
    if (prev > d - 0.8 && t < 0.5 && phase === "fading") {
      phaseRef.current = "replay";
      o.style.opacity = "1";
      const txt = textRef.current;
      if (txt) txt.style.opacity = "1"; // CSS transition handles fade-in
      if (replayTimeoutRef.current) clearTimeout(replayTimeoutRef.current);
      replayTimeoutRef.current = setTimeout(() => {
        phaseRef.current = "fading-in";
        fadeInStartRef.current = Date.now();
        const t2 = textRef.current;
        if (t2) t2.style.opacity = "0"; // CSS transition handles fade-out
      }, 1500);
      return;
    }

    if (phase === "replay") {
      o.style.opacity = "1";
      return;
    }

    if (phase === "fading-in") {
      const elapsed = (Date.now() - fadeInStartRef.current) / 1000;
      const p = Math.min(elapsed / 1.4, 1);
      const eased = 1 - (1 - p) * (1 - p);
      o.style.opacity = String(1 - eased);
      if (elapsed >= 1.4) phaseRef.current = "playing";
      return;
    }

    // "playing" — fade to black near end
    const fadeZone = 0.7;
    if (d - t < fadeZone) {
      phaseRef.current = "fading";
      o.style.opacity = String((1 - (d - t) / fadeZone) * 0.95);
    } else {
      phaseRef.current = "playing";
      o.style.opacity = "0";
    }
  }, []);

  return (
    <div className="relative h-[300px] w-[230px]">
      <div
        className="absolute -inset-x-8 top-0 h-[230px] rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(250,204,21,0.28), rgba(168,85,247,0.2) 48%, transparent 72%)" }}
      />
      <div
        className="relative h-[230px] w-[230px] overflow-hidden rounded-full border border-white/25 bg-white shadow-[0_28px_70px_rgba(0,0,0,0.62),inset_-18px_-24px_42px_rgba(0,0,0,0.28),inset_12px_12px_24px_rgba(255,255,255,0.85)]"
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 230 230" aria-hidden>
          <defs>
            <clipPath id="landingBallClip">
              <circle cx="115" cy="115" r="115" />
            </clipPath>
            <radialGradient id="landingBallShade" cx="36%" cy="28%" r="78%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="58%" stopColor="#eef2f7" />
              <stop offset="100%" stopColor="#b9c0cb" />
            </radialGradient>
          </defs>
          <circle cx="115" cy="115" r="115" fill="url(#landingBallShade)" />
          <g clipPath="url(#landingBallClip)" fill="none" strokeLinecap="round">
            <path d="M112 120 C 132 75 68 64 78 18 C 84 -12 42 -24 -12 -6" stroke="#c8163d" strokeWidth="28" />
            <path d="M112 120 C 132 75 68 64 78 18 C 84 -12 42 -24 -12 -6" stroke="#1f9d4d" strokeWidth="28" transform="rotate(120 115 115)" />
            <path d="M112 120 C 132 75 68 64 78 18 C 84 -12 42 -24 -12 -6" stroke="#1d7fe0" strokeWidth="28" transform="rotate(240 115 115)" />
          </g>
          <g clipPath="url(#landingBallClip)" fill="none" stroke="#222631" strokeLinecap="round" opacity="0.42">
            <path d="M16 88 Q 115 48 214 88" strokeWidth="2.2" />
            <path d="M16 142 Q 115 182 214 142" strokeWidth="2.2" />
            <path d="M82 8 Q 46 115 82 222" strokeWidth="2" />
            <path d="M148 8 Q 184 115 148 222" strokeWidth="2" />
          </g>
          <ellipse cx="78" cy="66" rx="38" ry="24" fill="#ffffff" opacity="0.42" transform="rotate(-26 78 66)" />
        </svg>
        <div className="absolute left-1/2 top-1/2 h-[112px] w-[144px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[32px] border-[5px] border-zinc-950 bg-black shadow-[0_0_0_2px_rgba(255,255,255,0.22),inset_0_0_18px_rgba(0,0,0,0.9)]">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={videoRef}
            src="/1.mp4"
            autoPlay loop muted playsInline
            onTimeUpdate={handleTimeUpdate}
            className="h-full w-full object-cover opacity-85"
          />
          <Fireworks />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.07) 4px, rgba(255,255,255,0.07) 5px)" }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.22),transparent_42%)]" />
          <div ref={overlayRef} className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: 0 }} />
          <div
            ref={textRef}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1"
            style={{ opacity: 0, transition: "opacity 0.7s ease-in-out" }}
          >
            <div className="flex items-center gap-1">
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", animation: "replay-blink 0.8s ease-in-out infinite" }} />
              <span style={{ fontSize: 7, fontWeight: 900, color: "#fff", letterSpacing: "0.18em", fontFamily: "Arial Black, sans-serif" }}>REC</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "0.06em", fontFamily: "Arial Black, sans-serif", lineHeight: 1.0, textAlign: "center", textShadow: "0 0 14px rgba(255,255,255,0.6)" }}>
              INSTANT<br />REPLAY
            </div>
            <div style={{ width: "55%", height: 1.5, background: "#facc15" }} />
            <div style={{ fontSize: 6, color: "#facc15", letterSpacing: "0.22em", fontFamily: "monospace" }}>WORLD CUP 2026</div>
          </div>
          <style>{`@keyframes replay-blink { 0%,100%{opacity:1} 50%{opacity:0.15} }`}</style>
        </div>
      </div>
      <div className="absolute left-[72px] top-[215px] h-16 w-4 rotate-[9deg] rounded-full bg-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" />
      <div className="absolute right-[72px] top-[215px] h-16 w-4 rotate-[-9deg] rounded-full bg-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" />
    </div>
  );
}

function Index({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const confetti = useMemo(
    () =>
      Array.from({ length: 70 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 5,
        size: 6 + Math.random() * 8,
        rot: Math.random() * 360,
        color: ["#a855f7", "#facc15", "#22d3ee", "#f472b6", "#ffffff", "#34d399"][i % 6],
        shape: i % 3,
      })),
    [],
  );

  const stars = useMemo(
    () => Array.from({ length: 30 }).map(() => ({ x: Math.random() * 100, y: Math.random() * 40, d: Math.random() * 3 })),
    [],
  );

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-black"
      style={{
        backgroundImage: `url(${stadium.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* purple vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/40 via-transparent to-purple-950/60 pointer-events-none" />

      {/* twinkling stars */}
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: 2, height: 2, animationDelay: `${s.d}s` }}
        />
      ))}

      {/* Top header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center px-8 py-6">
        <img src={logo.url} alt="logo" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur p-1 ring-2 ring-purple-400/60" />
      </header>

      <div className="pointer-events-none absolute left-[6vw] top-[58%] z-20 hidden -translate-y-1/2 xl:block">
        <FootballPixelTitle isLoggedIn={isLoggedIn} />
      </div>

      <div className="pointer-events-none absolute right-[12vw] top-[66%] z-20 hidden -translate-y-1/2 xl:block">
        <BallTelevision />
      </div>

      {/* Mascot - Black Cat */}
      <div className="absolute left-1/2 bottom-[6%] -translate-x-1/2 z-10">
        <img
          src={catMascot.url}
          alt="Purple Paws mascot"
          className="h-[70vh] w-auto drop-shadow-[0_30px_40px_rgba(168,85,247,0.5)]"
        />
      </div>

      {/* Spotlight */}
      <div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[600px] h-[400px] z-[5] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center bottom, rgba(168,85,247,0.45), transparent 70%)",
        }}
      />

      {/* Confetti */}
      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
        {confetti.map((c, i) => (
          <div
            key={i}
            className="absolute top-[-20px] animate-confetti"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.size * 0.4,
              background: c.color,
              transform: `rotate(${c.rot}deg)`,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
              borderRadius: c.shape === 0 ? "2px" : c.shape === 1 ? "50%" : "0",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0.8; }
        }
        .animate-confetti { animation: confetti-fall linear infinite; }
        @keyframes float-cat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float { animation: float-cat 3s ease-in-out infinite; }
        @keyframes tail-wag {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(20deg); }
        }
        .animate-tail { animation: tail-wag 1.2s ease-in-out infinite; transform-origin: bottom left; }
        @keyframes blink {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .animate-blink { animation: blink 4s infinite; transform-origin: center; }
        @keyframes ball-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-ball { animation: ball-spin 6s linear infinite; transform-origin: center; }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(250,204,21,0.7); }
          50% { box-shadow: 0 0 0 12px rgba(250,204,21,0); }
        }
        .animate-pulse-glow { animation: pulse-glow 2s infinite; }
        @keyframes ear-twitch {
          0%, 90%, 100% { transform: rotate(0deg); }
          93% { transform: rotate(-12deg); }
        }
        .animate-ear { animation: ear-twitch 5s infinite; transform-origin: bottom center; }
      `}</style>
    </div>
  );
}

function Cat() {
  return (
    <svg width="340" height="380" viewBox="0 0 340 380" className="drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]">
      <defs>
        <radialGradient id="furGrad" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="60%" stopColor="#141414" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
        <radialGradient id="ballGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#c0c0c0" />
        </radialGradient>
        <linearGradient id="jersey" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6b21a8" />
        </linearGradient>
      </defs>

      {/* shadow under */}
      <ellipse cx="170" cy="370" rx="110" ry="10" fill="#000" opacity="0.5" />

      {/* Tail */}
      <g className="animate-tail" style={{ transformOrigin: "245px 285px" }}>
        <path d="M245 285 Q 295 250 300 200 Q 302 175 285 170" stroke="url(#furGrad)" strokeWidth="22" fill="none" strokeLinecap="round" />
      </g>

      {/* Back legs */}
      <ellipse cx="135" cy="335" rx="22" ry="28" fill="url(#furGrad)" />
      <ellipse cx="215" cy="335" rx="22" ry="28" fill="url(#furGrad)" />

      {/* Body with jersey */}
      <ellipse cx="170" cy="270" rx="78" ry="70" fill="url(#furGrad)" />
      <path d="M105 245 Q 170 215 235 245 L 232 310 Q 170 330 108 310 Z" fill="url(#jersey)" />
      {/* jersey collar */}
      <path d="M150 222 Q 170 235 190 222 L 188 232 Q 170 242 152 232 Z" fill="#facc15" />
      {/* jersey logo */}
      <circle cx="200" cy="270" r="16" fill="white" />
      <image href={logo.url} x="186" y="256" width="28" height="28" />
      {/* jersey number */}
      <text x="140" y="285" fontSize="28" fontWeight="900" fill="#facc15" fontFamily="Arial Black">10</text>

      {/* Front right leg standing */}
      <rect x="195" y="305" width="20" height="45" rx="10" fill="url(#furGrad)" />

      {/* Front left leg ON THE BALL */}
      <rect x="125" y="295" width="20" height="35" rx="10" fill="url(#furGrad)" />

      {/* Soccer Ball */}
      <g className="animate-ball" style={{ transformOrigin: "115px 345px" }}>
        <circle cx="115" cy="345" r="32" fill="url(#ballGrad)" stroke="#000" strokeWidth="2" />
        <polygon points="115,325 128,335 123,350 107,350 102,335" fill="#000" />
        <line x1="115" y1="313" x2="115" y2="325" stroke="#000" strokeWidth="2" />
        <line x1="128" y1="335" x2="143" y2="330" stroke="#000" strokeWidth="2" />
        <line x1="123" y1="350" x2="135" y2="365" stroke="#000" strokeWidth="2" />
        <line x1="107" y1="350" x2="95" y2="365" stroke="#000" strokeWidth="2" />
        <line x1="102" y1="335" x2="87" y2="330" stroke="#000" strokeWidth="2" />
      </g>

      {/* Head */}
      <g>
        {/* Ears */}
        <g className="animate-ear" style={{ transformOrigin: "120px 155px" }}>
          <polygon points="100,160 120,110 140,160" fill="url(#furGrad)" />
          <polygon points="110,155 122,128 132,155" fill="#a855f7" />
        </g>
        <g className="animate-ear" style={{ transformOrigin: "220px 155px", animationDelay: "0.5s" }}>
          <polygon points="200,160 220,110 240,160" fill="url(#furGrad)" />
          <polygon points="208,155 220,128 230,155" fill="#a855f7" />
        </g>

        {/* Face */}
        <ellipse cx="170" cy="180" rx="75" ry="68" fill="url(#furGrad)" />

        {/* Cheeks highlights */}
        <ellipse cx="125" cy="200" rx="15" ry="10" fill="#fff" opacity="0.05" />
        <ellipse cx="215" cy="200" rx="15" ry="10" fill="#fff" opacity="0.05" />

        {/* Eyes */}
        <g className="animate-blink" style={{ transformOrigin: "145px 175px" }}>
          <ellipse cx="145" cy="175" rx="14" ry="16" fill="#fff" />
          <ellipse cx="145" cy="178" rx="8" ry="12" fill="#22c55e" />
          <ellipse cx="145" cy="178" rx="3" ry="10" fill="#000" />
          <circle cx="148" cy="172" r="3" fill="#fff" />
        </g>
        <g className="animate-blink" style={{ transformOrigin: "195px 175px" }}>
          <ellipse cx="195" cy="175" rx="14" ry="16" fill="#fff" />
          <ellipse cx="195" cy="178" rx="8" ry="12" fill="#22c55e" />
          <ellipse cx="195" cy="178" rx="3" ry="10" fill="#000" />
          <circle cx="198" cy="172" r="3" fill="#fff" />
        </g>

        {/* Nose */}
        <path d="M163 205 L 177 205 L 170 215 Z" fill="#f472b6" />
        {/* Mouth */}
        <path d="M170 215 Q 165 225 158 222" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M170 215 Q 175 225 182 222" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Whiskers */}
        <line x1="115" y1="210" x2="80" y2="205" stroke="#fff" strokeWidth="1.2" opacity="0.7" />
        <line x1="115" y1="215" x2="80" y2="218" stroke="#fff" strokeWidth="1.2" opacity="0.7" />
        <line x1="225" y1="210" x2="260" y2="205" stroke="#fff" strokeWidth="1.2" opacity="0.7" />
        <line x1="225" y1="215" x2="260" y2="218" stroke="#fff" strokeWidth="1.2" opacity="0.7" />

        {/* Captain headband */}
        <rect x="100" y="145" width="140" height="14" fill="#facc15" />
        <text x="170" y="156" textAnchor="middle" fontSize="10" fontWeight="900" fill="#6b21a8" fontFamily="Arial Black">CAPITAN · WORLD CUP 2026</text>
      </g>
    </svg>
  );
}

export default Index;
