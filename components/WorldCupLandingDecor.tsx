"use client";

import { useMemo } from "react";

function LandingConfetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 70 }).map((_, i) => ({
        left: (i * 1.44) % 100,
        delay: (i * 0.13) % 6,
        duration: 5 + (i * 0.11) % 5,
        size: 6 + (i * 0.29) % 8,
        rot: (i * 41) % 360,
        color: ["#a855f7","#facc15","#22d3ee","#f472b6","#ffffff","#34d399"][i % 6],
        shape: i % 3,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[2]">
      {pieces.map((c, i) => (
        <div
          key={i}
          className="absolute top-[-20px]"
          style={{
            left: `${c.left}%`,
            width: c.size,
            height: c.size * 0.4,
            background: c.color,
            transform: `rotate(${c.rot}deg)`,
            borderRadius: c.shape === 0 ? "2px" : c.shape === 1 ? "50%" : "0",
            animation: `wc-landing-confetti ${c.duration}s ${c.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

function LandingStars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 45 }).map((_, i) => ({
        x: (i * 2.22) % 100,
        y: (i * 3.11) % 100,
        d: (i * 0.19) % 3,
        s: 1 + (i * 0.06) % 2,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            animation: `wc-landing-twinkle 2.5s ${s.d}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function WorldCupLandingDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {/* stadium background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/wc/stadium.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* dark overlay — keep existing content readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0418]/75 via-[#0b0418]/60 to-[#0b0418]/90" />

      {/* purple ambient blobs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-fuchsia-600/15 blur-3xl" />

      {/* stars */}
      <LandingStars />

      {/* confetti */}
      <LandingConfetti />

      {/* cat mascot — bottom right, partially visible */}
      <div className="absolute bottom-0 right-[2%] h-[55vh] z-[3] hidden xl:flex items-end">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/wc/cat-mascot.png"
          alt=""
          className="h-full w-auto object-contain object-bottom opacity-60"
          style={{ filter: "drop-shadow(0 0 40px rgba(168,85,247,0.5))" }}
          draggable={false}
        />
      </div>

      {/* trophy — bottom left, partially visible */}
      <div className="absolute bottom-0 left-[1%] h-[42vh] z-[3] hidden xl:flex items-end">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/wc/trophy-case.png"
          alt=""
          className="h-full w-auto object-contain object-bottom opacity-50"
          style={{ filter: "drop-shadow(0 0 30px rgba(250,204,21,0.4))" }}
          draggable={false}
        />
      </div>

      {/* spotlight */}
      <div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[800px] h-[500px]"
        style={{ background: "radial-gradient(ellipse at center bottom, rgba(168,85,247,0.2), transparent 70%)" }}
      />

      <style>{`
        @keyframes wc-landing-twinkle { 0%,100%{opacity:.1} 50%{opacity:.8} }
        @keyframes wc-landing-confetti {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
