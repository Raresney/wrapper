"use client";

import { useMemo } from "react";

// Per-slide decorative cat images (left side, right side)
const SLIDE_DECOR: Record<number, { left?: string; right?: string; bottom?: string }> = {
  0: { left: "/wc/cat-singer.png",      right: "/wc/trophy-case.png" },
  1: { left: "/wc/cat-back.png" },
  2: { left: "/wc/cat-fans.png",         right: "/wc/cat-celebrate.png" },
  3: { left: "/wc/coach.png",            right: "/wc/cat-listen.png" },
  4: { right: "/wc/trophy-case.png",     left: "/wc/cat-goalkeeper.png" },
  5: { left: "/wc/cat-referee.png",      right: "/wc/cat-angry-player.png" },
  6: { right: "/wc/commentators.png" },
  7: { bottom: "/wc/champion-cat.png" },
};

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 55 }).map((_, i) => ({
        left: (i * 1.82) % 100,
        delay: (i * 0.17) % 6,
        duration: 5 + (i * 0.13) % 5,
        size: 6 + (i * 0.31) % 8,
        rot: (i * 37) % 360,
        color: ["#a855f7","#facc15","#22d3ee","#f472b6","#ffffff","#34d399"][i % 6],
        shape: i % 3,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
            animation: `wc-confetti-fall ${c.duration}s ${c.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

function WCStars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        x: (i * 2.5) % 100,
        y: (i * 3.7) % 100,
        d: (i * 0.23) % 3,
        s: 1 + (i * 0.07) % 2,
      })),
    [],
  );
  return (
    <>
      {stars.map((s, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            animation: `wc-twinkle 2.5s ${s.d}s ease-in-out infinite`,
          }}
        />
      ))}
    </>
  );
}

export default function WorldCupDecor({ slideIndex }: { slideIndex: number }) {
  const decor = SLIDE_DECOR[slideIndex] ?? {};
  const isChampions = slideIndex === 7;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1]">
      {/* stadium background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isChampions
            ? `url(/wc/stadium-celebration.jpg)`
            : `url(/wc/stadium.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* dark overlay so content stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0418]/80 via-[#0b0418]/70 to-[#0b0418]/85" />

      {/* purple ambient blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-fuchsia-600/20 blur-3xl" />

      {/* twinkling stars */}
      <WCStars />

      {/* confetti on champions slide */}
      {isChampions && <Confetti />}

      {/* WC header badge */}
      <div className="absolute top-[72px] left-1/2 -translate-x-1/2 z-[2] flex items-center gap-2 text-white/50 text-[10px] tracking-[0.35em] font-semibold font-mono">
        <span>FIFA WORLD CUP</span>
        <span className="text-purple-400">·</span>
        <span className="text-amber-300/70">2026</span>
      </div>

      {/* Left decorative cat */}
      {decor.left && (
        <div className="absolute left-0 bottom-0 h-[70%] z-[2] flex items-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={decor.left}
            alt=""
            className="h-full w-auto object-contain object-bottom opacity-70"
            style={{ filter: "drop-shadow(0 0 20px rgba(168,85,247,0.4))" }}
            draggable={false}
          />
        </div>
      )}

      {/* Right decorative cat */}
      {decor.right && (
        <div className="absolute right-0 bottom-0 h-[65%] z-[2] flex items-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={decor.right}
            alt=""
            className="h-full w-auto object-contain object-bottom opacity-70"
            style={{ filter: "drop-shadow(0 0 20px rgba(168,85,247,0.4))" }}
            draggable={false}
          />
        </div>
      )}

      {/* Bottom center cat (champions slide) */}
      {decor.bottom && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[55%] z-[2] flex items-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={decor.bottom}
            alt=""
            className="h-full w-auto object-contain object-bottom opacity-75"
            style={{ filter: "drop-shadow(0 0 30px rgba(250,204,21,0.5))" }}
            draggable={false}
          />
        </div>
      )}

      {/* champions slide: extra team cats at sides */}
      {isChampions && (
        <>
          <div className="absolute left-0 bottom-0 h-[45%] z-[2] flex items-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/wc/cat-grey.png" alt="" className="h-full w-auto object-contain object-bottom opacity-60" draggable={false} />
          </div>
          <div className="absolute right-0 bottom-0 h-[45%] z-[2] flex items-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/wc/cat-white.png" alt="" className="h-full w-auto object-contain object-bottom opacity-60" draggable={false} />
          </div>
        </>
      )}

      {/* spotlight */}
      <div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[700px] h-[450px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center bottom, rgba(168,85,247,0.25), transparent 70%)" }}
      />

      <style>{`
        @keyframes wc-twinkle { 0%,100%{opacity:.15} 50%{opacity:.9} }
        @keyframes wc-confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
