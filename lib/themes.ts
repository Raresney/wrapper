import type { CalculatedMetrics, GitHubRawData, ThemeId, VisualTheme } from "@/types/wrapped";

const THEMES: Record<ThemeId, VisualTheme> = {
  intense: {
    id: "intense",
    label: "Intense",
    primaryColor: "#ff3b3b",
    accentColor: "#ff8c00",
    gradientFrom: "#1a0000",
    gradientTo: "#3d0000",
  },
  chill: {
    id: "chill",
    label: "Chill",
    primaryColor: "#4fc3f7",
    accentColor: "#81d4fa",
    gradientFrom: "#001a2e",
    gradientTo: "#002a4a",
  },
  nostalgic: {
    id: "nostalgic",
    label: "Nostalgic",
    primaryColor: "#d4a96a",
    accentColor: "#c8956c",
    gradientFrom: "#1a1206",
    gradientTo: "#2e200a",
  },
  epic: {
    id: "epic",
    label: "Epic",
    primaryColor: "#b388ff",
    accentColor: "#ea80fc",
    gradientFrom: "#0d001a",
    gradientTo: "#1a0033",
  },
};

export function deriveTheme(data: GitHubRawData, metrics: CalculatedMetrics): VisualTheme {
  const { scores, streak, githubAge } = metrics;

  if (
    scores.intensityScore >= 80 &&
    (streak.longestStreak >= 30 || data.totalStarsReceived >= 20)
  ) {
    return THEMES.epic;
  }

  if (scores.intensityScore >= 60 || streak.currentStreak >= 14) {
    return THEMES.intense;
  }

  if (data.period.type === "alltime" || githubAge >= 1825) {
    return THEMES.nostalgic;
  }

  return THEMES.chill;
}
