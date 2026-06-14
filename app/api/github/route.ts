import { NextResponse } from "next/server";
import { fetchGitHubRawData, fetchGitHubUser } from "@/lib/github";
import type { GitHubError } from "@/lib/github";
import type { Period } from "@/types/wrapped";

const VALID_PERIOD_TYPES = ["week", "month", "year", "alltime", "custom"] as const;
type PeriodValue = (typeof VALID_PERIOD_TYPES)[number];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function derivePeriod(
  periodType: PeriodValue,
  startDate?: string,
  endDate?: string,
  accountCreatedAt?: string
): Period {
  const end = endDate ?? today();
  switch (periodType) {
    case "week":
      return { type: "week", startDate: daysAgo(7), endDate: today(), label: "Last 7 days" };
    case "month":
      return { type: "month", startDate: daysAgo(30), endDate: today(), label: "Last 30 days" };
    case "year":
      return { type: "year", startDate: daysAgo(365), endDate: today(), label: "Last year" };
    case "alltime":
      return {
        type: "alltime",
        startDate: accountCreatedAt?.slice(0, 10) ?? daysAgo(365 * 10),
        endDate: today(),
        label: "All time",
      };
    case "custom":
      return {
        type: "custom",
        startDate: startDate ?? daysAgo(30),
        endDate: end,
        label: `${startDate ?? daysAgo(30)} - ${end}`,
      };
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const periodType = searchParams.get("periodType");
  const startDate = searchParams.get("startDate") ?? undefined;
  const endDate = searchParams.get("endDate") ?? undefined;

  if (!username) {
    return NextResponse.json({ error: "username_required" }, { status: 400 });
  }
  if (!periodType || !(VALID_PERIOD_TYPES as readonly string[]).includes(periodType)) {
    return NextResponse.json({ error: "invalid_period_type" }, { status: 400 });
  }

  // User OAuth token → server fallback token (must look like a real GH token) → unauthenticated
  const userToken = request.headers.get("Authorization")?.replace("Bearer ", "") ?? undefined;
  const envToken  = process.env.GITHUB_TOKEN;
  const serverToken = envToken && (envToken.startsWith("ghp_") || envToken.startsWith("github_pat_") || envToken.startsWith("ghs_"))
    ? envToken : undefined;
  const token = userToken ?? serverToken ?? undefined;
  const validPeriod = periodType as PeriodValue;

  let accountCreatedAt: string | undefined;
  if (validPeriod === "alltime") {
    try {
      const user = await fetchGitHubUser(username, token);
      accountCreatedAt = user.accountCreatedAt;
    } catch {
      // fall back to 10-year default in derivePeriod
    }
  }

  const period = derivePeriod(validPeriod, startDate, endDate, accountCreatedAt);

  try {
    const rawData = await fetchGitHubRawData(username, period, token);
    return NextResponse.json(rawData, { status: 200 });
  } catch (err) {
    const ghErr = err as GitHubError;
    if (ghErr.type === "rate_limited") {
      return NextResponse.json({ error: "rate_limited", retryAfter: ghErr.retryAfter }, { status: 429 });
    }
    if (ghErr.type === "not_found") {
      return NextResponse.json({ error: "user_not_found" }, { status: 404 });
    }
    if (ghErr.type === "unauthorized") {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    console.error("api/github GET:", err);
    return NextResponse.json({ error: "github_unavailable" }, { status: 500 });
  }
}
