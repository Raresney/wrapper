import type {
  CalculatedMetrics,
  GitHubRawData,
  Achievement,
  Insight,
  InsightId,
  SelectedInsights,
} from "@/types/wrapped";

const RARITY_COMMON = 0.25;
const RARITY_UNCOMMON = 0.5;
const RARITY_RARE = 0.75;
const RARITY_LEGENDARY = 1.0;

function rarityLabel(score: number): Insight["rarity"] {
  if (score >= 1.0) return "legendary";
  if (score >= 0.7) return "rare";
  if (score >= 0.4) return "uncommon";
  return "common";
}

function makeInsight(
  id: InsightId,
  value: string | number,
  intensity: number,
  rarityFactor: number,
  confidence: number,
  noveltyBonus: number,
  emotionBonus: number
): Insight {
  const importanceScore = intensity * rarityFactor * confidence;
  const finalScore = importanceScore + noveltyBonus + emotionBonus;
  return {
    id,
    value,
    importanceScore,
    noveltyBonus,
    emotionBonus,
    finalScore,
    rarity: rarityLabel(finalScore),
    confidence,
  };
}

function scoreAllInsights(data: GitHubRawData, metrics: CalculatedMetrics): Insight[] {
  const { streak, hourBias, activeDays, scores, growthDelta, githubAge, repoSpread } = metrics;

  const dateTotals = data.contributions.reduce<Record<string, number>>(
    (a, c) => { a[c.date] = (a[c.date] ?? 0) + c.count; return a; },
    {}
  );
  const maxDayCommits = Math.max(0, ...Object.values(dateTotals));

  const longestStreak = streak.longestStreak;
  const streakRarity =
    longestStreak > 100 ? RARITY_LEGENDARY
    : longestStreak > 30 ? RARITY_RARE
    : longestStreak > 7 ? RARITY_UNCOMMON
    : RARITY_COMMON;

  const nocturnalScore = scores.nocturnalScore;
  const nocturnalRarity =
    nocturnalScore > 70 ? RARITY_RARE : nocturnalScore > 40 ? RARITY_UNCOMMON : RARITY_COMMON;

  const langCount = data.languages.length;
  const langRarity =
    langCount >= 7 ? RARITY_RARE : langCount >= 4 ? RARITY_UNCOMMON : RARITY_COMMON;

  const maxDayRarity =
    maxDayCommits > 30 ? RARITY_LEGENDARY
    : maxDayCommits > 20 ? RARITY_RARE
    : maxDayCommits > 10 ? RARITY_UNCOMMON
    : RARITY_COMMON;

  const stars = data.totalStarsReceived;
  const starsRarity =
    stars > 50 ? RARITY_LEGENDARY : stars > 10 ? RARITY_RARE : stars > 2 ? RARITY_UNCOMMON : RARITY_COMMON;

  const consistencyScore = scores.consistencyScore;
  const consistencyRarity =
    consistencyScore > 80 ? RARITY_RARE : consistencyScore > 50 ? RARITY_UNCOMMON : RARITY_COMMON;

  const absDelta = Math.abs(growthDelta.deltaPercent);
  const deltaRarity =
    absDelta > 100 ? RARITY_LEGENDARY
    : absDelta > 50 ? RARITY_RARE
    : absDelta > 20 ? RARITY_UNCOMMON
    : RARITY_COMMON;

  const ageRarity =
    githubAge > 3000 ? RARITY_LEGENDARY
    : githubAge > 1825 ? RARITY_RARE
    : githubAge > 730 ? RARITY_UNCOMMON
    : RARITY_COMMON;

  const spreadRarity =
    repoSpread > 15 ? RARITY_RARE : repoSpread > 7 ? RARITY_UNCOMMON : RARITY_COMMON;

  return [
    makeInsight(
      "longest_streak", longestStreak,
      Math.min(longestStreak / 365, 1), streakRarity, 1.0,
      longestStreak > 30 ? 0.15 : 0.05,
      longestStreak > 7 ? 0.1 : 0
    ),
    makeInsight(
      "nocturnal_peak", hourBias.peakHourLabel,
      nocturnalScore / 100, nocturnalRarity, 0.9,
      hourBias.isNocturnal ? 0.15 : 0,
      hourBias.isNocturnal ? 0.1 : 0
    ),
    makeInsight(
      "polyglot_spread", langCount,
      Math.min(langCount / 10, 1), langRarity, 1.0,
      metrics.languageEntropy > 0.7 ? 0.2 : 0.05,
      0.05
    ),
    makeInsight(
      "speed_demon_day", maxDayCommits,
      Math.min(maxDayCommits / 50, 1), maxDayRarity, 1.0,
      maxDayCommits > 20 ? 0.2 : 0,
      maxDayCommits > 20 ? 0.15 : 0
    ),
    makeInsight(
      "open_source_impact", stars,
      Math.min(stars / 100, 1), starsRarity, 0.95,
      stars > 10 ? 0.2 : 0.05,
      stars > 5 ? 0.15 : 0.05
    ),
    makeInsight(
      "consistency_ratio", activeDays.totalDays,
      consistencyScore / 100, consistencyRarity, 1.0,
      0.05,
      consistencyScore > 80 ? 0.1 : 0
    ),
    makeInsight(
      "weekend_warrior", String(activeDays.weekendWarrior),
      activeDays.weekendWarrior ? 0.8 : 0.1,
      activeDays.weekendWarrior ? RARITY_RARE : RARITY_COMMON, 1.0,
      activeDays.weekendWarrior ? 0.1 : 0,
      activeDays.weekendWarrior ? 0.1 : 0
    ),
    makeInsight(
      "growth_delta", growthDelta.deltaPercent,
      Math.min(absDelta / 100, 1), deltaRarity, 0.85,
      growthDelta.trend === "up" && absDelta > 50 ? 0.15 : 0,
      growthDelta.trend === "up" ? 0.1 : growthDelta.trend === "down" ? 0.05 : 0
    ),
    makeInsight(
      "github_age", githubAge,
      Math.min(githubAge / 3650, 1), ageRarity, 1.0,
      githubAge > 3000 ? 0.1 : 0.02,
      0.1
    ),
    makeInsight(
      "repo_spread", repoSpread,
      Math.min(repoSpread / 20, 1), spreadRarity, 0.9,
      repoSpread > 10 ? 0.1 : 0,
      0
    ),
  ];
}

function achievementToInsight(a: Achievement): Insight {
  const rarityFactor =
    a.rarity === "legendary" || a.rarity === "epic" ? RARITY_LEGENDARY
    : a.rarity === "rare" ? RARITY_RARE
    : a.rarity === "uncommon" ? RARITY_UNCOMMON
    : RARITY_COMMON;
  const importanceScore = Math.min(a.importance / 100, 1) * rarityFactor;
  const noveltyBonus = a.rarity === "legendary" || a.rarity === "epic" ? 0.15 : 0.05;
  const emotionBonus = a.rarity === "legendary" ? 0.2 : a.rarity === "epic" ? 0.1 : 0.05;
  const finalScore = importanceScore + noveltyBonus + emotionBonus;
  return {
    id: a.id,
    value: a.unlockedReason ?? a.label,
    importanceScore,
    noveltyBonus,
    emotionBonus,
    finalScore,
    rarity: rarityLabel(finalScore),
    confidence: 1.0,
  };
}

export function selectInsights(
  data: GitHubRawData,
  metrics: CalculatedMetrics,
  achievements: Achievement[]
): SelectedInsights {
  const all = scoreAllInsights(data, metrics).sort((a, b) => b.finalScore - a.finalScore);

  const topInsight = all[0];
  const rest = all.slice(1);
  const narrativeTop3 = rest.slice(0, 3);
  const mainStoryArc = narrativeTop3.reduce(
    (best, cur) => (cur.emotionBonus > best.emotionBonus ? cur : best),
    narrativeTop3[0]
  );

  const achievementsTop3 = achievements
    .filter((a) => a.unlocked)
    .map(achievementToInsight)
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, 3);

  return { topInsight, narrativeTop3, achievementsTop3, mainStoryArc };
}
