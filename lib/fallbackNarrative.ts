import type { AiTone } from "@/types/wrapped";

// ── Profile-driven, per-run-diverse fallback narrative ──────────────────────
// Produces the same four fields the LLM would, but assembled procedurally from
// the user's REAL stats. Every call re-rolls, so two runs of the same user with
// the same tone yield different text — and every line references actual numbers.

export type FallbackInput = {
  username: string;
  archetype: string;        // human label, e.g. "Night Owl"
  totalCommits: number;
  longestStreak: number;
  currentStreak: number;
  peakHour: number;         // 0-23
  topLanguage: string;
  topRepo: string;
  nightRatio: number;       // 0..1 share of commits before 5am
  prsMerged: number;
  totalRepos: number;
  periodLabel: string;
};

export type FallbackNarrative = {
  roastLine: string;
  archetypeDescription: string;
  introVibeLine: string;
  shareCaption: string;
};

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function hourLabel(h: number): string {
  const norm = ((h % 24) + 24) % 24;
  const isAm = norm < 12;
  const base = norm % 12 === 0 ? 12 : norm % 12;
  return `${base}${isAm ? "am" : "pm"}`;
}

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(Math.max(0, Math.round(n)));
}

// Build a token bag from the real profile so templates can interpolate freely.
function tokens(p: FallbackInput) {
  const peak = hourLabel(p.peakHour);
  const nightPct = Math.round(p.nightRatio * 100);
  const lang = p.topLanguage || "code";
  const repo = p.topRepo || "your repo";
  return {
    name: p.username,
    arch: p.archetype || "Developer",
    commits: fmt(p.totalCommits),
    commitsRaw: p.totalCommits,
    streak: p.longestStreak,
    curStreak: p.currentStreak,
    peak,
    lang,
    repo,
    nightPct,
    prs: p.prsMerged,
    repos: p.totalRepos,
    period: p.periodLabel || "this run",
  };
}

type T = ReturnType<typeof tokens>;

// Each field has many template functions; one is chosen at random per call.
// Templates reference different stat combinations so collisions are rare and
// every output is grounded in the user's data.

const ROAST: Record<AiTone, ((t: T) => string)[]> = {
  funny: [
    (t) => `${t.commits} commits and your peak hour is ${t.peak} — sleep is clearly a "v2" feature.`,
    (t) => `${t.repo} has seen more of you than your friends have. ${t.commits} commits deep and counting.`,
    (t) => `A ${t.streak}-day streak? Your houseplants wish you were that consistent with watering.`,
    (t) => `You and ${t.lang} are basically dating at this point — it's all over your ${t.repos} repos.`,
    (t) => `${t.nightPct}% of your commits happen before sunrise. The owls have started taking notes.`,
    (t) => `${t.prs} merged PRs and a ${t.peak} bedtime. Somewhere a deadline is very, very happy.`,
    (t) => `${t.commits} commits across ${t.repos} repos. Hobbies? This is the hobby.`,
    (t) => `Your longest streak hit ${t.streak} days. Your current one is ${t.curStreak}. We won't ask what happened.`,
    (t) => `${t.repo} got the deluxe treatment while the rest of your repos waited politely in line.`,
    (t) => `${t.peak} is not a peak hour, it's a cry for curtains and a stronger coffee.`,
    (t) => `${t.commits} commits later, the only thing more committed than you is your browser session.`,
    (t) => `${t.prs} merged PRs and ${t.repos} repos. Somewhere, a to-do list is filing a restraining order.`,
    (t) => `${t.lang} got your best hours, ${t.repo} got your attention, and daylight got whatever was left.`,
    (t) => `${t.commits} commits into ${t.period}, and somehow ${t.repo} still acted like you weren't around enough.`,
    (t) => `${t.streak} days in a row is impressive. Slightly alarming, but impressive.`,
    (t) => `${t.nightPct}% of your commits happened in owl territory. Even the moon thinks you should log off.`,
  ],
  brutal: [
    (t) => `${t.commits} commits and your peak is ${t.peak}. That's not dedication, that's a sleep schedule held together with tape.`,
    (t) => `${t.nightPct}% of your work happens before 5am. The code isn't the only thing crashing.`,
    (t) => `A ${t.streak}-day streak that's now down to ${t.curStreak}. Consistency was a phase, apparently.`,
    (t) => `${t.repos} repos, and ${t.repo} ate most of your year. Spreading thin or just stuck?`,
    (t) => `${t.prs} PRs merged. Impressive — until you realize how many ${t.peak} nights it cost you.`,
    (t) => `All that ${t.lang} and nothing to show but ${t.commits} commits. The numbers don't lie, and they're not kind.`,
    (t) => `You call it ${t.arch}. The data calls it a cry for a calendar.`,
    (t) => `${t.repo} became your whole personality and somehow still demanded overtime.`,
    (t) => `${t.nightPct}% after dark, ${t.curStreak} right now, and ${t.streak} in the past. The plot wrote itself.`,
    (t) => `${t.prs} merged PRs doesn't erase the fact that ${t.peak} became a lifestyle mistake.`,
    (t) => `${t.commits} commits over ${t.period}. Busy, yes. Balanced, absolutely not.`,
    (t) => `${t.repo} got fed, your schedule got wrecked, and ${t.commits} commits are all the evidence anyone needs.`,
    (t) => `${t.streak} days once, ${t.curStreak} now. Even your momentum got tired of your habits.`,
    (t) => `${t.lang} may be your top language, but exhaustion was clearly the second one.`,
    (t) => `${t.repos} repos and still the same story: ${t.peak}, ${t.repo}, and a year with no brakes.`,
  ],
  motivational: [
    (t) => `${t.commits} commits. ${t.streak} unbroken days. This wasn't luck — this was you, on repeat.`,
    (t) => `While the world slept, you shipped. ${t.nightPct}% of your work at ${t.peak} built something real.`,
    (t) => `${t.repo} didn't build itself. ${t.commits} commits of pure intent did that.`,
    (t) => `${t.prs} merged PRs. Every single one a decision to make the codebase better than you found it.`,
    (t) => `${t.streak} days in a row. That's not a streak — that's a signature.`,
    (t) => `${t.lang} across ${t.repos} repos. You didn't dabble. You committed, literally.`,
    (t) => `They'll measure ${t.period} in commits. You'll remember it as the year you didn't quit.`,
    (t) => `${t.repo} stands as proof that sustained effort can become something people actually remember.`,
    (t) => `${t.peak} became your launch window, and ${t.commits} commits became the trail behind you.`,
    (t) => `${t.prs} merged PRs and a ${t.streak}-day streak say the same thing: you kept showing up.`,
    (t) => `${t.repos} repos, one clear direction, and the kind of momentum that changes what comes next.`,
    (t) => `${t.lang} was your medium, but discipline was the real engine behind ${t.commits} commits.`,
    (t) => `${t.repo} kept calling, and you kept answering with work that moved the line forward.`,
    (t) => `${t.period} rewarded persistence, and you gave it ${t.streak} straight days of proof.`,
    (t) => `${t.nightPct}% of the work happened when it was quiet. The impact stayed loud.`,
  ],
};

const DESC: Record<AiTone, ((t: T) => string)[]> = {
  funny: [
    (t) => `As a card-carrying ${t.arch}, you logged ${t.commits} commits with a suspicious spike at ${t.peak}. ${t.repo} is less a project and more a roommate at this point. Somewhere, ${t.lang} is filing for joint custody.`,
    (t) => `${t.commits} commits, ${t.repos} repos, and a ${t.streak}-day streak that put your gym membership to shame. The ${t.peak} timestamps suggest your "work-life balance" is a single very enthusiastic line.`,
    (t) => `The ${t.arch} archetype fits: ${t.nightPct}% of your commits land before dawn and ${t.repo} carries the rest. You speak fluent ${t.lang} and apparently very little "go to bed".`,
    (t) => `${t.prs} PRs merged, ${t.commits} commits shipped, and not one of them at a reasonable hour. ${t.peak} is your golden hour and ${t.repo} is the willing victim.`,
    (t) => `${t.arch} feels right: equal parts obsession, momentum, and whatever happens to a person after too many nights at ${t.peak}. ${t.repo} got the spotlight, but the rest of your ${t.repos} repos still caught the fallout.`,
    (t) => `You made ${t.arch} look less like a label and more like a documented condition. ${t.commits} commits, ${t.prs} merged PRs, and a suspicious emotional attachment to ${t.repo}.`,
    (t) => `${t.repos} repos gave you options and you still came back to ${t.repo}. That's not focus, that's a favorite child.`,
    (t) => `${t.arch} was never going to be subtle with numbers like these. ${t.commits} commits and a peak at ${t.peak} suggest you treated the clock like a loose recommendation.`,
    (t) => `${t.repo} clearly won custody of your attention this season. ${t.prs} merged PRs and ${t.repos} repos later, the verdict feels unanimous.`,
    (t) => `With ${t.nightPct}% of your work landing in the late hours, the ${t.arch} title feels less like branding and more like a witness statement.`,
    (t) => `${t.commits} commits in ${t.lang} across ${t.repos} repos would already be a lot. Adding ${t.repo} as the main stage turns it into a full personality profile.`,
  ],
  brutal: [
    (t) => `${t.arch}, sure. The receipts say ${t.commits} commits, mostly funneled into ${t.repo}, mostly at ${t.peak}. That's not range — that's a rut with good lighting. ${t.lang} can only carry you so far.`,
    (t) => `A ${t.streak}-day streak that collapsed to ${t.curStreak}. ${t.nightPct}% of your output bleeds past midnight. ${t.commits} commits and you still treat sleep like an optional dependency.`,
    (t) => `${t.repos} repos, one real obsession: ${t.repo}. ${t.prs} PRs merged, the rest of GitHub barely knows you exist. The ${t.peak} grind is loud; the results are quieter than you'd like.`,
    (t) => `You wear ${t.arch} like a badge. The data reads more like a warning label: ${t.commits} commits, a dying streak, and a ${t.peak} habit that's running the show.`,
    (t) => `${t.arch} sounds cool until you read the fine print: ${t.repo}, ${t.peak}, and enough commits to confuse output with direction.`,
    (t) => `${t.commits} commits made you look busy. ${t.curStreak} days made you look mortal. ${t.repo} made you look stuck.`,
    (t) => `${t.prs} merged PRs, ${t.repos} repos, and still the loudest story is how often ${t.peak} showed up in the logs.`,
    (t) => `${t.arch} is a flattering label for a pattern that mostly says you couldn't stop reopening ${t.repo}.`,
    (t) => `${t.nightPct}% in the late hours, ${t.commits} commits total, and somehow the main achievement is proving burnout has excellent attendance.`,
    (t) => `${t.lang} may dominate your stats, but ${t.peak} dominates the story. That's not depth, that's drift.`,
    (t) => `${t.repos} repos gave this year some variety on paper. In practice, it was still the same tunnel back to ${t.repo}.`,
  ],
  motivational: [
    (t) => `You are, without apology, a ${t.arch}. ${t.commits} commits. A ${t.streak}-day streak forged one decision at a time. ${t.repo} stands because you showed up — even at ${t.peak}, even when no one was watching.`,
    (t) => `${t.nightPct}% of your work happened in the quiet hours, and that's where legends are quietly made. ${t.commits} commits in ${t.lang}, ${t.prs} PRs merged — proof that ${t.period} had a author, and it was you.`,
    (t) => `The ${t.arch} doesn't wait for motivation. Across ${t.repos} repos and ${t.commits} commits, you turned ${t.peak} into a launchpad. ${t.repo} is the monument; the streak is the receipt.`,
    (t) => `${t.streak} days unbroken. ${t.prs} PRs that left things better. ${t.commits} commits that each said "again." This is what ${t.arch} looks like when it's earned, not claimed.`,
    (t) => `${t.arch} is what happens when persistence gets a shape. ${t.repo} became your proving ground, and ${t.commits} commits became the evidence.`,
    (t) => `Your numbers don't whisper, they accumulate. ${t.repos} repos, ${t.prs} merged PRs, and a rhythm at ${t.peak} that kept the whole story moving.`,
    (t) => `${t.lang} was the instrument, ${t.repo} was the stage, and ${t.arch} was the role you grew into line by line.`,
    (t) => `${t.arch} fits because the work fits. ${t.commits} commits, ${t.period}, and a standard you kept meeting even when the hours got late.`,
    (t) => `${t.repo} became the place where effort stopped being intention and turned into visible progress.`,
    (t) => `${t.prs} merged PRs and ${t.repos} repos show breadth, but the real headline is how consistently you kept building.`,
    (t) => `${t.nightPct}% in the quiet hours, ${t.streak} days of momentum, and a body of work that holds together because you did.`,
  ],
};

const INTRO: Record<AiTone, ((t: T) => string)[]> = {
  funny: [
    (t) => `${t.period}, decoded: ${t.commits} commits and one very tired keyboard.`,
    (t) => `Welcome to your ${t.arch} era — sponsored by ${t.lang} and a ${t.peak} bedtime.`,
    (t) => `${t.repo} called. It misses you already. Also: ${t.commits} commits, nice.`,
    (t) => `${t.period} looked normal from the outside. Then ${t.commits} commits happened.`,
    (t) => `This chapter has everything: ${t.peak}, ${t.repo}, and a deeply questionable definition of "just one more thing."`,
    (t) => `${t.arch}, now streaming in ${t.lang} with special guest appearances from insomnia and momentum.`,
    (t) => `${t.period}: starring ${t.repo}, ${t.commits} commits, and one completely unserious relationship with bedtime.`,
    (t) => `If ${t.period} had notes, they'd mostly just say ${t.repo} and ${t.peak} in bold.`,
    (t) => `${t.commits} commits later, this era has developed a very specific smell of ${t.lang} and bad timing.`,
  ],
  brutal: [
    (t) => `${t.period}, no filter: ${t.commits} commits and a streak that didn't make it.`,
    (t) => `${t.arch}? Let's see if the ${t.commits} commits agree.`,
    (t) => `${t.nightPct}% before dawn. Let's talk about what that ${t.peak} habit cost you.`,
    (t) => `${t.period}, translated from denial: ${t.repo}, ${t.peak}, and no meaningful brakes.`,
    (t) => `${t.commits} commits later, the romantic version of this story is no longer available.`,
    (t) => `You brought ${t.arch} energy to ${t.period}. The receipts are not subtle.`,
    (t) => `${t.period} came with metrics, and they were not gentle.`,
    (t) => `${t.repo}, ${t.peak}, ${t.commits}. That's not a summary, that's a pattern.`,
    (t) => `This is where the ${t.arch} myth meets the activity log.`,
  ],
  motivational: [
    (t) => `${t.period} was yours: ${t.commits} commits, ${t.streak} days, zero excuses.`,
    (t) => `This is the story of a ${t.arch} who refused to coast.`,
    (t) => `${t.commits} commits. One direction: forward. Let's run it back.`,
    (t) => `${t.period} became a marker, not because it was easy, but because you kept moving through it.`,
    (t) => `${t.arch} wasn't declared at the start of ${t.period}. It was built there.`,
    (t) => `${t.repo}, ${t.peak}, and ${t.commits} commits later, the trajectory is impossible to ignore.`,
    (t) => `${t.period} left a trail, and every one of those ${t.commits} commits helped draw it.`,
    (t) => `${t.period} was built in the quiet repetitions that most people never notice.`,
    (t) => `${t.arch} became real the same way all durable things do: one more day, one more commit, one more push.`,
  ],
};

const CAPTION: Record<AiTone, ((t: T) => string)[]> = {
  funny: [
    (t) => `@${t.name}: ${t.arch}, ${t.commits} commits, and a ${t.peak} sleep schedule. Send help.`,
    (t) => `My planet runs on ${t.lang} and ${t.commits} commits. No notes.`,
    (t) => `${t.streak}-day streak, ${t.repos} repos, zero regrets. Mostly.`,
    (t) => `@${t.name}: powered by ${t.repo}, poor decisions at ${t.peak}, and ${t.commits} commits of follow-through.`,
    (t) => `${t.arch} behavior detected. Side effects include ${t.repos} repos and conversations with ${t.repo}.`,
    (t) => `${t.period}: one username, ${t.commits} commits, and not nearly enough daylight.`,
    (t) => `@${t.name}: ${t.repo} enthusiast, ${t.lang} specialist, and part-time enemy of normal hours.`,
    (t) => `${t.commits} commits, ${t.streak} days, and vibes last seen at ${t.peak}.`,
    (t) => `${t.arch} season: loud stats, late nights, and absolutely no chill.`,
  ],
  brutal: [
    (t) => `@${t.name} — ${t.commits} commits, a streak down to ${t.curStreak}. The grind is real, the sleep is not.`,
    (t) => `${t.arch} on paper. ${t.commits} commits in reality. You decide.`,
    (t) => `${t.nightPct}% nocturnal. ${t.commits} commits. This is fine.`,
    (t) => `@${t.name}: ${t.repo} got the best years of your life and still wanted more.`,
    (t) => `${t.commits} commits. ${t.peak} habits. ${t.arch} consequences.`,
    (t) => `${t.period} wasn't a balance story. It was a velocity story.`,
    (t) => `@${t.name}: the grind was consistent, the sleep was optional, the numbers are public.`,
    (t) => `${t.repo} again, ${t.peak} again, and ${t.commits} reasons to reconsider your choices.`,
    (t) => `${t.arch}, but make it look mildly concerning in chart form.`,
  ],
  motivational: [
    (t) => `@${t.name}: ${t.commits} commits, ${t.streak} unbroken days. Built, not given.`,
    (t) => `${t.arch}. ${t.commits} commits. ${t.prs} PRs. This is what showing up looks like.`,
    (t) => `${t.period} in one line: ${t.commits} commits and a refusal to quit.`,
    (t) => `@${t.name}: ${t.repo} in focus, ${t.period} in motion, and ${t.commits} commits to prove it.`,
    (t) => `${t.arch} energy, ${t.streak} days, and the kind of momentum that survives fatigue.`,
    (t) => `${t.period}: less noise, more follow-through. ${t.commits} commits worth of it.`,
    (t) => `@${t.name}: steady hands, real output, and ${t.streak} days that didn't happen by accident.`,
    (t) => `${t.commits} commits and a clear signal that you know how to keep going when it matters.`,
    (t) => `${t.arch} with substance behind it. That's the difference.`,
  ],
};

export function buildFallbackNarrative(input: FallbackInput, tone: AiTone): FallbackNarrative {
  const safeTone: AiTone = (["funny", "brutal", "motivational"] as AiTone[]).includes(tone) ? tone : "funny";
  const t = tokens(input);
  return {
    roastLine: rand(ROAST[safeTone])(t),
    archetypeDescription: rand(DESC[safeTone])(t),
    introVibeLine: rand(INTRO[safeTone])(t),
    shareCaption: rand(CAPTION[safeTone])(t),
  };
}
