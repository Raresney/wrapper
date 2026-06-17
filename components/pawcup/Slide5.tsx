"use client";

import stadium from "@/components/pawcup/assets/stadium.asset.json";

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff; };
}
const r = seeded(515151);
const STARS = Array.from({ length: 40 }).map(() => ({
  x: r() * 100, y: r() * 100, d: r() * 3, s: 1 + r() * 2,
}));

function Slide5() {
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

      {/* HEADER */}

      {/* ====== LEFT: referee + angry player ====== */}
      <div className="absolute left-0 top-0 bottom-0 w-[30%] z-10 pointer-events-none">
        {/* referee cat */}
        <div className="absolute left-[2%] bottom-[8%] w-[52%]">
          <img
            src="/cat-referee.png"
            alt="Cat referee showing yellow card"
            className="block w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]"
          />
        </div>

        {/* angry player cat */}
        <div className="absolute right-[0%] bottom-[8%] w-[50%] scale-x-[-1]">
          <img
            src="/cat-angry-player.png"
            alt="Angry cat player protesting"
            className="block w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]"
          />
        </div>

        {/* emotion sparks */}
        <div className="absolute left-[55%] top-[28%] text-red-400 text-lg font-black animate-spark" style={{ animationDelay: "0s" }}>!</div>
        <div className="absolute left-[62%] top-[22%] text-red-300 text-base font-black animate-spark" style={{ animationDelay: "0.4s" }}>!</div>
        <div className="absolute left-[50%] top-[24%] text-amber-300 text-sm animate-spark" style={{ animationDelay: "0.8s" }}>{"\u2605"}</div>
      </div>

      {/* ====== RIGHT: VAR room ====== */}
      <div className="absolute right-0 top-0 bottom-0 w-[31%] z-10 flex items-center justify-center">
        <div className="relative w-[92%]">
          {/* VAR room panel */}
          <div className="rounded-2xl border border-purple-400/20 bg-[#0d0820]/80 backdrop-blur-sm shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-3">

            {/* header bar */}
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-blink" />
                <span className="text-red-400 text-[9px] font-black tracking-[0.3em]">VAR ACTIVE</span>
              </div>
              <span className="text-purple-300/60 text-[8px] font-mono">54:22</span>
            </div>

            {/* main replay screen */}
            <div className="relative rounded-lg overflow-hidden bg-black border border-purple-400/30 mb-2"
                 style={{ aspectRatio: "16/9" }}>
              <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(90deg, #14532d 0 20px, #166534 20px 40px)" }} />
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="none">
                {/* field lines */}
                <rect x="4" y="4" width="312" height="172" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.4" />
                <line x1="4" y1="90" x2="316" y2="90" stroke="#fff" strokeWidth="1" opacity="0.4" />
                <circle cx="160" cy="90" r="30" fill="none" stroke="#fff" strokeWidth="1" opacity="0.4" />
                <rect x="4" y="60" width="50" height="60" fill="none" stroke="#fff" strokeWidth="1" opacity="0.4" />
                <rect x="266" y="60" width="50" height="60" fill="none" stroke="#fff" strokeWidth="1" opacity="0.4" />
                {/* left team · yellow + blue */}
                {[[80,70],[60,95],[80,115],[110,80],[110,100],[140,88]].map(([x,y],i) => (
                  <g key={`w${i}`}>
                    <circle cx={x} cy={y} r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
                    <circle cx={x} cy={y} r="2" fill="#1d4ed8" />
                  </g>
                ))}
                {/* opp team players */}
                {[[240,72],[260,90],[240,110],[210,82],[210,100],[180,90]].map(([x,y],i) => (
                  <g key={`o${i}`}>
                    <circle cx={x} cy={y} r="5" fill="#d946ef" stroke="#a21caf" strokeWidth="0.5" />
                    <circle cx={x} cy={y} r="2" fill="#fff" />
                  </g>
                ))}
                {/* referee · pale yellow + black */}
                <circle cx="160" cy="88" r="7" fill="#fef08a" stroke="#854d0e" strokeWidth="1" opacity="0.95" />
                <circle cx="160" cy="88" r="3" fill="#000" />
              </svg>
              {/* incident highlight ring */}
              <div className="absolute animate-var-ping"
                   style={{ left: "49%", top: "47%", width: 28, height: 28, marginLeft: -14, marginTop: -14, borderRadius: "50%", border: "2px solid #facc15", boxShadow: "0 0 16px rgba(234,179,8,0.6)" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-1.5 left-1.5 bg-amber-400 text-purple-950 text-[7px] font-black px-1.5 py-0.5 rounded tracking-widest">? REPLAY</div>
              <div className="absolute top-1.5 right-1.5 text-white/70 text-[7px] font-mono">CAM 3 · WIDE</div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-0.5 flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full w-[62%] bg-amber-400 rounded-full" />
                </div>
                <span className="text-white/60 text-[6px] font-mono">54:19</span>
              </div>
            </div>

            {/* 3 small angle screens */}
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {[
                { label: "CAM 1", active: false, players: [[30,40],[50,55],[70,38],[85,60],[45,70],[65,72]] },
                { label: "CAM 5", active: true,  players: [[25,45],[50,50],[72,42],[40,68],[60,65],[80,55]] },
                { label: "CAM 8", active: false, players: [[35,38],[55,52],[75,45],[42,65],[62,70],[78,60]] },
              ].map((cam) => (
                <div key={cam.label} className={`relative rounded overflow-hidden border ${cam.active ? "border-amber-400" : "border-purple-400/20"}`}
                     style={{ aspectRatio: "16/9" }}>
                  <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(90deg, #14532d 0 10px, #166534 10px 20px)" }} />
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 56" preserveAspectRatio="none">
                    <rect x="2" y="2" width="96" height="52" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.35" />
                    <line x1="2" y1="28" x2="98" y2="28" stroke="#fff" strokeWidth="0.6" opacity="0.3" />
                    {cam.players.slice(0,3).map(([x,y],i) => (
                      <g key={`w${i}`}>
                        <circle cx={x} cy={y} r="3" fill="#facc15" stroke="#ca8a04" strokeWidth="0.3" />
                        <circle cx={x} cy={y} r="1.2" fill="#1d4ed8" />
                      </g>
                    ))}
                    {cam.players.slice(3).map(([x,y],i) => (
                      <g key={`o${i}`}>
                        <circle cx={x} cy={y} r="3" fill="#d946ef" stroke="#a21caf" strokeWidth="0.3" />
                        <circle cx={x} cy={y} r="1.2" fill="#fff" />
                      </g>
                    ))}
                    {cam.active && <g><circle cx="50" cy="50" r="4" fill="#fef08a" stroke="#854d0e" strokeWidth="0.5" opacity="0.95" /><circle cx="50" cy="50" r="1.8" fill="#000" /></g>}
                  </svg>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-center py-0.5">
                    <span className={`text-[6px] font-mono font-bold ${cam.active ? "text-amber-300" : "text-white/50"}`}>{cam.label}</span>
                  </div>
                  {cam.active && <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 animate-blink" />}
                </div>
              ))}
            </div>

            {/* VAR decision banner */}
            <div className="rounded-lg bg-yellow-400/10 border border-yellow-400/40 px-3 py-2 flex items-center justify-between">
              <div>
                <div className="text-yellow-300/70 text-[8px] tracking-[0.3em] font-semibold">DECISION</div>
                <div className="text-white text-[11px] font-black mt-0.5">YELLOW CARD · CONFIRMED</div>
              </div>
              <div className="w-7 h-10 rounded-[2px] bg-gradient-to-b from-yellow-300 to-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.6)] flex-shrink-0" />
            </div>

            {/* VAR officials row */}
            <div className="mt-2 flex items-center gap-1.5 px-1">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60" />
              <span className="text-purple-300/50 text-[7px] font-mono tracking-widest">VAR: R.CATSWORTH · AVAR: M.PAWSON</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====== CENTER CARD ====== */}
      <div data-wc-center-card className="absolute inset-0 z-20 flex items-center justify-center px-4 pointer-events-none">
        <div className="w-[440px] max-w-[90vw] rounded-3xl bg-[#161029]/85 backdrop-blur-xl border border-purple-400/20 shadow-[0_30px_80px_-20px_rgba(168,85,247,0.5)] p-7 pointer-events-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 grid place-items-center text-purple-950 font-black text-2xl shadow-lg">
              {"\u{1F7E8}"}
            </div>
            <div>
              <div className="text-purple-300/70 text-[10px] tracking-[0.35em] font-semibold">MATCH · 54'</div>
              <div className="text-white text-2xl font-bold">VAR Review</div>
            </div>
          </div>

          <p className="mt-5 text-white/80 text-sm leading-relaxed">
            Play stopped for a VAR check · possible foul on <span className="text-amber-300">@whiskermessi</span> in the build-up. Referee reviewing pitchside monitor before final decision.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-purple-300/60 text-[9px] tracking-[0.3em]">MINUTE</div>
              <div className="text-white text-2xl font-black mt-1">54'</div>
            </div>
            <div className="rounded-xl bg-yellow-400/10 border border-yellow-400/30 p-3">
              <div className="text-yellow-300/70 text-[9px] tracking-[0.3em]">CARD</div>
              <div className="text-yellow-300 text-2xl font-black mt-1">{"\u{1F7E8}"}</div>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-purple-300/60 text-[9px] tracking-[0.3em]">REVIEW</div>
              <div className="text-emerald-400 text-2xl font-black mt-1">{"\u2713"}</div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-600/20 border border-yellow-400/30 p-3">
            <div className="text-yellow-200/70 text-[9px] tracking-[0.3em]">INCIDENT</div>
            <div className="text-white text-sm font-bold mt-0.5">Dangerous tackle · #9 WRP · Confirmed foul</div>
            <div className="text-purple-300/60 text-[10px] mt-1">Yellow card upheld after pitchside review</div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-purple-950 rounded-full px-3 py-1 text-[10px] font-black tracking-widest">
              <span>05</span><span>·</span><span>VAR</span>
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
        @keyframes card-glow { 0%,100%{opacity:.4} 50%{opacity:1} }
        .animate-card-glow { animation: card-glow 2s ease-in-out infinite; }
        @keyframes card-float { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-8px) rotate(-4deg)} }
        .animate-card-float { animation: card-float 2.2s ease-in-out infinite; }
        @keyframes spark { 0%,100%{opacity:0;transform:scale(0.5) translateY(0)} 50%{opacity:1;transform:scale(1.2) translateY(-6px)} }
        .animate-spark { animation: spark 1.4s ease-in-out infinite; }
        @keyframes var-ping { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.25);opacity:0.6} }
        .animate-var-ping { animation: var-ping 1.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default Slide5;




