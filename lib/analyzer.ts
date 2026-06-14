import type {
  GitHubRawData,
  GitHubRepo,
  Contribution,
  CalculatedMetrics,
  StreakData,
  HourBias,
  ActiveDays,
  Scores,
  GrowthDelta,
  Achievement,
  AchievementId,
  LanguageStats,
  Period,
} from "@/types/wrapped";

// --- Utilities ---

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

function daysBetween(a: string, b: string): number {
  return Math.abs((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

function getWeekNumber(date: string): string {
  const d = new Date(date);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86_400_000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-${String(week).padStart(2, "0")}`;
}

function formatHour(h: number): string {
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function isoToDay(d: string): string {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
    new Date(d).getDay()
  ];
}

// --- Sub-functions ---

function calcStreak(contributions: Contribution[]): StreakData {
  const active = new Set(contributions.filter((c) => c.count > 0).map((c) => c.date));
  if (!active.size) return { currentStreak: 0, longestStreak: 0, lastActiveDate: "" };

  const sorted = [...active].sort();
  const lastActiveDate = sorted.at(-1)!;

  let currentStreak = 0;
  const cur = new Date(lastActiveDate);
  while (active.has(cur.toISOString().slice(0, 10))) {
    currentStreak++;
    cur.setDate(cur.getDate() - 1);
  }

  let longestStreak = 0, run = 0;
  for (let i = 0; i < sorted.length; i++) {
    const gap =
      i === 0
        ? 0
        : (new Date(sorted[i]).getTime() - new Date(sorted[i - 1]).getTime()) / 86_400_000;
    run = gap === 1 ? run + 1 : 1;
    if (run > longestStreak) longestStreak = run;
  }

  return { currentStreak, longestStreak, lastActiveDate };
}

function calcHourBias(contributions: Contribution[]): HourBias {
  const dist = Array<number>(24).fill(0);
  for (const c of contributions) if (c.hour >= 0 && c.hour <= 23) dist[c.hour] += c.count;
  const total = dist.reduce((a, b) => a + b, 0);
  if (!total) return { peakHour: 12, peakHourLabel: "12 PM", isNocturnal: false, distributionByHour: dist };
  const peakHour = dist.indexOf(Math.max(...dist));
  return {
    peakHour,
    peakHourLabel: formatHour(peakHour),
    isNocturnal: peakHour >= 22 || peakHour <= 5,
    distributionByHour: dist,
  };
}

function calcActiveDays(contributions: Contribution[], period: Period): ActiveDays {
  const active = contributions.filter((c) => c.count > 0);
  const unique = [...new Set(active.map((c) => c.date))];
  const activeSet = new Set(unique);

  const dayTotals: Record<string, number> = {};
  for (const c of active) {
    const day = isoToDay(c.date);
    dayTotals[day] = (dayTotals[day] ?? 0) + c.count;
  }

  const weekdayCount = unique.filter((d) => {
    const n = new Date(d).getDay();
    return n >= 1 && n <= 5;
  }).length;
  const mostActiveDayOfWeek =
    Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Monday";

  const weekends = new Map<string, boolean>();
  const end = new Date(period.endDate);
  for (let d = new Date(period.startDate); d <= end; d.setDate(d.getDate() + 1)) {
    const n = d.getDay();
    if (n === 0 || n === 6) {
      const iso = d.toISOString().slice(0, 10);
      const key = n === 0 ? iso : new Date(d.getTime() + 86_400_000).toISOString().slice(0, 10);
      if (!weekends.has(key)) weekends.set(key, false);
      if (activeSet.has(iso)) weekends.set(key, true);
    }
  }

  return {
    totalDays: unique.length,
    weekdayCount,
    weekendCount: unique.length - weekdayCount,
    weekendWarrior: weekends.size > 0 && [...weekends.values()].every(Boolean),
    mostActiveDayOfWeek,
  };
}

function calcGrowthDelta(contributions: Contribution[], period: Period): GrowthDelta {
  const mid = new Date(
    (new Date(period.startDate).getTime() + new Date(period.endDate).getTime()) / 2
  )
    .toISOString()
    .slice(0, 10);
  let prev = 0, curr = 0;
  for (const c of contributions) {
    if (c.date < mid) prev += c.count;
    else curr += c.count;
  }
  const deltaPercent = Math.round(((curr - prev) / Math.max(prev, 1)) * 1000) / 10;
  const trend: GrowthDelta["trend"] = deltaPercent > 5 ? "up" : deltaPercent < -5 ? "down" : "flat";
  return { previousPeriodCommits: prev, currentPeriodCommits: curr, deltaPercent, trend };
}

function calcLanguageEntropy(languages: LanguageStats[]): number {
  if (languages.length <= 1) return 0;
  const ps = languages.map((l) => l.percentage / 100).filter((p) => p > 0);
  const entropy = -ps.reduce((s, p) => s + p * Math.log2(p), 0);
  return clamp(entropy / Math.log2(languages.length), 0, 1);
}

function findTopRepo(repos: GitHubRepo[], contributions: Contribution[]): GitHubRepo {
  const counts: Record<string, number> = {};
  for (const c of contributions) counts[c.repoName] = (counts[c.repoName] ?? 0) + c.count;
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  return (
    repos.find((r) => r.name === top) ??
    repos.slice().sort((a, b) => b.stargazersCount - a.stargazersCount)[0] ?? {
      name: "", description: null, language: null, stargazersCount: 0,
      forksCount: 0, isPrivate: false, createdAt: "", pushedAt: "", isFork: false,
    }
  );
}

function calcScores(
  data: GitHubRawData,
  streak: StreakData,
  activeDays: ActiveDays,
  growthDelta: GrowthDelta,
  languageEntropy: number,
  repoSpread: number
): Scores {
  const INTENSITY_NORM = 365, STK_BOOST = 15, DAY_BOOST = 10, DAY_THRESH = 20;
  const CURR_STK_THRESH = 7, CONS_BOOST = 10, CONS_PEN = 10;
  const LANG_THRESH = 5, SPREAD_THRESH = 8, EXP_BOOST = 10;
  const FOCUS_BOOST = 15, FOCUS_THRESH = 0.7, OS_MAX = 200;

  const total = data.contributions.reduce((s, c) => s + c.count, 0);
  const periodDays = Math.max(1, daysBetween(data.period.startDate, data.period.endDate));

  const dateTotals = data.contributions.reduce<Record<string, number>>(
    (a, c) => { a[c.date] = (a[c.date] ?? 0) + c.count; return a; }, {}
  );
  const maxDay = Math.max(0, ...Object.values(dateTotals));

  let intensity = (total / INTENSITY_NORM) * 100;
  if (streak.longestStreak > 30) intensity += STK_BOOST;
  if (maxDay > DAY_THRESH) intensity += DAY_BOOST;
  const intensityScore = clamp(Math.round(intensity), 0, 100);

  let consistency = (activeDays.totalDays / periodDays) * 100;
  if (streak.currentStreak > CURR_STK_THRESH) consistency += CONS_BOOST;
  if (growthDelta.trend === "down") consistency -= CONS_PEN;
  const consistencyScore = clamp(Math.round(consistency), 0, 100);

  const nocturnal = data.contributions
    .filter((c) => c.hour >= 22 || c.hour <= 5)
    .reduce((s, c) => s + c.count, 0);
  const nocturnalScore = total === 0 ? 0 : clamp(Math.round((nocturnal / total) * 100), 0, 100);

  let explorer = languageEntropy * 100;
  if (data.languages.length >= LANG_THRESH) explorer += EXP_BOOST;
  if (repoSpread >= SPREAD_THRESH) explorer += EXP_BOOST;
  const explorerScore = clamp(Math.round(explorer), 0, 100);

  const repoCounts = data.contributions.reduce<Record<string, number>>(
    (a, c) => { a[c.repoName] = (a[c.repoName] ?? 0) + c.count; return a; }, {}
  );
  const topRepoRatio = total === 0 ? 0 : Math.max(0, ...Object.values(repoCounts)) / total;
  let focus = 100 - explorerScore;
  if (topRepoRatio > FOCUS_THRESH) focus += FOCUS_BOOST;
  const focusScore = clamp(Math.round(focus), 0, 100);

  const mergedPRs = data.pullRequests.filter((pr) => pr.state === "merged").length;
  const osBase = data.totalStarsReceived * 3 + data.totalForksReceived * 5 + mergedPRs * 2;
  const openSourceScore = clamp(Math.round((Math.min(osBase, OS_MAX) / OS_MAX) * 100), 0, 100);

  return { intensityScore, consistencyScore, nocturnalScore, explorerScore, focusScore, openSourceScore };
}

// --- Achievements ---

type AchievementDef = {
  id: AchievementId;
  emoji: string;
  label: string;
  description: string;
  check: (data: GitHubRawData, metrics: CalculatedMetrics) => string | null;
};

const ACHIEVEMENT_DEFINITIONS: AchievementDef[] = [
  {
    id: "night_owl", emoji: "N", label: "Night Owl", description: "50+ commits after midnight",
    check: (data) => {
      const n = data.contributions.filter((c) => c.hour >= 0 && c.hour <= 5).reduce((s, c) => s + c.count, 0);
      return n >= 50 ? `${n} commits after midnight` : null;
    },
  },
  {
    id: "on_fire", emoji: "F", label: "On Fire", description: "7+ day contribution streak",
    check: (_, m) => m.streak.currentStreak >= 7 ? `${m.streak.currentStreak} day streak` : null,
  },
  {
    id: "polyglot", emoji: "P", label: "Polyglot", description: "Used 3+ programming languages",
    check: (data) => data.languages.length >= 3 ? `${data.languages.length} languages used` : null,
  },
  {
    id: "weekend_warrior", emoji: "W", label: "Weekend Warrior", description: "Committed every weekend",
    check: (_, m) => m.activeDays.weekendWarrior ? "Committed every weekend" : null,
  },
  {
    id: "speed_demon", emoji: "S", label: "Speed Demon", description: "20+ commits in a single day",
    check: (data) => {
      const totals: Record<string, number> = {};
      for (const c of data.contributions) totals[c.date] = (totals[c.date] ?? 0) + c.count;
      const [date, count] = Object.entries(totals).sort((a, b) => b[1] - a[1])[0] ?? ["", 0];
      return count >= 20 ? `${count} commits in one day on ${date}` : null;
    },
  },
  {
    id: "architect", emoji: "A", label: "Architect", description: "Active in 5+ repos simultaneously",
    check: (data) => {
      const n = new Set(data.contributions.filter((c) => c.count > 0).map((c) => c.repoName)).size;
      return n >= 5 ? `${n} repos active simultaneously` : null;
    },
  },
  {
    id: "consistent", emoji: "C", label: "Consistent", description: "Contributions every week",
    check: (data) => {
      const weeks = Math.max(1, Math.ceil(daysBetween(data.period.startDate, data.period.endDate) / 7));
      const active = new Set(data.contributions.filter((c) => c.count > 0).map((c) => getWeekNumber(c.date)));
      return active.size >= weeks ? "Contributions every week" : null;
    },
  },
  {
    id: "midnight_coder", emoji: "M", label: "Midnight Coder", description: "Coded between midnight and 4 AM",
    check: (data) =>
      data.contributions.some((c) => c.count > 0 && c.hour >= 0 && c.hour <= 4)
        ? "Coded between midnight and 4 AM"
        : null,
  },
  {
    id: "open_source_hero", emoji: "O", label: "Open Source Hero", description: "10+ stars received",
    check: (data) => data.totalStarsReceived >= 10 ? `${data.totalStarsReceived} stars received` : null,
  },
  {
    id: "graveyard_keeper", emoji: "G", label: "Graveyard Keeper", description: "Maintaining a forgotten repo",
    check: (data) => {
      const cutoff = new Date(data.period.endDate);
      cutoff.setFullYear(cutoff.getFullYear() - 1);
      const repo = data.repos.find((r) => !r.isFork && r.stargazersCount === 0 && new Date(r.pushedAt) < cutoff);
      return repo ? `Keeping ${repo.name} alive since ${new Date(repo.pushedAt).getFullYear()}` : null;
    },
  },
];

// --- Exported functions ---

export function calculateMetrics(data: GitHubRawData): CalculatedMetrics {
  const streak = calcStreak(data.contributions);
  const hourBias = calcHourBias(data.contributions);
  const activeDays = calcActiveDays(data.contributions, data.period);
  const growthDelta = calcGrowthDelta(data.contributions, data.period);
  const languageEntropy = calcLanguageEntropy(data.languages);
  const repoSpread = new Set(
    data.contributions.filter((c) => c.count > 0).map((c) => c.repoName)
  ).size;
  const scores = calcScores(data, streak, activeDays, growthDelta, languageEntropy, repoSpread);
  const topRepo = findTopRepo(data.repos, data.contributions);
  const firstContributionDate =
    data.contributions
      .filter((c) => c.count > 0)
      .map((c) => c.date)
      .sort()[0] ?? "";
  const githubAge = Math.floor(daysBetween(data.user.accountCreatedAt, data.period.endDate));

  return {
    totalCommits: data.contributions.reduce((s, c) => s + c.count, 0),
    streak,
    hourBias,
    activeDays,
    scores,
    growthDelta,
    topRepo,
    languageEntropy,
    repoSpread,
    firstContributionDate,
    githubAge,
  };
}

export function calculateAchievements(
  data: GitHubRawData,
  metrics: CalculatedMetrics
): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map((def) => {
    const reason = def.check(data, metrics);
    return {
      id: def.id,
      emoji: def.emoji,
      label: def.label,
      description: def.description,
      unlocked: reason !== null,
      unlockedReason: reason,
    };
  });
}
