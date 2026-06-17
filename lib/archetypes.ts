import type {
  CalculatedMetrics,
  GitHubRawData,
  ArchetypeId,
  ArchetypeWeight,
  ArchetypeBlend,
} from "@/types/wrapped";

const ARCHETYPE_LABELS: Record<ArchetypeId, string> = {
  foundry: "Foundry",
  afterglow: "Afterglow",
  trail_mapper: "Trail Mapper",
  cartographer: "Systems Cartographer",
  silent_current: "Silent Current",
  signal_booster: "Signal Booster",
  anvil: "Anvil",
  chaos_pilot: "Chaos Pilot",
  flashpoint: "Flashpoint",
  constellation_weaver: "Constellation Weaver",
  caretaker: "Caretaker",
  deep_diver: "Deep Diver",
  archive_keeper: "Archive Keeper",
  lone_orbit: "Lone Orbit",
};

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

function daysBetween(a: string, b: string): number {
  return Math.abs((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

function ratioPct(num: number, den: number): number {
  return den > 0 ? (num / den) * 100 : 0;
}

function scoreArchetypes(
  data: GitHubRawData,
  metrics: CalculatedMetrics
): Record<ArchetypeId, number> {
  const {
    scores,
    streak,
    hourBias,
    activeDays,
    growthDelta,
    repoSpread,
    topRepo,
    languageEntropy,
    githubAge,
  } = metrics;

  const totalDays = Math.max(1, daysBetween(data.period.startDate, data.period.endDate));
  const totalRepos = data.repos.filter((r) => !r.isFork).length;
  const mergedPrs = data.pullRequests.filter((pr) => pr.state === "merged").length;
  const topLanguageShare = data.languages[0]?.percentage ?? 0;
  const languageCount = data.languages.length;
  const fixRatio = ratioPct(data.commitStats?.fix ?? 0, data.commitStats?.sampleSize ?? 0);
  const refactorRatio = ratioPct(data.commitStats?.refactor ?? 0, data.commitStats?.sampleSize ?? 0);
  const docsRatio = ratioPct(data.commitStats?.docs ?? 0, data.commitStats?.sampleSize ?? 0);
  const choreRatio = ratioPct(data.commitStats?.chore ?? 0, data.commitStats?.sampleSize ?? 0);
  const inactiveRatio = 1 - (activeDays.totalDays / totalDays);
  const sixMonthsAgo = new Date(data.period.endDate);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const abandoned = data.repos.filter(
    (r) => !r.isFork && r.stargazersCount === 0 && new Date(r.pushedAt) < sixMonthsAgo
  ).length;
  const ageYears = githubAge / 365;

  const foundry = clamp(
    scores.intensityScore * 0.42 +
    scores.consistencyScore * 0.28 +
    Math.min(repoSpread / 8, 1) * 16 +
    Math.min(totalRepos / 18, 1) * 14,
    0, 100
  );

  const afterglow = clamp(
    scores.nocturnalScore * 0.85 +
    (hourBias.isNocturnal ? 18 : 0) +
    (hourBias.peakHour <= 3 || hourBias.peakHour >= 23 ? 8 : 0),
    0, 100
  );

  const trail_mapper = clamp(
    scores.explorerScore * 0.62 +
    Math.min(repoSpread / 12, 1) * 22 +
    Math.min(languageCount / 8, 1) * 16,
    0, 100
  );

  const cartographer = clamp(
    scores.focusScore * 0.56 +
    Math.min(topRepo.stargazersCount / 20, 1) * 18 +
    Math.max(0, 100 - scores.explorerScore) * 0.18 +
    Math.max(0, topLanguageShare - 45) * 0.24,
    0, 100
  );

  const silent_current = clamp(
    inactiveRatio * 72 +
    (streak.currentStreak === 0 ? 16 : 0) +
    (activeDays.totalDays <= Math.max(8, totalDays * 0.12) ? 12 : 0),
    0, 100
  );

  const signal_booster = clamp(
    scores.openSourceScore * 0.62 +
    Math.min(data.totalStarsReceived / 120, 1) * 18 +
    Math.min(data.totalForksReceived / 40, 1) * 10 +
    Math.min(mergedPrs / 30, 1) * 10 +
    Math.min(data.user.followersCount / 180, 1) * 10,
    0, 100
  );

  const anvil = clamp(
    scores.consistencyScore * 0.52 +
    Math.min(streak.longestStreak / 90, 1) * 28 +
    Math.min(activeDays.totalDays / Math.max(30, totalDays * 0.7), 1) * 20,
    0, 100
  );

  const chaos_pilot = clamp(
    Math.min(abandoned / 5, 1) * 42 +
    Math.min(repoSpread / 12, 1) * 26 +
    Math.min(languageCount / 7, 1) * 14 +
    Math.max(0, 55 - scores.focusScore) * 0.32,
    0, 100
  );

  const flashpoint = clamp(
    Math.min(Math.max(growthDelta.deltaPercent, 0) / 120, 1) * 44 +
    scores.intensityScore * 0.3 +
    (growthDelta.trend === "up" ? 14 : 0) +
    Math.min(streak.currentStreak / 14, 1) * 12,
    0, 100
  );

  const constellation_weaver = clamp(
    Math.min(mergedPrs / 35, 1) * 44 +
    scores.openSourceScore * 0.2 +
    Math.min(data.totalForksReceived / 18, 1) * 12 +
    Math.min(data.user.followersCount / 120, 1) * 12 +
    Math.min(data.totalStarsReceived / 80, 1) * 12,
    0, 100
  );

  const caretaker = clamp(
    Math.min(fixRatio / 28, 1) * 24 +
    Math.min(refactorRatio / 24, 1) * 22 +
    Math.min((docsRatio + choreRatio) / 28, 1) * 18 +
    scores.consistencyScore * 0.18 +
    Math.min(ageYears / 7, 1) * 18,
    0, 100
  );

  const deep_diver = clamp(
    Math.max(0, topLanguageShare - 55) * 0.95 +
    scores.focusScore * 0.42 +
    Math.max(0, 1 - languageEntropy) * 26 +
    (languageCount <= 3 ? 10 : 0),
    0, 100
  );

  const archive_keeper = clamp(
    Math.min(ageYears / 10, 1) * 46 +
    Math.min(totalRepos / 25, 1) * 14 +
    Math.min(streak.longestStreak / 120, 1) * 18 +
    Math.min(data.totalStarsReceived / 180, 1) * 12 +
    Math.min(data.user.followersCount / 250, 1) * 10,
    0, 100
  );

  const lone_orbit = clamp(
    Math.min(metrics.totalCommits / 1500, 1) * 28 +
    Math.min(topLanguageShare / 85, 1) * 12 +
    scores.focusScore * 0.32 +
    Math.max(0, 1 - Math.min(mergedPrs / 8, 1)) * 18 +
    (mergedPrs <= 3 ? 10 : 0),
    0, 100
  );

  return {
    foundry,
    afterglow,
    trail_mapper,
    cartographer,
    silent_current,
    signal_booster,
    anvil,
    chaos_pilot,
    flashpoint,
    constellation_weaver,
    caretaker,
    deep_diver,
    archive_keeper,
    lone_orbit,
  };
}

export function calculateArchetypeBlend(
  data: GitHubRawData,
  metrics: CalculatedMetrics
): ArchetypeBlend {
  const raw = scoreArchetypes(data, metrics);

  const ranked = (Object.entries(raw) as [ArchetypeId, number][])
    .sort((a, b) => b[1] - a[1]);

  const top3 = ranked.slice(0, 3);
  const total = top3.reduce((s, [, v]) => s + v, 0) || 1;

  const weights = top3.map(([, score]) =>
    Math.round((score / total) * 100)
  );
  const drift = 100 - weights.reduce((s, w) => s + w, 0);
  weights[0] += drift;

  const toWeight = (index: number): ArchetypeWeight => ({
    id: top3[index][0],
    label: ARCHETYPE_LABELS[top3[index][0]],
    weight: weights[index],
  });

  const primary = toWeight(0);
  const secondary = top3[1][1] >= 20 ? toWeight(1) : null;
  const tertiary = secondary && top3[2][1] >= 15 ? toWeight(2) : null;

  const label =
    secondary === null
      ? `The ${primary.label}`
      : `${primary.label} x ${secondary.label}`;

  return { primary, secondary, tertiary, label };
}
