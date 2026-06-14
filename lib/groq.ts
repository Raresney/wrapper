import { createClient } from "@supabase/supabase-js";
import type {
  WrappedProfile,
  NarrativeOutput,
  AiTone,
} from "@/types/wrapped";

type NarrativeCore = Omit<NarrativeOutput, "generatedAt" | "fromCache">;

type GroqApiResponse = {
  choices: Array<{ message: { content: string } }>;
};

type CacheRow = {
  cache_key: string;
  username: string;
  narrative: NarrativeCore;
  created_at: string;
};

const FALLBACK: NarrativeCore = {
  roastLine: "Your commit history speaks for itself. Loudly.",
  archetypeDescription: "A developer who ships. Details are for pull request descriptions.",
  introVibeLine: "Another year. Another thousand lines of code that definitely work.",
  shareCaption: "Wrapped in commits. #GitHubWrapped",
};

const SYSTEM_PROMPT =
  `You are GitHub Wrapped narrator. You receive developer stats as JSON and output ONLY valid JSON.\n` +
  `No markdown. No explanation. No extra keys. Respond with exactly this shape:\n` +
  `{\n  "roastLine": "string",\n  "archetypeDescription": "string",\n  "introVibeLine": "string",\n  "shareCaption": "string"\n}`;

const USER_PROMPTS: Record<AiTone, string> = {
  funny: "Write a funny, slightly sarcastic GitHub Wrapped for this developer. Roast them with affection. Data: ",
  brutal: "Write a brutally honest, no-filter GitHub Wrapped. Call out what the numbers actually mean. Data: ",
  motivational: "Write an epic, cinematic GitHub Wrapped that makes this developer feel legendary. Data: ",
};

// djb2 hash to base36, 8 chars
function djb2(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (((h << 5) + h) ^ str.charCodeAt(i)) >>> 0;
  }
  return h.toString(36).slice(0, 8);
}

export function buildCacheKey(profile: WrappedProfile): string {
  const hashInput = [
    profile.metrics.totalCommits,
    profile.metrics.topRepo.name,
    profile.archetypeBlend.primary.id,
    profile.raw.totalStarsReceived,
  ].join("|");
  return [
    profile.user.login,
    profile.period.type,
    profile.period.startDate,
    djb2(hashInput),
    profile.tone,
    "v1",
  ].join(":");
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function buildPayload(profile: WrappedProfile): Record<string, unknown> {
  return {
    username: profile.user.login,
    period: profile.period.label,
    tone: profile.tone,
    archetype: {
      label: profile.archetypeBlend.label,
      primary: profile.archetypeBlend.primary.id,
      secondary: profile.archetypeBlend.secondary?.id ?? null,
    },
    topInsights: profile.insights.narrativeTop3.map((i) => ({
      id: i.id,
      value: i.value,
      rarity: i.rarity,
    })),
    mainStory: {
      id: profile.insights.mainStoryArc.id,
      value: profile.insights.mainStoryArc.value,
    },
    stats: {
      totalCommits: profile.metrics.totalCommits,
      longestStreak: profile.metrics.streak.longestStreak,
      topLanguage: profile.raw.languages[0]?.language ?? "unknown",
      totalStars: profile.raw.totalStarsReceived,
      peakHour: profile.metrics.hourBias.peakHourLabel,
      githubAge: profile.metrics.githubAge,
    },
  };
}

function parseLLMResponse(content: string): NarrativeCore | null {
  try {
    const clean = content.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(clean) as Record<string, unknown>;
    const { roastLine, archetypeDescription, introVibeLine, shareCaption } = parsed;
    if (
      typeof roastLine !== "string" ||
      typeof archetypeDescription !== "string" ||
      typeof introVibeLine !== "string" ||
      typeof shareCaption !== "string"
    ) return null;
    return { roastLine, archetypeDescription, introVibeLine, shareCaption };
  } catch {
    return null;
  }
}

export async function generateNarrative(profile: WrappedProfile): Promise<NarrativeOutput> {
  const cacheKey = buildCacheKey(profile);
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data } = await supabase
        .from("narrative_cache")
        .select("narrative, created_at")
        .eq("cache_key", cacheKey)
        .single();
      if (data) {
        const row = data as unknown as CacheRow;
        if (Date.now() - new Date(row.created_at).getTime() < 86_400_000) {
          return { ...row.narrative, generatedAt: row.created_at, fromCache: true };
        }
      }
    } catch {
      // Cache miss or Supabase unavailable.
    }
  }

  const apiKey = process.env.GROQ_API_KEY;
  let narrative: NarrativeCore = FALLBACK;

  if (apiKey) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 400,
          temperature: 0.7,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: USER_PROMPTS[profile.tone] + JSON.stringify(buildPayload(profile)) },
          ],
        }),
      });
      if (!res.ok) throw new Error(`Groq ${res.status}`);
      const json = (await res.json()) as GroqApiResponse;
      narrative = parseLLMResponse(json.choices[0]?.message.content ?? "") ?? FALLBACK;
    } catch (e) {
      console.error("generateNarrative: Groq call failed", e);
    }
  }

  const generatedAt = new Date().toISOString();

  if (supabase) {
    try {
      await supabase.from("narrative_cache").upsert({
        cache_key: cacheKey,
        username: profile.user.login,
        narrative,
        created_at: generatedAt,
      });
    } catch {
      // Non-fatal cache write failure.
    }
  }

  return { ...narrative, generatedAt, fromCache: false };
}
