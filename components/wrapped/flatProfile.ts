import type { WrappedProfile } from "@/types/wrapped";

export type FlatProfile = {
  username: string;
  avatarUrl: string;
  bio?: string;
  period: { label: string; startDate: string; endDate: string };
  totalCommits: number;
  longestStreak: number;
  currentStreak: number;
  peakHour: number;
  topLanguages: { name: string; percentage: number; color: string }[];
  topRepos: { name: string; commits: number }[];
  pullRequests: { opened: number; merged: number; reviewed: number };
  totalRepos: number;
  nightCommits: number;
  weekendCommits: number;
  fixCommits: number;
  firstCommitDate: string;
  mostProductiveDay: { date: string; commits: number };
  collaborators: { username: string; avatarUrl?: string }[];
  archetype: string;
  narrative: string;
  linesAdded: number;
  linesDeleted: number;
  filesChanged: number;
  mostActiveMonth: string;
  commitsByHour: number[];
  commitsByWeekday: Record<string, number>;
  commitsByMonth: number[];
};

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function mapToFlat(p: WrappedProfile): FlatProfile {
  const byRepo: Record<string, number> = {};
  const byHour = Array(24).fill(0) as number[];
  const byDay: Record<string, number> = { Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0, Sun:0 };
  const byDate: Record<string, number> = {};
  const byMonth: number[] = Array(12).fill(0);
  let nightCommits = 0;
  let weekendCommits = 0;

  for (const c of p.raw.contributions) {
    byRepo[c.repoName] = (byRepo[c.repoName] || 0) + c.count;
    byHour[c.hour] = (byHour[c.hour] || 0) + c.count;
    byDate[c.date] = (byDate[c.date] || 0) + c.count;
    const d = new Date(c.date);
    const dayKey = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];
    byDay[dayKey] = (byDay[dayKey] || 0) + c.count;
    byMonth[d.getMonth()] += c.count;
    if (c.hour < 5) nightCommits += c.count;
    if (d.getDay() === 0 || d.getDay() === 6) weekendCommits += c.count;
  }

  const topRepos = Object.entries(byRepo)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, commits]) => ({ name, commits }));

  const mostProdEntry = Object.entries(byDate).sort((a, b) => b[1] - a[1])[0] ?? ["", 0];
  const hotMonthIdx = byMonth.indexOf(Math.max(...byMonth));
  const merged = p.raw.pullRequests.filter(pr => pr.state === "merged").length;
  const opened = p.raw.pullRequests.length;

  return {
    username: p.user.login,
    avatarUrl: p.user.avatarUrl,
    bio: p.user.bio ?? undefined,
    period: { label: p.period.label, startDate: p.period.startDate, endDate: p.period.endDate },
    totalCommits: p.metrics.totalCommits,
    longestStreak: p.metrics.streak.longestStreak,
    currentStreak: p.metrics.streak.currentStreak,
    peakHour: p.metrics.hourBias.peakHour,
    topLanguages: p.raw.languages.map(l => ({ name: l.language, percentage: l.percentage, color: l.color })),
    topRepos,
    pullRequests: { opened, merged, reviewed: opened - merged },
    totalRepos: p.user.publicReposCount,
    nightCommits,
    weekendCommits,
    fixCommits: 0,
    firstCommitDate: p.metrics.firstContributionDate,
    mostProductiveDay: { date: mostProdEntry[0] as string, commits: mostProdEntry[1] as number },
    collaborators: [],
    archetype: p.archetypeBlend.primary.label,
    narrative: p.narrative?.archetypeDescription ?? "",
    linesAdded: 0,
    linesDeleted: 0,
    filesChanged: 0,
    mostActiveMonth: MONTH_NAMES[hotMonthIdx] ?? "",
    commitsByHour: byHour,
    commitsByWeekday: byDay,
    commitsByMonth: byMonth,
  };
}
