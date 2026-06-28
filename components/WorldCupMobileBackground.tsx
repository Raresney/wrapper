"use client";

import { useState, useMemo, type CSSProperties } from "react";
import stadium from "@/components/pawcup/assets/stadium.asset.json";
import catMascot from "@/components/pawcup/assets/cat-mascot.asset.json";

type Star = { x: number; y: number; d: number };

// ── Decorative soccer balls ───────────────────────────────────────────────
// Mirror the 3 planets from the space theme (SpaceBackground): same screen
// positions/sizes, but each ball has its own colour scheme and surface pattern.

type BallVariant = "classic" | "panels" | "stars";
type BallSpec = {
  id: string;
  variant: BallVariant;
  base: string; mid: string; dark: string; spot: string; seam: string;
};

// Pentagon vertex string centred at (cx,cy), radius r, first vertex at `rot` deg.
function pent(cx: number, cy: number, r: number, rot: number): string {
  return Array.from({ length: 5 }, (_, i) => {
    const a = ((rot + i * 72) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

function BallPattern({ variant, spot, seam }: { variant: BallVariant; spot: string; seam: string }) {
  if (variant === "classic") {
    const outers = [0, 1, 2, 3, 4].map((i) => {
      const a = ((-90 + i * 72) * Math.PI) / 180;
      return { cx: 50 + Math.cos(a) * 30, cy: 50 + Math.sin(a) * 30, rot: -90 + i * 72 + 36 };
    });
    return (
      <g>
        {outers.map((o, i) => (
          <line key={`s${i}`} x1="50" y1="50" x2={o.cx.toFixed(1)} y2={o.cy.toFixed(1)} stroke={seam} strokeWidth="1.4" opacity="0.5" />
        ))}
        <polygon points={pent(50, 50, 13, -90)} fill={spot} />
        {outers.map((o, i) => (
          <polygon key={`p${i}`} points={pent(o.cx, o.cy, 8, o.rot)} fill={spot} opacity="0.92" />
        ))}
      </g>
    );
  }
  if (variant === "panels") {
    return (
      <g fill="none" stroke={seam} strokeWidth="2" strokeLinecap="round" opacity="0.9">
        <path d="M50 5 Q71 28 50 50 Q29 28 50 5" />
        <path d="M50 50 Q73 55 87 39" />
        <path d="M50 50 Q27 55 13 39" />
        <path d="M50 50 Q59 79 43 93" />
        <circle cx="50" cy="50" r="7" fill={spot} stroke="none" />
        <circle cx="50" cy="20" r="4" fill={spot} stroke="none" />
        <circle cx="80" cy="46" r="3.4" fill={spot} stroke="none" />
        <circle cx="20" cy="46" r="3.4" fill={spot} stroke="none" />
      </g>
    );
  }
  // stars
  const dots: [number, number, number][] = [
    [30, 32, 3], [68, 28, 2.2], [40, 62, 2.6], [64, 64, 3], [50, 44, 2.2], [26, 52, 2.4], [74, 50, 2.6],
  ];
  return (
    <g>
      <circle cx="50" cy="50" r="30" fill="none" stroke={seam} strokeWidth="1" opacity="0.4" />
      {dots.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? seam : spot} opacity={i % 2 ? 0.85 : 0.95} />
      ))}
    </g>
  );
}

function SoccerBall({ spec }: { spec: BallSpec }) {
  const { id, base, mid, dark, spot, seam, variant } = spec;
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <defs>
        <radialGradient id={`bs-${id}`} cx="36%" cy="30%" r="72%">
          <stop offset="0%" stopColor={base} />
          <stop offset="55%" stopColor={mid} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
        <radialGradient id={`br-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="62%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="47" fill={`url(#bs-${id})`} />
      <BallPattern variant={variant} spot={spot} seam={seam} />
      <circle cx="50" cy="50" r="47" fill={`url(#br-${id})`} />
      <ellipse cx="36" cy="29" rx="15" ry="10" fill="rgba(255,255,255,0.26)" />
      <circle cx="50" cy="50" r="47.5" fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth="1" />
    </svg>
  );
}

// Positions/sizes match the 3 SpaceBackground planets; colours + pattern differ per ball.
const BALLS: { id: string; box: CSSProperties; anim: string; spec: Omit<BallSpec, "id"> }[] = [
  {
    id: "a", box: { top: "14%", left: "3%", width: 70, height: 70 }, anim: "wcmb-ball-a 14s ease-in-out infinite",
    spec: { variant: "classic", base: "#f8f8fb", mid: "#dcdce6", dark: "#a9a9b8", spot: "#15151d", seam: "#23232e" },
  },
  {
    id: "b", box: { bottom: "10%", right: "-30px", width: 140, height: 140 }, anim: "wcmb-ball-b 18s ease-in-out infinite",
    spec: { variant: "panels", base: "#b06bff", mid: "#7c3aed", dark: "#3b1675", spot: "#facc15", seam: "#fde047" },
  },
  {
    id: "c", box: { top: "20%", right: "3%", width: 36, height: 36 }, anim: "wcmb-ball-c 12s ease-in-out infinite",
    spec: { variant: "stars", base: "#2bd4ee", mid: "#0e7490", dark: "#0a3d52", spot: "#f472b6", seam: "#bdf3ff" },
  },
];

export default function WorldCupMobileBackground() {
  const stars = useMemo<Star[]>(() =>
    Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 45,
      d: Math.random() * 3,
    })),
  []);

  const [confetti] = useState(() =>
    Array.from({ length: 55 }).map((_, i) => {
      const duration = 5 + Math.random() * 7;
      return {
        left: Math.random() * 100,
        duration,
        delay: -(Math.random() * duration),
        size: 5 + Math.random() * 7,
        color: ["#a855f7", "#facc15", "#22d3ee", "#f472b6", "#ffffff", "#34d399"][i % 6],
        shape: i % 3,
      };
    }),
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden bg-black"
      style={{
        backgroundImage: `url(${stadium.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      {/* purple vignette — same as original WC landing */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/40 via-transparent to-purple-950/60" />

      {/* twinkling stars */}
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: 2,
            height: 2,
            willChange: "opacity",
            animation: `wcmb-twinkle 2s ease-in-out ${s.d}s infinite`,
          }}
        />
      ))}

      {/* Decorative soccer balls — same positions as the space-theme planets */}
      <div className="absolute inset-0 z-[4]">
        {BALLS.map((b) => (
          <div key={b.id} className="absolute" style={{ ...b.box, willChange: "transform", animation: b.anim }}>
            <SoccerBall spec={{ id: b.id, ...b.spec }} />
          </div>
        ))}
      </div>

      {/* Spotlight under cat */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[5] pointer-events-none"
        style={{
          width: "min(500px, 140vw)",
          height: "300px",
          background: "radial-gradient(ellipse at center bottom, rgba(168,85,247,0.45), transparent 70%)",
        }}
      />

      {/* Cat mascot — centered, bottom, mobile-adapted */}
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 z-10"
        style={{ width: "min(75vw, 320px)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={catMascot.url}
          alt=""
          width={1024}
          height={1024}
          className="w-full h-auto object-contain drop-shadow-[0_20px_32px_rgba(168,85,247,0.5)]"
          draggable={false}
        />
      </div>

      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden z-20" style={{ contain: "layout style paint" }}>
        {confetti.map((c, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${c.left}%`,
              top: "-16px",
              width: c.size,
              height: c.size * 0.4,
              background: c.color,
              borderRadius: c.shape === 0 ? "2px" : c.shape === 1 ? "50%" : "0",
              willChange: "transform, opacity",
              animation: `wcmb-confetti ${c.duration}s ${c.delay}s linear infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes wcmb-twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
        @keyframes wcmb-confetti {
          0%   { transform: rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.7; }
        }
        @keyframes wcmb-ball-a { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(7px,12px,0); } }
        @keyframes wcmb-ball-b { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(-12px,-16px,0); } }
        @keyframes wcmb-ball-c { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(-5px,9px,0); } }
      `}</style>
    </div>
  );
}
