export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { generateNarrative } from "@/lib/groq";
import { isRateLimited } from "@/lib/rate-limit";
import { getToken } from "next-auth/jwt";
import type { WrappedProfile, AiTone } from "@/types/wrapped";

const VALID_TONES: AiTone[] = ["funny", "brutal", "motivational"];

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isWrappedProfile(body: unknown): body is WrappedProfile {
  if (!isObjectRecord(body)) return false;

  const user = body.user;
  const metrics = body.metrics;
  const raw = body.raw;
  const period = body.period;

  return (
    isObjectRecord(user) &&
    typeof user.login === "string" &&
    isObjectRecord(metrics) &&
    typeof metrics.totalCommits === "number" &&
    isObjectRecord(raw) &&
    Array.isArray(raw.contributions) &&
    Array.isArray(raw.repos) &&
    Array.isArray(raw.languages) &&
    Array.isArray(raw.pullRequests) &&
    isObjectRecord(period) &&
    typeof period.label === "string"
  );
}

export async function POST(request: NextRequest) {
  // Cost-bearing (Groq) endpoint: require auth and rate-limit per identity (RT-04).
  const jwt = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!jwt) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (isRateLimited(`narrative:${jwt.sub ?? "unknown"}`, 12, 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!isWrappedProfile(body)) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const rawProfile = body;

  if (!rawProfile.user || !rawProfile.metrics) {
    return NextResponse.json({ error: "missing_required_fields" }, { status: 400 });
  }

  const tone: AiTone = VALID_TONES.includes(rawProfile.tone) ? rawProfile.tone : "funny";
  const profile: WrappedProfile = { ...rawProfile, tone };

  try {
    const narrative = await generateNarrative(profile);
    return NextResponse.json({ ...profile, narrative }, {
      status: 200,
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("api/narrative POST:", err);
    return NextResponse.json({ error: "narrative_failed" }, { status: 500 });
  }
}
