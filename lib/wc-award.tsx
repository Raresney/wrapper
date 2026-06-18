"use client";

import React from "react";
import type { WrappedProfile } from "@/types/wrapped";

export type WcAwardId =
  | "golden_boot"
  | "golden_ball"
  | "golden_glove"
  | "best_young_player"
  | "captains_armband"
  | "tournament_mvp"
  | "man_of_the_match"
  | "fair_play_trophy"
  | "top_assist"
  | "comeback_award"
  | "free_kick_specialist"
  | "penalty_hero"
  | "hat_trick_hero"
  | "world_cup_champion"
  | "finals_performer"
  | "group_stage_winner";

export type WcAward = {
  id: WcAwardId;
  name: string;
  subtitle: string;
  color: string;
  glow: string;
  border: string;
  keyStat: (p: WrappedProfile) => string;
  speech_hint: string;
};

function ownedRepoCount(p: WrappedProfile): number {
  return p.raw.repos.filter((repo) => !repo.isFork).length;
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────

export function GoldenBootIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* shaft */}
      <rect x="14" y="10" width="14" height="30" rx="7" fill="currentColor" fillOpacity="0.9"/>
      {/* foot body extending right */}
      <path d="M14 34 L14 44 L52 44 C54 44 55 42 54 40 L46 36 L28 32 L20 34 Z"
            fill="currentColor" fillOpacity="0.9"/>
      {/* sole bar */}
      <rect x="14" y="43" width="38" height="6" rx="3" fill="currentColor" fillOpacity="0.55"/>
      {/* studs */}
      <circle cx="21" cy="53" r="2.5" fill="currentColor" fillOpacity="0.75"/>
      <circle cx="31" cy="53" r="2.5" fill="currentColor" fillOpacity="0.75"/>
      <circle cx="41" cy="53" r="2.5" fill="currentColor" fillOpacity="0.75"/>
      <circle cx="49" cy="53" r="2.5" fill="currentColor" fillOpacity="0.55"/>
      {/* lace detail */}
      <path d="M17 18 L25 18 M17 23 L25 23 M17 28 L25 28"
            stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

export function GoldenBallIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* outer sphere */}
      <circle cx="32" cy="32" r="24" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2.5"/>
      {/* top pentagon */}
      <polygon points="32,11 38,22 32,26 26,22" fill="currentColor" fillOpacity="0.85"/>
      {/* bottom pentagon */}
      <polygon points="32,37 39,43 36,53 28,53 25,43" fill="currentColor" fillOpacity="0.85"/>
      {/* left pentagon */}
      <polygon points="11,27 20,23 26,31 20,39 11,37" fill="currentColor" fillOpacity="0.7"/>
      {/* right pentagon */}
      <polygon points="53,27 44,23 38,31 44,39 53,37" fill="currentColor" fillOpacity="0.7"/>
      {/* top-left pentagon (partial) */}
      <polygon points="14,17 22,18 24,26 16,30" fill="currentColor" fillOpacity="0.5"/>
      {/* top-right pentagon (partial) */}
      <polygon points="50,17 42,18 40,26 48,30" fill="currentColor" fillOpacity="0.5"/>
      {/* seam lines */}
      <path d="M26 22 L20 23 M38 22 L44 23 M26 42 L20 39 M38 42 L44 39 M32 26 L32 37"
            stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
      {/* gloss */}
      <ellipse cx="24" cy="22" rx="4" ry="3" fill="white" fillOpacity="0.18" transform="rotate(-20 24 22)"/>
    </svg>
  );
}

export function GoldenGloveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* thumb */}
      <rect x="10" y="20" width="9" height="20" rx="4.5" fill="currentColor" fillOpacity="0.75"/>
      {/* palm */}
      <rect x="18" y="24" width="26" height="26" rx="6" fill="currentColor" fillOpacity="0.85"/>
      {/* index finger */}
      <rect x="22" y="10" width="8" height="18" rx="4" fill="currentColor" fillOpacity="0.85"/>
      {/* middle finger */}
      <rect x="32" y="8" width="8" height="20" rx="4" fill="currentColor" fillOpacity="0.85"/>
      {/* ring finger */}
      <rect x="38" y="12" width="7" height="16" rx="3.5" fill="currentColor" fillOpacity="0.8"/>
      {/* wrist / cuff */}
      <rect x="18" y="48" width="26" height="9" rx="4" fill="currentColor" fillOpacity="0.55"/>
      {/* knuckle line */}
      <path d="M22 26 L44 26" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
      {/* cuff strap */}
      <path d="M22 52 L40 52" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
    </svg>
  );
}

export function BestYoungPlayerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* speed lines (energy streaks going up-right) */}
      <path d="M8 52 L22 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
      <path d="M12 56 L28 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.2"/>
      {/* main star */}
      <path d="M32 6 L36 19 L50 19 L39 27 L43 41 L32 33 L21 41 L25 27 L14 19 L28 19 Z"
            fill="currentColor" fillOpacity="0.95"/>
      {/* small rising star accent */}
      <path d="M50 8 L51.5 13 L57 13 L52.7 16 L54.3 21 L50 18 L45.7 21 L47.3 16 L43 13 L48.5 13 Z"
            fill="currentColor" fillOpacity="0.65"/>
      {/* inner spark */}
      <circle cx="32" cy="24" r="3.2" fill="white" fillOpacity="0.22"/>
      <path d="M32 19.5V15.5M27.5 24H23.5M36.5 24H40.5"
            stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.4"/>
      {/* upward arrow below star */}
      <path d="M32 44 L32 56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M26 50 L32 44 L38 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5"/>
    </svg>
  );
}

export function CaptainsArmbandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* armband — wide curved band */}
      <path d="M8 20 C8 16 12 13 16 13 L48 13 C52 13 56 16 56 20 L56 44 C56 48 52 51 48 51 L16 51 C12 51 8 48 8 44 Z"
            fill="currentColor" fillOpacity="0.85"/>
      {/* inner highlight */}
      <path d="M12 20 C12 18 14 16 16 16 L48 16 C50 16 52 18 52 20 L52 44 C52 46 50 48 48 48 L16 48 C14 48 12 46 12 44 Z"
            fill="none" stroke="white" strokeWidth="1" opacity="0.2"/>
      {/* bold C letter */}
      <path d="M38 22 C34 22 28 25 28 32 C28 39 34 42 38 42"
            stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.95"/>
      {/* stripe accents */}
      <rect x="8" y="20" width="56" height="3" rx="0" fill="white" fillOpacity="0.08"/>
      <rect x="8" y="41" width="56" height="3" rx="0" fill="white" fillOpacity="0.08"/>
    </svg>
  );
}

export function TournamentMvpIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* left laurel branch */}
      <path d="M18 48 C10 42 8 34 12 26 C14 30 13 36 16 40 C15 34 17 28 22 22 C22 28 20 34 22 38 C22 32 25 26 30 22 C29 28 27 34 28 38"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.75"/>
      {/* right laurel branch (mirrored) */}
      <path d="M46 48 C54 42 56 34 52 26 C50 30 51 36 48 40 C49 34 47 28 42 22 C42 28 44 34 42 38 C42 32 39 26 34 22 C35 28 37 34 36 38"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.75"/>
      {/* bottom tie */}
      <path d="M20 50 C26 54 38 54 44 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
      {/* central star */}
      <path d="M32 10 L35 20 L46 20 L37.5 26.5 L40.5 37 L32 30.5 L23.5 37 L26.5 26.5 L18 20 L29 20 Z"
            fill="currentColor" fillOpacity="0.95"/>
      <circle cx="32" cy="24" r="3" fill="white" fillOpacity="0.18"/>
      <path d="M25 44 C28 46 36 46 39 44" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.35"/>
    </svg>
  );
}

export function ManOfTheMatchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* outer flame */}
      <path d="M32 8 C32 8 44 18 44 30 C44 44 38 54 32 58 C26 54 20 44 20 30 C20 18 32 8 32 8 Z"
            fill="currentColor" fillOpacity="0.85"/>
      {/* inner flame (slightly different shape) */}
      <path d="M32 20 C32 20 40 28 40 36 C40 44 36 50 32 52 C28 50 24 44 24 36 C24 28 32 20 32 20 Z"
            fill="currentColor" fillOpacity="0.45"/>
      {/* inner core (bright) */}
      <path d="M32 32 C32 32 36 36 36 40 C36 44 34 47 32 48 C30 47 28 44 28 40 C28 36 32 32 32 32 Z"
            fill="white" fillOpacity="0.35"/>
      {/* small top flicker */}
      <path d="M32 8 C29 12 28 16 30 20 C31 16 33 12 36 10 C34 8 33 7 32 8 Z"
            fill="currentColor" fillOpacity="0.65"/>
    </svg>
  );
}

export function FairPlayTrophyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* trophy cup */}
      <path d="M18 8 L46 8 L46 34 C46 44 40 50 32 52 C24 50 18 44 18 34 Z"
            fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
      {/* left handle */}
      <path d="M18 14 L10 14 C8 14 7 18 7 22 C7 26 9 28 12 27 L18 26"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* right handle */}
      <path d="M46 14 L54 14 C56 14 57 18 57 22 C57 26 55 28 52 27 L46 26"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* checkmark inside cup */}
      <path d="M22 29 L29 36 L43 20"
            stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* stem */}
      <path d="M32 52 L32 57" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
      {/* base */}
      <rect x="24" y="57" width="16" height="5" rx="2.5" fill="currentColor" fillOpacity="0.6"/>
    </svg>
  );
}

export function TopAssistIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* passer player */}
      <circle cx="13" cy="30" r="5.5" fill="currentColor" fillOpacity="0.82"/>
      <path d="M8 42 C8 37 10 34 13 34 C16 34 18 37 18 42"
            stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8"/>
      {/* receiver player */}
      <circle cx="51" cy="28" r="5.5" fill="currentColor" fillOpacity="0.68"/>
      <path d="M46 40 C46 35 48 32 51 32 C54 32 56 35 56 40"
            stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/>
      {/* ball */}
      <circle cx="31.5" cy="18.5" r="5.5" fill="currentColor" fillOpacity="0.92" stroke="white" strokeWidth="1.2" strokeOpacity="0.28"/>
      <path d="M31.5 13.8 L33 16.2 L31.5 18.7 L30 16.2 Z" fill="white" fillOpacity="0.26"/>
      {/* pass arcs */}
      <path d="M18 26 C23 16 27 13 29.5 15.5"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M37 18.5 C43 15 47 18.5 47.5 24.5"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M44.5 20.5 L47.5 24.5 L43.3 26.5"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* midfield line */}
      <path d="M7 47 L57 47" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.24"/>
    </svg>
  );
}

export function ComebackAwardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* downward section of path (the fall) */}
      <path d="M10 14 L24 44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.35"/>
      {/* upward comeback arc */}
      <path d="M24 44 C28 52 30 50 34 40 C38 30 42 10 54 8"
            stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      {/* arrowhead at top right */}
      <path d="M48 8 L54 8 L54 14"
            stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* low point dot */}
      <circle cx="24" cy="44" r="4.5" fill="currentColor" fillOpacity="0.7"/>
      {/* peak dot */}
      <circle cx="54" cy="8" r="4.5" fill="currentColor" fillOpacity="0.95"/>
      {/* rebound accents */}
      <path d="M18 20 L14 16 M21 26 L17 23"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.28"/>
      <path d="M33 39 C36 35 39 31 41 26"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.26"/>
      {/* base line */}
      <path d="M8 56 L56 56" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
    </svg>
  );
}

export function FreeKickSpecialistIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* ball */}
      <circle cx="10" cy="46" r="8" fill="currentColor" fillOpacity="0.9"/>
      {/* classic ball pentagon on top */}
      <path d="M10 40 L12 43 L10 46 L8 43 Z" fill="white" fillOpacity="0.3"/>
      {/* curved trajectory (dashed) */}
      <path d="M16 42 C22 28 30 16 40 14"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" fill="none"/>
      {/* wall — 3 player silhouettes */}
      <rect x="46" y="24" width="7" height="18" rx="3.5" fill="currentColor" fillOpacity="0.7"/>
      <rect x="54" y="26" width="7" height="16" rx="3.5" fill="currentColor" fillOpacity="0.55"/>
      <rect x="38" y="26" width="7" height="16" rx="3.5" fill="currentColor" fillOpacity="0.55"/>
      {/* wall heads */}
      <circle cx="49" cy="21" r="3.5" fill="currentColor" fillOpacity="0.7"/>
      <circle cx="57" cy="22" r="3.5" fill="currentColor" fillOpacity="0.55"/>
      <circle cx="41" cy="22" r="3.5" fill="currentColor" fillOpacity="0.55"/>
      {/* ground */}
      <path d="M6 56 L60 56" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.25"/>
    </svg>
  );
}

export function PenaltyHeroIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* goal frame — two posts and crossbar */}
      <rect x="8" y="12" width="48" height="38" rx="2"
            stroke="currentColor" strokeWidth="3" fill="none"/>
      {/* goal net lines (horizontal) */}
      <line x1="8" y1="22" x2="56" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.25"/>
      <line x1="8" y1="32" x2="56" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.25"/>
      <line x1="8" y1="42" x2="56" y2="42" stroke="currentColor" strokeWidth="1" opacity="0.25"/>
      {/* target crosshair in center */}
      <circle cx="32" cy="28" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.9"/>
      <circle cx="32" cy="28" r="4" fill="currentColor" fillOpacity="0.95"/>
      <line x1="32" y1="14" x2="32" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      <line x1="32" y1="34" x2="32" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <line x1="14" y1="28" x2="20" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      <line x1="44" y1="28" x2="54" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      {/* keeper dive hint */}
      <path d="M18 46 C22 42 25 42 29 45"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.22"/>
      <circle cx="22" cy="42.5" r="2.2" fill="currentColor" fillOpacity="0.18"/>
      {/* penalty spot */}
      <circle cx="32" cy="58" r="3" fill="currentColor" fillOpacity="0.7"/>
    </svg>
  );
}

export function HatTrickHeroIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* top large star */}
      <path d="M32 6 L35 16 L46 16 L37.5 22.5 L40.5 33 L32 26.5 L23.5 33 L26.5 22.5 L18 16 L29 16 Z"
            fill="currentColor" fillOpacity="0.95"/>
      {/* bottom-left star */}
      <path d="M15 36 L17 43 L24 43 L18.5 47.5 L20.5 54 L15 50 L9.5 54 L11.5 47.5 L6 43 L13 43 Z"
            fill="currentColor" fillOpacity="0.8"/>
      {/* bottom-right star */}
      <path d="M49 36 L51 43 L58 43 L52.5 47.5 L54.5 54 L49 50 L43.5 54 L45.5 47.5 L40 43 L47 43 Z"
            fill="currentColor" fillOpacity="0.8"/>
      {/* connecting swoosh */}
      <path d="M20 33 L32 38 L44 33"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35"/>
      <circle cx="32" cy="20" r="3" fill="white" fillOpacity="0.16"/>
      <path d="M16 32 C22 28 26 27 32 29 C38 27 42 28 48 32"
            stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.22"/>
    </svg>
  );
}

export function WorldCupChampionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* trophy cup body */}
      <path d="M18 8 L46 8 L44 32 C44 40 38 46 32 48 C26 46 20 40 20 32 Z"
            fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2.5"/>
      {/* left handle */}
      <path d="M20 12 L10 12 C8 14 8 22 12 26 C14 28 18 28 20 26"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* right handle */}
      <path d="M44 12 L54 12 C56 14 56 22 52 26 C50 28 46 28 44 26"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* stem */}
      <rect x="29" y="48" width="6" height="8" rx="2" fill="currentColor" fillOpacity="0.7"/>
      {/* base plate */}
      <rect x="20" y="56" width="24" height="6" rx="3" fill="currentColor" fillOpacity="0.65"/>
      {/* inner detail — globe hint */}
      <circle cx="32" cy="28" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <path d="M32 18 L32 38 M22 28 L42 28" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
      <path d="M25 21 C27 26 27 30 25 35 M39 21 C37 26 37 30 39 35" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
    </svg>
  );
}

export function FinalsPerformerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* medal circle */}
      <circle cx="32" cy="36" r="20" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="3"/>
      {/* inner medal circle */}
      <circle cx="32" cy="36" r="14" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
      {/* bold "1" inside medal */}
      <path d="M30 28 L34 26 L34 46" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M28 46 L36 46" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      {/* ribbon left */}
      <path d="M22 18 L18 6 L26 10 L28 18"
            fill="currentColor" fillOpacity="0.7" stroke="none"/>
      {/* ribbon right */}
      <path d="M42 18 L46 6 L38 10 L36 18"
            fill="currentColor" fillOpacity="0.7" stroke="none"/>
      {/* ribbon clasp */}
      <rect x="26" y="16" width="12" height="6" rx="2" fill="currentColor" fillOpacity="0.55"/>
      <circle cx="32" cy="36" r="5" fill="white" fillOpacity="0.12"/>
    </svg>
  );
}

export function GroupStageWinnerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* 4 team boxes — left column, evenly spaced within viewBox */}
      <rect x="4" y="5"  width="14" height="9" rx="2.5" fill="currentColor" fillOpacity="0.7"/>
      <rect x="4" y="19" width="14" height="9" rx="2.5" fill="currentColor" fillOpacity="0.7"/>
      <rect x="4" y="36" width="14" height="9" rx="2.5" fill="currentColor" fillOpacity="0.6"/>
      <rect x="4" y="50" width="14" height="9" rx="2.5" fill="currentColor" fillOpacity="0.6"/>
      {/* semi-final boxes */}
      <rect x="24" y="11" width="14" height="9" rx="2.5" fill="currentColor" fillOpacity="0.75"/>
      <rect x="24" y="44" width="14" height="9" rx="2.5" fill="currentColor" fillOpacity="0.65"/>
      {/* winner box */}
      <rect x="44" y="25" width="16" height="14" rx="4" fill="currentColor" fillOpacity="0.9"/>
      {/* bracket lines — top half */}
      <path d="M18 9.5 L21 9.5 M18 23.5 L21 23.5 L21 15.5 L24 15.5"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
      {/* bracket lines — bottom half */}
      <path d="M18 40.5 L21 40.5 M18 54.5 L21 54.5 L21 48.5 L24 48.5"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45"/>
      {/* bracket lines — semis to final */}
      <path d="M38 15.5 L41 15.5 L41 32 L44 32 M38 48.5 L41 48.5 L41 32"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.55"/>
      {/* star in winner box */}
      <path d="M52 26.5 L53 29.8 L56.5 29.8 L53.8 31.8 L54.8 35.1 L52 33.1 L49.2 35.1 L50.2 31.8 L47.5 29.8 L51 29.8 Z"
            fill="white" fillOpacity="0.92"/>
      <path d="M7 9.5h8M7 23.5h8M7 40.5h8M7 54.5h8M27 15.5h8M27 48.5h8"
            stroke="white" strokeWidth="0.9" strokeLinecap="round" opacity="0.18"/>
    </svg>
  );
}

// ── Icon map ──────────────────────────────────────────────────────────────────

const ICON_MAP: Record<WcAwardId, React.FC<{ className?: string }>> = {
  golden_boot:         GoldenBootIcon,
  golden_ball:         GoldenBallIcon,
  golden_glove:        GoldenGloveIcon,
  best_young_player:   BestYoungPlayerIcon,
  captains_armband:    CaptainsArmbandIcon,
  tournament_mvp:      TournamentMvpIcon,
  man_of_the_match:    ManOfTheMatchIcon,
  fair_play_trophy:    FairPlayTrophyIcon,
  top_assist:          TopAssistIcon,
  comeback_award:      ComebackAwardIcon,
  free_kick_specialist: FreeKickSpecialistIcon,
  penalty_hero:        PenaltyHeroIcon,
  hat_trick_hero:      HatTrickHeroIcon,
  world_cup_champion:  WorldCupChampionIcon,
  finals_performer:    FinalsPerformerIcon,
  group_stage_winner:  GroupStageWinnerIcon,
};

export function AwardIcon({ id, className }: { id: WcAwardId; className?: string }) {
  const Icon = ICON_MAP[id];
  return <Icon className={className} />;
}

// ── Award metadata ────────────────────────────────────────────────────────────

export const AWARDS: Record<WcAwardId, WcAward> = {
  golden_boot: {
    id: "golden_boot",
    name: "Golden Boot",
    subtitle: "Tournament Top Scorer",
    color: "#facc15",
    glow: "rgba(250,204,21,0.55)",
    border: "rgba(250,204,21,0.35)",
    keyStat: (p) => `${p.metrics.totalCommits.toLocaleString()} total contributions`,
    speech_hint: "most total contributions of any developer in the tournament",
  },
  golden_ball: {
    id: "golden_ball",
    name: "Golden Ball",
    subtitle: "Best Player of the Tournament",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.55)",
    border: "rgba(245,158,11,0.35)",
    keyStat: (p) =>
      `${p.metrics.totalCommits.toLocaleString()} commits · ${p.raw.totalStarsReceived} ★ · ${p.metrics.streak.longestStreak}d streak`,
    speech_hint: "most complete and balanced developer — excels in volume, impact, and consistency simultaneously",
  },
  golden_glove: {
    id: "golden_glove",
    name: "Golden Glove",
    subtitle: "Best Goalkeeper",
    color: "#fde68a",
    glow: "rgba(253,230,138,0.55)",
    border: "rgba(253,230,138,0.35)",
    keyStat: (p) => `${p.raw.totalStarsReceived.toLocaleString()} stars received`,
    speech_hint: "most stars received — developers around the world trust and rely on their code",
  },
  best_young_player: {
    id: "best_young_player",
    name: "Best Young Player",
    subtitle: "The Emerging Talent",
    color: "#34d399",
    glow: "rgba(52,211,153,0.55)",
    border: "rgba(52,211,153,0.35)",
    keyStat: (p) =>
      `${(p.metrics.githubAge / 365).toFixed(1)} yrs on GitHub · ${p.metrics.totalCommits.toLocaleString()} contributions`,
    speech_hint: "youngest highly active developer in the tournament — a future legend in the making",
  },
  captains_armband: {
    id: "captains_armband",
    name: "Captain's Armband",
    subtitle: "The Veteran Leader",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.55)",
    border: "rgba(96,165,250,0.35)",
    keyStat: (p) => `${Math.round(p.metrics.githubAge / 365)} years on GitHub`,
    speech_hint: "longest-serving and most experienced developer — a true captain of the coding pitch",
  },
  tournament_mvp: {
    id: "tournament_mvp",
    name: "Tournament MVP",
    subtitle: "Most Valuable Player",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.55)",
    border: "rgba(167,139,250,0.35)",
    keyStat: (p) =>
      `${p.metrics.topRepo.stargazersCount.toLocaleString()} ★ on ${p.metrics.topRepo.name}`,
    speech_hint: "single most impactful repository in the entire tournament — their project became a legend",
  },
  man_of_the_match: {
    id: "man_of_the_match",
    name: "Man of the Match",
    subtitle: "Longest Unbeaten Run",
    color: "#f97316",
    glow: "rgba(249,115,22,0.55)",
    border: "rgba(249,115,22,0.35)",
    keyStat: (p) => `${p.metrics.streak.longestStreak}-day contribution streak`,
    speech_hint: "longest contribution streak in the tournament — did not miss a single day on the pitch",
  },
  fair_play_trophy: {
    id: "fair_play_trophy",
    name: "Fair Play Trophy",
    subtitle: "Cleanest Game on the Pitch",
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.55)",
    border: "rgba(34,211,238,0.35)",
    keyStat: (p) => {
      const cs = p.raw.commitStats;
      if (!cs || cs.sampleSize === 0) return "clean, disciplined codebase";
      const ratio = Math.round(((cs.fix + cs.refactor + cs.docs) / cs.sampleSize) * 100);
      return `${ratio}% clean commits (fix · refactor · docs)`;
    },
    speech_hint:
      "most disciplined developer — highest proportion of fix, refactor, and documentation commits",
  },
  top_assist: {
    id: "top_assist",
    name: "Top Assist Award",
    subtitle: "Greatest Team Player",
    color: "#4ade80",
    glow: "rgba(74,222,128,0.55)",
    border: "rgba(74,222,128,0.35)",
    keyStat: (p) => `${p.raw.totalForksReceived.toLocaleString()} times their code was forked`,
    speech_hint:
      "most forks received — developers worldwide built upon their work like a world-class playmaker",
  },
  comeback_award: {
    id: "comeback_award",
    name: "Comeback of the Year",
    subtitle: "Greatest Resurgence",
    color: "#f472b6",
    glow: "rgba(244,114,182,0.55)",
    border: "rgba(244,114,182,0.35)",
    keyStat: (p) => `+${Math.min(Math.round(p.metrics.growthDelta.deltaPercent), 9999)}% growth vs previous period`,
    speech_hint:
      "most dramatic improvement — came back from behind and dominated the second half of the season",
  },
  free_kick_specialist: {
    id: "free_kick_specialist",
    name: "Free Kick Specialist",
    subtitle: "Master of New Features",
    color: "#fb923c",
    glow: "rgba(251,146,60,0.55)",
    border: "rgba(251,146,60,0.35)",
    keyStat: (p) => {
      const cs = p.raw.commitStats;
      if (!cs || cs.sampleSize === 0) return "feature-driven developer";
      return `${Math.round((cs.feat / cs.sampleSize) * 100)}% of commits are new features`;
    },
    speech_hint:
      "highest proportion of feature commits — always scoring with creative, offensive play",
  },
  penalty_hero: {
    id: "penalty_hero",
    name: "Penalty Hero",
    subtitle: "Ice in the Veins",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.55)",
    border: "rgba(129,140,248,0.35)",
    keyStat: (p) => `${Math.round(p.metrics.scores.consistencyScore)} consistency score`,
    speech_hint: "most consistent developer — never misses, never falters, always delivers under pressure",
  },
  hat_trick_hero: {
    id: "hat_trick_hero",
    name: "Hat-Trick Hero",
    subtitle: "Explosive Single-Day Performance",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.55)",
    border: "rgba(251,191,36,0.35)",
    keyStat: (p) => {
      const maxDay = p.raw.contributions.reduce((max, c) => Math.max(max, c.count), 0);
      return `${maxDay} contributions in a single day`;
    },
    speech_hint:
      "scored the most contributions in a single day — a hat-trick performance the crowd will never forget",
  },
  world_cup_champion: {
    id: "world_cup_champion",
    name: "World Cup Champion",
    subtitle: "The Complete Winner",
    color: "#e2c45a",
    glow: "rgba(226,196,90,0.6)",
    border: "rgba(226,196,90,0.4)",
    keyStat: (p) => {
      const epic = p.achievements.filter(
        (a) => a.unlocked && (a.rarity === "legendary" || a.rarity === "epic"),
      ).length;
      return `${epic} legendary & epic achievements unlocked`;
    },
    speech_hint: "most legendary and epic achievements unlocked — the complete package, winner of everything",
  },
  finals_performer: {
    id: "finals_performer",
    name: "Finals Performer",
    subtitle: "Best in the Knockout Stage",
    color: "#e2e8f0",
    glow: "rgba(226,232,240,0.4)",
    border: "rgba(226,232,240,0.25)",
    keyStat: (p) => {
      const cutoff = new Date(`${p.period.endDate}T00:00:00Z`);
      cutoff.setUTCDate(cutoff.getUTCDate() - 90);
      const cutStr = cutoff.toISOString().slice(0, 10);
      const recent = p.raw.contributions
        .filter((c) => c.date >= cutStr)
        .reduce((s, c) => s + c.count, 0);
      return `${recent.toLocaleString()} contributions in the final 90 days`;
    },
    speech_hint:
      "most contributions in the last 90 days — saved their best performance for when it mattered most",
  },
  group_stage_winner: {
    id: "group_stage_winner",
    name: "Group Stage Winner",
    subtitle: "Most Dominant Squad Builder",
    color: "#a3e635",
    glow: "rgba(163,230,53,0.55)",
    border: "rgba(163,230,53,0.35)",
    keyStat: (p) => `${ownedRepoCount(p)} owned repositories`,
    speech_hint:
      "most owned repositories — built the largest squad, dominating every group they entered",
  },
};

// ── Scoring ───────────────────────────────────────────────────────────────────
// Each scorer is normalised so that a "good but not extreme" performance ≈ 1.0.
// The award with the highest score wins.
// githubAge is in DAYS (see lib/analyzer.ts line 477).

type Scorer = (p: WrappedProfile) => number;

const SCORERS: [WcAwardId, Scorer][] = [
  // Golden Boot — pure commit volume (500 commits = 1.0)
  ["golden_boot", (p) => p.metrics.totalCommits / 500],

  // Golden Ball — balanced across 3 axes; geometric mean collapses when any axis is weak
  // Requires commits ≥ 200, stars ≥ 30, streak ≥ 10 to activate
  ["golden_ball", (p) => {
    const c = Math.min(p.metrics.totalCommits / 400, 4);
    const s = Math.min(p.raw.totalStarsReceived / 60, 4);
    const str = Math.min(p.metrics.streak.longestStreak / 20, 4);
    if (c < 0.3 || s < 0.3 || str < 0.3) return 0;
    return Math.pow(c * s * str, 1 / 3) * 0.88; // slight penalty to avoid it dominating
  }],

  // Golden Glove — stars as trust/impact (60 stars = 1.0)
  ["golden_glove", (p) => p.raw.totalStarsReceived / 60],

  // Best Young Player — exclusive: account < 3 yrs (1095 days), scaled by intensity
  ["best_young_player", (p) => {
    const ageDays = p.metrics.githubAge;
    if (ageDays >= 3 * 365) return 0;
    const youth = (3 * 365 - ageDays) / (3 * 365);
    return youth * (p.metrics.scores.intensityScore / 40) * 2.2;
  }],

  // Captain's Armband — seniority (5 years = 1825 days = 1.0)
  ["captains_armband", (p) => p.metrics.githubAge / (5 * 365)],

  // Tournament MVP — single repo star impact (40 stars = 1.0)
  ["tournament_mvp", (p) => p.metrics.topRepo.stargazersCount / 40],

  // Man of the Match — longest streak (25 days = 1.0)
  ["man_of_the_match", (p) => p.metrics.streak.longestStreak / 25],

  // Fair Play Trophy — clean commit ratio (requires ≥10 sample; 22% clean ratio = 1.0)
  ["fair_play_trophy", (p) => {
    const cs = p.raw.commitStats;
    if (!cs || cs.sampleSize < 10) return 0;
    return ((cs.fix + cs.refactor + cs.docs) / cs.sampleSize) * 4.5;
  }],

  // Top Assist — forks received (20 forks = 1.0)
  ["top_assist", (p) => p.raw.totalForksReceived / 20],

  // Comeback — positive growth delta only; must be > 15% to activate (150% = 1.0, capped at 3.0)
  ["comeback_award", (p) => {
    const d = p.metrics.growthDelta.deltaPercent;
    return d > 15 ? Math.min(d / 50, 3.0) : 0;
  }],

  // Free Kick Specialist — feature commit ratio (requires ≥10 sample; 15% feat = 1.0)
  ["free_kick_specialist", (p) => {
    const cs = p.raw.commitStats;
    if (!cs || cs.sampleSize < 10) return 0;
    return (cs.feat / cs.sampleSize) * 6.5;
  }],

  // Penalty Hero — consistency score (60 = 1.0)
  ["penalty_hero", (p) => p.metrics.scores.consistencyScore / 60],

  // Hat-trick Hero — peak single-day commits (15 in one day = 1.0)
  ["hat_trick_hero", (p) => {
    if (p.raw.contributions.length === 0) return 0;
    return p.raw.contributions.reduce((max, c) => Math.max(max, c.count), 0) / 15;
  }],

  // World Cup Champion — epic + legendary achievements (3 = 1.0)
  ["world_cup_champion", (p) => {
    const count = p.achievements.filter(
      (a) => a.unlocked && (a.rarity === "legendary" || a.rarity === "epic"),
    ).length;
    return count / 3;
  }],

  // Finals Performer — last 90 days of the analyzed period (200 contributions = 1.0)
  ["finals_performer", (p) => {
    const cutoff = new Date(`${p.period.endDate}T00:00:00Z`);
    cutoff.setUTCDate(cutoff.getUTCDate() - 90);
    const cutStr = cutoff.toISOString().slice(0, 10);
    const recent = p.raw.contributions
      .filter((c) => c.date >= cutStr)
      .reduce((s, c) => s + c.count, 0);
    return recent / 200;
  }],

  // Group Stage Winner — repo count (20 repos = 1.0)
  ["group_stage_winner", (p) => ownedRepoCount(p) / 20],
];

export function determineAward(profile: WrappedProfile): WcAward {
  let bestId: WcAwardId = "golden_boot";
  let bestScore = -Infinity;

  for (const [id, scorer] of SCORERS) {
    try {
      const score = scorer(profile);
      if (score > bestScore) {
        bestScore = score;
        bestId = id;
      }
    } catch {
      // skip broken scorer
    }
  }

  return AWARDS[bestId];
}
