import type {
  CalculatedMetrics,
  GitHubRawData,
  ArchetypeId,
  ArchetypeWeight,
  ArchetypeBlend,
} from "@/types/wrapped";

const ARCHETYPE_LABELS: Record<ArchetypeId, string> = {
  builder: "Builder",
  night_owl: "Night Owl",
  explorer: "Explorer",
  architect: "Architect",
  ghost: "Ghost",
  open_source_hero: "Open Source Hero",
  grinder: "Grinder",
  chaotic_builder: "Chaotic Builder",
};

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

function daysBetween(a: string, b: string): number {
  return Math.abs((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

function scoreArchetypes(
  data: GitHubRawData,
  metrics: CalculatedMetrics
): Record<ArchetypeId, number> {
  const { scores, streak, hourBias, activeDays, repoSpread, topRepo } = metrics;
  const totalDays = Math.max(1, daysBetween(data.period.startDate, data.period.endDate));

  const builder = Math.round(
    scores.intensityScore * 0.4 +
    scores.consistencyScore * 0.4 +
    Math.min(repoSpread / 10, 1) * 20
  );

  const night_owl = clamp(
    scores.nocturnalScore + (hourBias.isNocturnal ? 20 : 0),
    0, 100
  );

  const explorer = clamp(
    scores.explorerScore + (data.languages.length >= 5 ? 15 : 0),
    0, 100
  );

  const architect = clamp(
    scores.focusScore + (topRepo.stargazersCount > 5 ? 10 : 0),
    0, 100
  );

  const inactiveRatio = 1 - (activeDays.totalDays / totalDays);
  const ghost = clamp(
    inactiveRatio * 60 + (streak.currentStreak === 0 ? 20 : 0),
    0, 100
  );

  const open_source_hero = clamp(
    scores.openSourceScore + (data.totalStarsReceived > 10 ? 15 : 0),
    0, 100
  );

  const grinder = clamp(
    scores.consistencyScore * 0.6 + (streak.longestStreak / 365) * 40,
    0, 100
  );

  const sixMonthsAgo = new Date(data.period.endDate);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const abandoned = data.repos.filter(
    (r) => r.stargazersCount === 0 && new Date(r.pushedAt) < sixMonthsAgo
  ).length;
  const chaotic_builder = clamp(
    Math.min(abandoned / 5, 1) * 60 + (repoSpread > 10 ? 20 : 0),
    0, 100
  );

  return { builder, night_owl, explorer, architect, ghost, open_source_hero, grinder, chaotic_builder };
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
  // Correct rounding drift so weights sum to exactly 100
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
