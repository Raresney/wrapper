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
  "an overly dramatic tournament official reading from a golden scroll with maximum ceremony",
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
  "framework", "library", "function", "variable", "script", "API", "FIFA",
];

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function sanitizeSpeech(text: string): string {
  return text
    .replace(/\bFIFA\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
}

// ── Fallback speeches ─────────────────────────────────────────────────────────

function getFallback(awardName: string, username: string, keyStat: string): string {
  const fallbacks: Record<string, string[]> = {
    "Golden Boot": [
      `Ladies and gentlemen, the stadium holds its breath as @${username} is called forward. With ${keyStat}, they turned every half-chance into a roar that shook the stands. The Golden Boot belongs to the finisher who defined this tournament.`,
      `There are scorers, and then there is @${username}. ${keyStat} tells the story of a player who punished every defence brave enough to stand in the way. Tonight, the Golden Boot goes to the name every goalkeeper feared.`,
      `From the opening whistle to the final spotlight, @${username} never stopped hunting the net. ${keyStat} made them the most ruthless attacker on this stage. Raise the Golden Boot for the striker who made goals feel inevitable.`,
      `When this tournament needed a decisive touch, @${username} answered again and again. ${keyStat} placed them above every other scorer in the competition. The Golden Boot is not a debate tonight, it is a coronation.`,
      `The crowd remembers every finish, but one name kept returning to the scoreboard: @${username}. ${keyStat} crowned a run of precision, nerve, and pure attacking instinct. The Golden Boot goes to the player who made scoring look like destiny.`,
      `Every tournament has a striker who bends matches toward one inevitable outcome. For this competition, that player was @${username}, and ${keyStat} is the proof. The Golden Boot is lifted by the forward who gave defenders sleepless nights.`,
      `A great scorer senses the smallest opening and turns it into history, and @${username} did exactly that. ${keyStat} separated them from every challenger in this tournament. The Golden Boot belongs to the coldest finisher under the brightest lights.`,
      `Goals decided the biggest nights of this tournament, and @${username} was at the center of them. With ${keyStat}, they built a campaign of timing, movement, and ruthless execution. The Golden Boot has found its rightful owner.`,
    ],
    "Golden Ball": [
      `Silence falls across the stadium because everyone knows this is the grandest individual honour of them all. @${username}, with ${keyStat}, controlled matches, lifted teammates, and bent the tournament to their rhythm. The Golden Ball goes to the player who ruled every inch of the stage.`,
      `Some players shine, but @${username} commanded the tournament from first whistle to last. ${keyStat} is the proof of a campaign filled with genius, authority, and unforgettable moments. The Golden Ball is awarded to the heartbeat of this World Cup.`,
      `The envelope opens, the crowd rises, and one name carries above the noise: @${username}. With ${keyStat}, they delivered the kind of all-around brilliance that defines an era. The Golden Ball belongs to the player who made this tournament feel like their own.`,
      `Football's biggest stage asked for a master, and @${username} answered with ${keyStat}. Every pass, every surge, every moment of calm under pressure pushed this campaign toward greatness. The Golden Ball now rests with the artist who led the tournament.`,
      `This honour is reserved for the player who shaped the tournament itself, and that was @${username}. ${keyStat} captures only a fraction of the control, imagination, and competitive fire they brought to every match. The Golden Ball belongs to the leader of this entire spectacle.`,
      `When the tournament demanded invention, authority, and nerve, @${username} delivered all three. ${keyStat} stands beside a run of performances that changed the temperature of every stadium. The Golden Ball goes to the player everyone else had to orbit.`,
      `There are outstanding tournaments, and then there are campaigns that leave a permanent mark on memory. @${username} produced that kind of run, and ${keyStat} confirms it. The Golden Ball is awarded to the player who turned pressure into art.`,
      `Tonight we honour not only excellence, but influence of the highest order. @${username}, with ${keyStat}, made every phase of the game feel richer, sharper, and more dangerous. The Golden Ball is theirs because this tournament moved to their rhythm.`,
    ],
    "Golden Glove": [
      `Behind every charge toward glory stands a goalkeeper who refuses to blink, and that was @${username}. ${keyStat} marks a tournament built on nerve, command, and impossible saves at impossible times. The Golden Glove is carried to the keeper who guarded the dream.`,
      `When panic spread in the box, @${username} brought calm to the entire stadium. ${keyStat} captures a run of saves that changed matches and protected history. The Golden Glove belongs to the wall no striker could truly solve.`,
      `This tournament produced many heroes, but few were as unshakable as @${username}. With ${keyStat}, they turned the goalmouth into sacred ground and shut the door when everything was on the line. The Golden Glove is awarded to the safest hands in football.`,
      `There is no trophy without trust, and no trust without a goalkeeper like @${username}. ${keyStat} tells the story of reflexes, courage, and command under the fiercest lights. The Golden Glove goes to the guardian who stood tallest.`,
      `Every champion needs a final line that never loses its nerve, and @${username} was exactly that. ${keyStat} reflects a tournament of brave positioning, huge moments, and saves that bent history away from danger. The Golden Glove belongs to the keeper who made belief possible.`,
      `The brightest attacking stars met one stubborn truth in this tournament: @${username} would not yield. With ${keyStat}, they turned pressure into control and chaos into certainty. The Golden Glove is lifted by the goalkeeper who made the impossible feel routine.`,
      `When the ball flashed through crowded boxes and panic threatened to take over, @${username} stayed above it all. ${keyStat} seals a campaign of command and courage under relentless pressure. The Golden Glove goes to the guardian every back line dreams of.`,
      `A great goalkeeper does more than save shots, they steady an entire team, and @${username} did that from start to finish. ${keyStat} crowns a tournament full of authority and timing. The Golden Glove belongs to the last line that never broke.`,
    ],
  };

  return sanitizeSpeech(
    pickOne(
      fallbacks[awardName] ?? [
        `Ladies and gentlemen, please rise for @${username}. With ${keyStat}, they have written their name into the history books of World Cup 2026. The ${awardName} is theirs, a triumph that will echo through stadiums for years to come.`,
        `Tonight belongs to @${username}, whose ${keyStat} transformed a brilliant campaign into lasting history. The ${awardName} now finds its rightful owner on football's greatest stage. Let the applause meet a moment worthy of legend.`,
        `The lights, the crowd, the pressure, none of it shook @${username}. ${keyStat} sealed a tournament run strong enough to claim the ${awardName} with authority. This is the kind of moment that lives forever in the sport.`,
        `On the grandest night of the tournament, @${username} stands above the rest. ${keyStat} made this award impossible to give to anyone else. The ${awardName} is theirs, and the stadium knows it.`,
        `This stage has seen giants before, and tonight @${username} joins that company. ${keyStat} turned a remarkable run into an undeniable claim on the ${awardName}. The ovation is for a performance that belonged among the tournament's finest.`,
        `The stadium asked for greatness and @${username} answered with ${keyStat}. Across every decisive moment, they built a campaign worthy of the ${awardName}. This is a football memory that will stay loud for a long time.`,
        `No one walks to this podium by accident, and @${username} proved that with ${keyStat}. The ${awardName} is the reward for composure, quality, and a tournament played at the highest level. Let the night remember this name properly.`,
        `Under the heaviest lights, @${username} found their best football. ${keyStat} placed them above every contender for the ${awardName}. The crowd rises because it knows it has witnessed something lasting.`,
      ],
    ),
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
    `You are a World Cup 2026 awards ceremony presenter. Each call MUST produce genuinely different text.\n` +
    `Output ONLY the speech text — no JSON, no labels, no quotes, nothing else.\n\n` +
    `Rules:\n` +
    `1. Speak ONLY in football/soccer language — no tech jargon whatsoever.\n` +
    `2. Reference @${username} by name and cite their exact stat: ${keyStat}.\n` +
    `3. Write exactly 3 sentences. No more, no less.\n` +
    `4. Apply the presenter voice, dramatic element, and forbidden words given below — they change each call to force genuine variety.\n` +
    `5. Maximum 95 words total.\n` +
    `6. Forbidden words — do NOT use any of: ${banned}.\n` +
    `7. Never mention the word FIFA.`;

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
    const speech = sanitizeSpeech(json.choices[0]?.message.content?.trim() ?? "");
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
