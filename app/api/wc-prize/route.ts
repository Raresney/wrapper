export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

type WcPrizeRequest = {
  username: string;
  awardName: string;
  awardSubtitle: string;
  keyStat: string;
  speechHint: string;
};

type GroqResponse = {
  choices: Array<{ message: { content: string } }>;
};

// ── Randomness pools (force genuine variety every call) ───────────────────────

const PRESENTER_VOICES = [
  "a legendary retired footballer who won three World Cups and now hosts the ceremony with theatrical gravitas",
  "a booming stadium announcer who treats every sentence like the opening of a Champions League final",
  "a poetic sports journalist whose words make grown footballers weep with pride",
  "an overly dramatic FIFA official reading from a golden scroll with maximum ceremony",
  "a retired referee who has witnessed every great moment in football history and cannot contain his emotion",
  "a passionate South American commentator known for his legendary 30-second 'GOOOOOL' calls",
  "a stoic English football pundit who shows respect through understatement and perfectly chosen words",
  "a charismatic Italian presenter who treats every award like the most important moment in football history",
  "a veteran football scout who has watched every match and identified the one thing that makes this player truly special",
  "a World Cup winner who knows exactly what this moment means and speaks from the soul",
];

const DRAMATIC_ELEMENTS = [
  "open by addressing the 80,000 fans in the stadium directly",
  "reference the roar of the crowd falling silent as the winner is announced",
  "mention the weight of the trophy being placed in their hands",
  "invoke the spirit of all previous World Cup legends who held this award before",
  "describe the moment the final whistle blew and this player's journey became history",
  "reference the journey from the group stage all the way to this podium",
  "paint a picture of the exact moment in the tournament that sealed this award",
  "speak directly to the winner as if handing them the trophy face to face",
  "compare this performance to the greatest moments in World Cup history",
  "describe what the scoreboard said when this player wrote their name into legend",
];

const FORBIDDEN_WORDS = [
  "developer", "code", "coding", "software", "repository", "commit",
  "programming", "engineer", "keyboard", "terminal", "GitHub", "tech",
  "deploy", "build", "feature", "bug", "hack", "algorithm", "database",
  "framework", "library", "function", "variable", "script", "API",
];

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

// ── Fallback speeches ─────────────────────────────────────────────────────────

function getFallback(awardName: string, username: string, keyStat: string): string {
  const fallbacks: Record<string, string> = {
    "Golden Boot":
      `Ladies and gentlemen, the stadium holds its breath. @${username} has done what no one believed possible — ${keyStat}, making them the undisputed top scorer of this entire tournament. When the history books are written, only one name will appear next to the Golden Boot: theirs.`,
    "Golden Ball":
      `The votes are in, the envelope is opened, and the announcement silences 80,000 fans. @${username} — ${keyStat} — has played the most complete and breathtaking tournament of any player on this pitch. The Golden Ball goes to the legend who did it all.`,
    "Golden Glove":
      `Behind every great team stands a goalkeeper the world trusts with everything, and @${username} earned that trust match after match — ${keyStat}. Not a single shot got past them when it truly mattered. The Golden Glove belongs to the best in the world.`,
  };
  return (
    fallbacks[awardName] ??
    `Ladies and gentlemen, please rise for @${username}. With ${keyStat}, they have written their name into the history books of FIFA World Cup 2026. The ${awardName} is theirs — a triumph that will echo through stadiums for generations to come.`
  );
}

// ── Validation ────────────────────────────────────────────────────────────────

function isWcPrizeRequest(body: unknown): body is WcPrizeRequest {
  return (
    typeof body === "object" &&
    body !== null &&
    "username" in body &&
    "awardName" in body &&
    "keyStat" in body &&
    "speechHint" in body
  );
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!isWcPrizeRequest(body)) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { username, awardName, awardSubtitle, keyStat, speechHint } = body;
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { speech: getFallback(awardName, username, keyStat) },
      { status: 200 },
    );
  }

  // Four dice rolls — unique combinatorial fingerprint every call
  const voice = pickOne(PRESENTER_VOICES);
  const element = pickOne(DRAMATIC_ELEMENTS);
  const banned = pickN(FORBIDDEN_WORDS, 6).join(", ");
  const rollId = Math.random().toString(36).slice(2, 10);

  const systemPrompt =
    `You are a FIFA World Cup 2026 awards ceremony presenter. Each call MUST produce genuinely different text.\n` +
    `Output ONLY the speech text — no JSON, no labels, no quotes, nothing else.\n\n` +
    `Rules:\n` +
    `1. Speak ONLY in football/soccer language — no tech jargon whatsoever.\n` +
    `2. Reference @${username} by name and cite their exact stat: ${keyStat}.\n` +
    `3. Write exactly 3 sentences. No more, no less.\n` +
    `4. Apply the presenter voice, dramatic element, and forbidden words given below — they change each call to force genuine variety.\n` +
    `5. Maximum 95 words total.\n` +
    `6. Forbidden words — do NOT use any of: ${banned}.`;

  const userPrompt =
    `[Run ${rollId}]\n` +
    `Presenter voice: ${voice}.\n` +
    `Dramatic element to include: ${element}.\n\n` +
    `Award: "${awardName}" — ${awardSubtitle}.\n` +
    `Winner: @${username}.\n` +
    `Key stat: ${keyStat}.\n` +
    `Context: ${speechHint}.\n\n` +
    `Write the 3-sentence award ceremony speech now.`;

  console.log(`[wc-prize] run=${rollId} voice="${voice.slice(0, 40)}..." award="${awardName}"`);

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 200,
        temperature: 0.95,
        top_p: 0.9,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[wc-prize] HTTP ${res.status}:`, errText);
      return NextResponse.json(
        { speech: getFallback(awardName, username, keyStat) },
        { status: 200 },
      );
    }

    const json = (await res.json()) as GroqResponse;
    const speech = json.choices[0]?.message.content?.trim() ?? "";
    console.log(`[wc-prize] response: "${speech.slice(0, 120)}..."`);

    return NextResponse.json(
      { speech: speech || getFallback(awardName, username, keyStat) },
      { status: 200 },
    );
  } catch (e) {
    console.error("[wc-prize] fetch threw:", e);
    return NextResponse.json(
      { speech: getFallback(awardName, username, keyStat) },
      { status: 200 },
    );
  }
}
