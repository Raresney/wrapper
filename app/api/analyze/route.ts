import { NextResponse } from "next/server";
import { calculateMetrics, calculateAchievements } from "@/lib/analyzer";
import { calculateArchetypeBlend } from "@/lib/archetypes";
import { selectInsights } from "@/lib/insights";
import { deriveTheme } from "@/lib/themes";
import type { GitHubRawData, AiTone, WrappedProfile } from "@/types/wrapped";

const VALID_TONES: AiTone[] = ["funny", "brutal", "motivational"];

function isGitHubRawData(body: unknown): body is GitHubRawData {
  return (
    typeof body === "object" &&
    body !== null &&
    "user" in body &&
    "contributions" in body &&
    "period" in body
  );
}

function parseTone(value: unknown): AiTone {
  return VALID_TONES.includes(value as AiTone) ? (value as AiTone) : "funny";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!isGitHubRawData(body)) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const rawData = body;
  const { searchParams } = new URL(request.url);
  const tone = parseTone(searchParams.get("tone") ?? (rawData as Record<string, unknown>).tone);

  try {
    const metrics = calculateMetrics(rawData);
    const achievements = calculateAchievements(rawData, metrics);
    const archetypeBlend = calculateArchetypeBlend(rawData, metrics);
    const insights = selectInsights(rawData, metrics, achievements);
    const theme = deriveTheme(rawData, metrics);

    const profile: WrappedProfile = {
      user: rawData.user,
      period: rawData.period,
      raw: rawData,
      metrics,
      achievements,
      archetypeBlend,
      insights,
      theme,
      tone,
      narrative: null,
      generatedAt: new Date().toISOString(),
      cacheKey: "",
    };

    return NextResponse.json(profile, { status: 200 });
  } catch (err) {
    console.error("api/analyze POST:", err);
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: "analysis_failed", message }, { status: 500 });
  }
}
