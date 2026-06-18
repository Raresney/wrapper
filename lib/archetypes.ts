import type {
  CalculatedMetrics,
  GitHubRawData,
  ArchetypeId,
  ArchetypeWeight,
  ArchetypeBlend,
} from "@/types/wrapped";

// Per-archetype description pools, split into 3 tiers by primary weight.
// hi  → weight ≥ 55%  (archetype is dominant)
// mid → weight 38–54% (clear but blended)
// lo  → weight < 38%  (trace — uncertain identity)
// Multiple strings per tier so two runs of the same user can differ.
type ArchetypePool = { hi: string[]; mid: string[]; lo: string[] };

const ARCHETYPE_DESCRIPTIONS: Record<ArchetypeId, ArchetypePool> = {
  foundry: {
    hi: [
      "Production-grade output, running hot. You don't ship features — you build the factory that ships features.",
      "The codebase doesn't grow, it accumulates. High output, wide scope, no visible off switch.",
    ],
    mid: [
      "Part of your energy runs foundry-mode — raw volume, multiple repos, no sign of coasting.",
      "The output is real and the spread is wide. Not everything is finished, but it was all started with intent.",
    ],
    lo: [
      "There's a foundry tendency in the data — higher output than average, even if it's not the whole story.",
      "A push toward volume and breadth shows up in the numbers, even if it doesn't dominate them.",
    ],
  },
  afterglow: {
    hi: [
      "You don't code by day — you code when the world goes quiet. The timestamps don't lie.",
      "The commit log reads like a second shift nobody scheduled. You own the hours after dark.",
    ],
    mid: [
      "Night skews your data. Not all your best work happens at noon, and the activity log agrees.",
      "The late hours pull you in more than most. Whether by choice or habit, the pattern is consistent.",
    ],
    lo: [
      "There's a nocturnal pull in the data — not the whole picture, but enough to show up clearly.",
      "A few late-night sessions skew the pattern. Not defining, but not coincidental either.",
    ],
  },
  trail_mapper: {
    hi: [
      "You don't pick a lane. Every language is terrain worth crossing, every repo a new heading.",
      "Wide coverage, loose borders, always moving. The map keeps expanding because you keep drawing it.",
    ],
    mid: [
      "The explorer's instinct shows — more languages, more repos, more surface covered than most.",
      "You drift toward new territory. The breadth is real even if the depth varies.",
    ],
    lo: [
      "There's a roaming quality here, but the range is still finding itself.",
      "Some exploratory pulls in the data — variety over specialisation, at least for now.",
    ],
  },
  cartographer: {
    hi: [
      "One thing, deeply understood. You chart the territory no one else goes back to fix.",
      "Focused is an understatement. Your repo carries everything, and you know every line of it.",
    ],
    mid: [
      "The tendency to settle and go deep is visible. Not scattered — just deliberate about where attention lands.",
      "A clear center of gravity runs through the work. You keep returning to the same ground.",
    ],
    lo: [
      "You have a center of gravity — it just hasn't fully taken hold yet.",
      "Some focus shows in the data, but the pull toward depth is still competing with other directions.",
    ],
  },
  silent_current: {
    hi: [
      "Quiet doesn't mean absent. Your commits arrive like tides — unpredictable, then suddenly there.",
      "The activity log is sparse, but the gaps have texture. You work in bursts, not rhythms.",
    ],
    mid: [
      "Not every developer needs daily commits. You show up in longer waves, and the work is real when it arrives.",
      "The cadence is irregular, but irregular isn't the same as inactive. The pattern holds its own logic.",
    ],
    lo: [
      "There are stretches of quiet in the data, though they don't define the whole run.",
      "Some silent stretches show up in the log, mixed with periods of real output.",
    ],
  },
  signal_booster: {
    hi: [
      "Your work reverberates. Stars, forks, followers — the feedback loop is real and wide.",
      "You attract momentum. The numbers aren't just yours — they're proof other people noticed.",
    ],
    mid: [
      "There's signal in your output that reaches past the immediate codebase.",
      "More visibility than most — stars, forks, and followers all point to work that lands beyond the source.",
    ],
    lo: [
      "A few data points suggest your work lands outside your own orbit. Worth watching.",
      "Some external traction shows in the numbers. Not dominant yet, but it's there.",
    ],
  },
  anvil: {
    hi: [
      "Consistency isn't a method for you — it's the whole point. The streak speaks for itself.",
      "The data shows sustained, deliberate work with almost no visible gaps. That's rare.",
    ],
    mid: [
      "There's a reliable rhythm here. Not the loudest output, but among the most consistent.",
      "The streak and the active day count tell the same story: you kept showing up.",
    ],
    lo: [
      "Flashes of real consistency show up, even if the pattern isn't fully locked in.",
      "Some anvil traits in the data — steadier than average, at least in stretches.",
    ],
  },
  chaos_pilot: {
    hi: [
      "Too many repos, too many directions, not enough follow-through — and somehow it still works.",
      "The breadth is undeniable. Focus may have been optional, but the coverage was real.",
    ],
    mid: [
      "A restless energy runs through the work — multiple lanes, variable finish rates, no clear centre.",
      "The spread is wide and the attention moves fast. Some of it landed, some of it didn't.",
    ],
    lo: [
      "Some scattered impulses in the data. The chaos is there, just not the whole picture.",
      "A bit of the pilot energy shows — more variety than average, fewer things brought fully home.",
    ],
  },
  flashpoint: {
    hi: [
      "You went from background to trajectory. The momentum curve is sharp and still pointing up.",
      "Recent output has a velocity the earlier numbers didn't suggest. Something clicked.",
    ],
    mid: [
      "Growth shows up in the data — more recent, more focused, more frequent than the period before.",
      "The trend is clear: output has been accelerating, and the gap between now and then is visible.",
    ],
    lo: [
      "An uptick is visible in the recent data. Whether it's a trend or a spike is still unclear.",
      "Some growth signal in the numbers — recent activity running hotter than the baseline.",
    ],
  },
  constellation_weaver: {
    hi: [
      "You build with other people in mind. Merged PRs, stars, forks — your work spreads because it was meant to.",
      "The collaboration signature is clear. You don't just push — you pull people in.",
    ],
    mid: [
      "More PRs, more cross-repo visibility than most. You play well with others and the data shows it.",
      "The collaborative pull is real — more merged PRs, more traction from the outside than average.",
    ],
    lo: [
      "Some collaborative markers in the data. The network is small but real.",
      "A few data points suggest the work extends outward — not a defining trait yet, but it's building.",
    ],
  },
  caretaker: {
    hi: [
      "You fix what others ignore, refactor what nobody wanted to touch, and document what deserved it years ago.",
      "The commit messages tell the story: more fixes, more refactors, more care per line than raw output.",
    ],
    mid: [
      "The maintainer instinct is there — more polish than raw creation, more precision than velocity.",
      "Fix commits, refactors, cleanup work — the data reflects someone who cares what the codebase looks like after.",
    ],
    lo: [
      "A few cleanup commits in the mix. The ironsmith tendency is present, if not dominant.",
      "Some maintainer traits show up in the commit breakdown — more care than average, even if it's not the lead story.",
    ],
  },
  deep_diver: {
    hi: [
      "One language, deep. You're not exploring — you're excavating.",
      "You didn't choose a stack, you committed to one. Everything else is just visits.",
    ],
    mid: [
      "The language distribution is stark. You chose your tool and mostly stopped looking at the alternatives.",
      "A dominant language shapes the work in ways that go beyond preference — it shapes how problems get framed.",
    ],
    lo: [
      "There's a gravitational pull toward a single stack, though the grip isn't total yet.",
      "One language keeps pulling you back more than the others. Not a monolith yet, but the lean is real.",
    ],
  },
  archive_keeper: {
    hi: [
      "This account is a record, not just a portfolio. The age and depth are inseparable.",
      "Years of consistent work leave a kind of sediment that newer accounts don't have. You can see it here.",
    ],
    mid: [
      "The longer arc of your GitHub history starts to show in the numbers.",
      "Account age, repo count, streak history — the veteran markers are stacking up.",
    ],
    lo: [
      "Some veteran markers in the data — not the defining story, but a visible thread through the run.",
      "The history is longer than most. It doesn't dominate the picture, but it shapes the edges.",
    ],
  },
  lone_orbit: {
    hi: [
      "You don't collaborate — you orbit. The work is yours, the direction is yours, the whole thing is solo by design.",
      "Low PRs, high focus, no visible team. This is one-person architecture, end to end.",
    ],
    mid: [
      "You trend toward solo work. Not isolated — just self-contained, with a clear preference for owning the whole thing.",
      "The PR count stays low and the focus stays personal. Independent by pattern, not just circumstance.",
    ],
    lo: [
      "The lone-orbit pull is subtle here — some independence in the approach, but not the whole pattern.",
      "A few lone-orbit signals in the data: lower collaboration markers, higher self-directedness than average.",
    ],
  },
};

function pickRand(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getArchetypeDescription(id: ArchetypeId, weight: number): string {
  const pool = ARCHETYPE_DESCRIPTIONS[id];
  if (weight >= 55) return pickRand(pool.hi);
  if (weight >= 38) return pickRand(pool.mid);
  return pickRand(pool.lo);
}

const ARCHETYPE_LABELS: Record<ArchetypeId, string> = {
  foundry: "Foundry",
  afterglow: "Afterglow",
  trail_mapper: "Crosswind",
  cartographer: "Bedrock",
  silent_current: "Silent Current",
  signal_booster: "Catalyst",
  anvil: "Anvil",
  chaos_pilot: "Chaos Pilot",
  flashpoint: "Flashpoint",
  constellation_weaver: "Constellation Weaver",
  caretaker: "Ironsmith",
  deep_diver: "Monolith",
  archive_keeper: "Old Growth",
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

  // ── 1. FOUNDRY — raw output volume + wide spread (NOT consistency)
  const foundry = clamp(
    scores.intensityScore * 0.44 +
    Math.min(metrics.totalCommits / 400, 1) * 24 +
    Math.min(repoSpread / 7, 1) * 18 +
    Math.min(totalRepos / 14, 1) * 14,
    0, 100
  );

  // ── 2. AFTERGLOW — nocturnal coder, late-night peak hours
  const afterglow = clamp(
    scores.nocturnalScore * 0.78 +
    (hourBias.isNocturnal ? 22 : 0) +
    (hourBias.peakHour >= 22 || hourBias.peakHour <= 3 ? 12 : 0) +
    (hourBias.peakHour >= 0 && hourBias.peakHour <= 5 ? 8 : 0),
    0, 100
  );

  // ── 3. TRAIL_MAPPER — breadth explorer, many languages + many repos
  const trail_mapper = clamp(
    scores.explorerScore * 0.52 +
    Math.min(languageCount / 5, 1) * 26 +
    Math.min(repoSpread / 9, 1) * 22,
    0, 100
  );

  // ── 4. CARTOGRAPHER — deep on one project, low repo spread, star repo
  //    Distinct from deep_diver: project focus vs. language focus
  const cartographer = clamp(
    scores.focusScore * 0.48 +
    Math.max(0, 65 - scores.explorerScore) * 0.32 +
    Math.min(topRepo.stargazersCount / 12, 1) * 18 +
    (totalRepos <= 4 ? 16 : totalRepos <= 7 ? 8 : 0),
    0, 100
  );

  // ── 5. SILENT_CURRENT — burst pattern: commits exist but very few active days
  //    Requires meaningful commit volume so truly inactive users don't win here
  const burstFactor = metrics.totalCommits >= 25 ? 1 : metrics.totalCommits / 25;
  const silent_current = clamp(
    inactiveRatio * 55 * burstFactor +
    (activeDays.totalDays <= Math.max(6, totalDays * 0.10) ? 20 : 0) +
    (streak.longestStreak <= 3 && metrics.totalCommits >= 15 ? 14 : 0) +
    (streak.currentStreak === 0 ? 10 : 0),
    0, 100
  );

  // ── 6. SIGNAL_BOOSTER — passive community impact: stars + forks (others use your code)
  //    Distinct from constellation_weaver: influence vs. active collaboration
  const signal_booster = clamp(
    Math.min(data.totalStarsReceived / 25, 1) * 38 +
    Math.min(data.totalForksReceived / 8, 1) * 26 +
    Math.min(data.user.followersCount / 40, 1) * 22 +
    (data.totalStarsReceived >= 3 ? 8 : 0) +
    (data.totalStarsReceived >= 15 ? 6 : 0),
    0, 100
  );

  // ── 7. ANVIL — sustained daily consistency, long streaks
  const anvil = clamp(
    scores.consistencyScore * 0.46 +
    Math.min(streak.longestStreak / 60, 1) * 30 +
    Math.min(activeDays.totalDays / Math.max(20, totalDays * 0.5), 1) * 24,
    0, 100
  );

  // ── 8. CHAOS_PILOT — scattered: many abandoned repos, many starts, low finish rate
  const chaos_pilot = clamp(
    Math.min(abandoned / 3, 1) * 36 +
    Math.min(repoSpread / 9, 1) * 24 +
    Math.min(languageCount / 5, 1) * 18 +
    Math.max(0, 50 - scores.focusScore) * 0.34 +
    (abandoned >= 2 ? 8 : 0),
    0, 100
  );

  // ── 9. FLASHPOINT — H2 clearly outpaces H1; even 50% growth = full first component
  const flashpoint = clamp(
    Math.min(Math.max(growthDelta.deltaPercent, 0) / 50, 1) * 44 +
    (growthDelta.trend === "up" ? 20 : 0) +
    scores.intensityScore * 0.22 +
    Math.min(streak.currentStreak / 8, 1) * 14,
    0, 100
  );

  // ── 10. CONSTELLATION_WEAVER — community builder: PRs + forks + followers
  //     forks received = others build on your code → valid weaver signal without PRs
  const constellation_weaver = clamp(
    Math.min(mergedPrs / 12, 1) * 40 +
    Math.min(data.totalForksReceived / 5, 1) * 28 +
    Math.min(data.user.followersCount / 30, 1) * 18 +
    Math.min(data.totalStarsReceived / 25, 1) * 10 +
    (mergedPrs >= 1 ? 8 : 0) +
    (mergedPrs >= 5 ? 4 : 0),
    0, 100
  );

  // ── 11. CARETAKER — maintainer: fix/refactor commits OR mature steady contributor
  //     Fallback distinct from anvil (consistency) and archive_keeper (age):
  //     needs moderate PRs + old-enough account + low public visibility
  const hasCommitStats = (data.commitStats?.sampleSize ?? 0) > 0;
  const caretaker = clamp(
    (hasCommitStats
      ? Math.min(fixRatio / 20, 1) * 32 +
        Math.min(refactorRatio / 16, 1) * 26 +
        Math.min((docsRatio + choreRatio) / 18, 1) * 16
      : Math.min(ageYears / 4, 1) * 24 +
        (mergedPrs >= 5 && mergedPrs <= 30 ? 22 : 0)
    ) +
    Math.min(ageYears / 5, 1) * 14 +
    scores.consistencyScore * 0.14 +
    (mergedPrs >= 2 && mergedPrs <= 25 ? 6 : 0),
    0, 100
  );

  // ── 12. DEEP_DIVER — mono-linguist: language concentration (NOT project focus)
  //     Distinct from cartographer: language identity vs. project identity
  const deep_diver = clamp(
    Math.max(0, topLanguageShare - 55) * 1.15 +
    (languageCount === 1 ? 22 : languageCount === 2 ? 12 : languageCount === 3 ? 5 : 0) +
    Math.max(0, 1 - languageEntropy) * 28 +
    scores.focusScore * 0.22,
    0, 100
  );

  // ── 13. ARCHIVE_KEEPER — veteran: long GitHub history, accumulated depth
  //     Lowered thresholds: 5 years = full score (was 10)
  const archive_keeper = clamp(
    Math.min(ageYears / 5, 1) * 44 +
    Math.min(totalRepos / 14, 1) * 18 +
    Math.min(streak.longestStreak / 60, 1) * 16 +
    Math.min(data.totalStarsReceived / 60, 1) * 12 +
    Math.min(data.user.followersCount / 80, 1) * 10,
    0, 100
  );

  // ── 14. LONE_ORBIT — PRODUCTIVE solo developer: isolation × actual work output
  //     soloProductivity prevents low-activity users from defaulting here;
  //     a prolific dev (500+ commits) will be beaten by foundry/trail_mapper
  const soloProductivity  = Math.min(metrics.totalCommits / 150, 1);
  const prIsolation       = Math.max(0, 1 - Math.min(mergedPrs / 6, 1));
  const followerIsolation = Math.max(0, 1 - Math.min(data.user.followersCount / 20, 1));
  const lone_orbit = clamp(
    prIsolation * 38 * soloProductivity +
    followerIsolation * 16 +
    (mergedPrs === 0 && metrics.totalCommits >= 20 ? 12 : 0) +
    Math.max(0, 1 - Math.min(data.totalForksReceived / 4, 1)) * 10 +
    scores.focusScore * 0.20,
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
