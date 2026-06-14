"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import type { WrappedProfile } from "@/types/wrapped";
import { mapToFlat } from "@/components/wrapped/flatProfile";
import { Stars } from "@/components/wrapped/shared";

const ASTEROIDS = [
  { size: 70, fromX: -20, fromY: 10, toX: 120, toY: 90, dur: 9, label: "bug", spin: 360 },
  { size: 44, fromX: 110, fromY: 0, toX: -20, toY: 70, dur: 11, label: "TypeError", spin: -360 },
  { size: 90, fromX: -30, fromY: 80, toX: 120, toY: 20, dur: 13, label: "null ref", spin: 360 },
  { size: 30, fromX: 100, fromY: 90, toX: -10, toY: 10, dur: 8, label: undefined, spin: -360 },
  { size: 56, fromX: 50, fromY: -20, toX: 60, toY: 120, dur: 10, label: "NaN", spin: 360 },
  { size: 38, fromX: -20, fromY: 50, toX: 120, toY: 60, dur: 12, label: undefined, spin: -360 },
  { size: 64, fromX: 120, fromY: 40, toX: -20, toY: 50, dur: 14, label: "race", spin: 360 },
  { size: 26, fromX: 30, fromY: 120, toX: 70, toY: -20, dur: 9.5, label: undefined, spin: -360 },
] as const;

function Asteroid({ a, delay }: { a: (typeof ASTEROIDS)[number]; delay: number }) {
  return (
    <motion.div className="absolute"
      initial={{ left: `${a.fromX}%`, top: `${a.fromY}%`, opacity: 0 }}
      animate={{ left: [`${a.fromX}%`, `${a.toX}%`], top: [`${a.fromY}%`, `${a.toY}%`], opacity: [0, 1, 1, 0] }}
      transition={{ duration: a.dur, repeat: Infinity, ease: "linear", delay, times: [0, 0.1, 0.9, 1] }}
      style={{ width: a.size, height: a.size }}>
      <motion.div className="relative w-full h-full"
        animate={{ rotate: a.spin }}
        transition={{ duration: a.dur * 0.4, repeat: Infinity, ease: "linear" }}>
        <div className="w-full h-full rounded-full"
          style={{ background: "radial-gradient(circle at 30% 30%, #6b6258, #3a322c 55%, #1a1612 100%)", boxShadow: "inset -6px -8px 14px rgba(0,0,0,0.7), inset 4px 4px 8px rgba(255,255,255,0.06)" }} />
        <span className="absolute rounded-full"
          style={{ width: a.size * 0.22, height: a.size * 0.22, top: "20%", left: "30%", background: "rgba(0,0,0,0.45)", boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.08)" }} />
        <span className="absolute rounded-full"
          style={{ width: a.size * 0.16, height: a.size * 0.16, bottom: "22%", right: "24%", background: "rgba(0,0,0,0.5)" }} />
        {a.label && (
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider"
            style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(248,113,113,0.4)", color: "#fca5a5" }}>
            {a.label}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}

function CatRocketScene() {
  return (
    <motion.div className="absolute left-1/2 top-1/2 z-10"
      style={{ transform: "translate(-50%,-50%)" }}
      animate={{ x: [0, -18, 14, -10, 16, 0], y: [0, 10, -14, 8, -6, 0], rotate: [0, -8, 6, -5, 7, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
      <motion.div className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(74,222,128,0.35) 0%, rgba(74,222,128,0) 70%)", width: 180, height: 180, left: -40, top: -40 }}
        animate={{ scale: [0.8, 1.15, 0.8], opacity: [0, 0.9, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", repeatDelay: 1.4 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/cat-rocket.png" alt="" width={100} height={100}
        className="relative select-none object-contain"
        style={{ filter: "drop-shadow(0 0 18px rgba(74,222,128,0.6))" }}
        draggable={false} />
    </motion.div>
  );
}

function LeftScene() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {ASTEROIDS.map((a, i) => (
        <Asteroid key={i} a={a} delay={i * 0.8} />
      ))}
      <CatRocketScene />
    </div>
  );
}

function CountUp({ to, duration = 1.6 }: { to: number; duration?: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.floor(v).toLocaleString());
  useEffect(() => {
    const c = animate(mv, to, { duration, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] });
    return c.stop;
  }, [to, duration, mv]);
  return <motion.span>{rounded}</motion.span>;
}

function Planet() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div className="absolute rounded-full"
        style={{ width: 420, height: 420, background: "radial-gradient(circle, rgba(193,68,14,0.25) 0%, rgba(139,37,0,0.08) 40%, transparent 70%)", filter: "blur(20px)" }} />
      <motion.div className="relative rounded-full"
        style={{ width: 360, height: 360, background: "radial-gradient(circle at 32% 30%, #d6552a 0%, #C1440E 25%, #8B2500 60%, #3a0f00 95%)", boxShadow: "inset -30px -40px 80px rgba(0,0,0,0.7), inset 20px 20px 60px rgba(255,140,80,0.15), 0 0 80px rgba(193,68,14,0.35)" }}
        animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}>
        {[{ x: 22, y: 30, s: 14 }, { x: 55, y: 22, s: 9 }, { x: 70, y: 45, s: 18 }, { x: 40, y: 55, s: 11 }, { x: 30, y: 70, s: 16 }, { x: 65, y: 72, s: 10 }, { x: 50, y: 40, s: 7 }, { x: 78, y: 60, s: 8 }].map((c, i) => (
          <span key={i} className="absolute rounded-full" style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${c.s}%`, height: `${c.s}%`, background: "radial-gradient(circle at 35% 35%, rgba(0,0,0,0.55), rgba(0,0,0,0.15) 70%, transparent)", boxShadow: "inset 1px 1px 2px rgba(255,180,140,0.15)" }} />
        ))}
        <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(105deg, transparent 40%, rgba(0,0,0,0.55) 90%)" }} />
      </motion.div>
    </div>
  );
}

export default function SlideLanguages({ profile }: { profile: WrappedProfile }) {
  const flat = mapToFlat(profile);
  const fixCommits = flat.fixCommits;
  const fixRatio = flat.totalCommits > 0 ? (fixCommits / flat.totalCommits) * 100 : 0;
  const cleanCommits = flat.totalCommits - fixCommits;
  const maxRepo = Math.max(...flat.topRepos.map((r) => r.commits), 1);
  const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.2 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } } };

  return (
    <main className="relative min-h-full w-full overflow-hidden" style={{ background: "#080612", color: "white" }}>
      <Stars />
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-10 items-center min-h-screen px-6 lg:px-12 py-12">
        {/* LEFT — meteors + cat rocket */}
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="relative h-[420px] lg:h-[640px] order-2 lg:order-1">
          <LeftScene />
        </motion.div>

        {/* CENTER */}
        <div className="order-1 lg:order-2 flex justify-center">
          <motion.div variants={stagger} initial="hidden" animate="show" className="[&::-webkit-scrollbar]:hidden"
            style={{ width: 380, height: 500, overflowY: "auto", scrollbarWidth: "none", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(24px) saturate(1.6)", borderRadius: 24, padding: 16, boxShadow: "0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.07)" }}>
            <motion.div variants={item} className="flex items-center gap-3">
              <div className="rounded-full flex-shrink-0 overflow-hidden"
                style={{ width: 40, height: 40, background: flat.avatarUrl ? `url(${flat.avatarUrl}) center/cover` : "linear-gradient(135deg, #6366f1, #a855f7)", border: "1px solid rgba(255,255,255,0.15)" }}>
                {!flat.avatarUrl && <div className="w-full h-full flex items-center justify-center text-white font-bold text-base">{flat.username.charAt(0).toUpperCase()}</div>}
              </div>
              <div className="min-w-0">
                <div className="text-white font-bold text-base truncate">@{flat.username}</div>
                <div className="text-white/50 text-[10px]">{flat.period.label}</div>
              </div>
            </motion.div>
            <motion.div variants={item} className="mt-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider"
                style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#86efac" }}>
                <motion.span className="w-1.5 h-1.5 rounded-full bg-green-400" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
                Meteors neutralized
              </span>
            </motion.div>
            <motion.div variants={item} className="mt-2">
              <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", background: "linear-gradient(135deg, #e5e7eb 0%, #cbd5e1 30%, #a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                <CountUp to={fixCommits} />
              </div>
              <div className="text-white/40 text-[11px] uppercase tracking-wider mt-1">fix commits</div>
            </motion.div>
            <motion.div variants={item} className="mt-3">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-white/60">Fix ratio</span>
                <span className="text-red-300 font-mono">{fixRatio.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${fixRatio}%` }}
                  transition={{ duration: 1.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  style={{ background: "linear-gradient(90deg, #dc2626, #f87171)", boxShadow: "0 0 8px rgba(248,113,113,0.5)" }} />
              </div>
              <div className="mt-1.5 text-[11px] text-white/45"><span className="text-white/70 font-mono">{cleanCommits}</span> clean commits</div>
            </motion.div>
            <motion.div variants={item} className="mt-3 grid grid-cols-3 gap-2 py-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {[
                { label: "Total", value: flat.totalCommits.toLocaleString() },
                { label: "Top repo", value: flat.topRepos[0]?.name ?? "—" },
                { label: "PRs merged", value: flat.pullRequests.merged },
              ].map((s, i) => (
                <div key={i} className="text-center" style={{ borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                  <div className="text-white font-semibold text-sm truncate">{s.value}</div>
                  <div className="text-white/40 text-[9px] uppercase tracking-wider mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
            <motion.div variants={item} className="mt-3 space-y-2">
              <div className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Top repositories</div>
              {flat.topRepos.slice(0, 3).map((r, i) => (
                <div key={r.name} className="flex items-center gap-2">
                  <div className="text-white/80 text-xs w-24 truncate">{r.name}</div>
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                      animate={{ width: `${(r.commits / maxRepo) * 100}%` }}
                      transition={{ duration: 1.2, delay: 0.8 + i * 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                      style={{ background: "linear-gradient(90deg, #22c55e, #4ade80)", boxShadow: "0 0 6px rgba(74,222,128,0.5)" }} />
                  </div>
                  <div className="text-white/50 text-[10px] font-mono w-8 text-right">{r.commits}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="relative h-[420px] lg:h-[640px] order-3">
          <Planet />
        </motion.div>
      </div>
    </main>
  );
}
