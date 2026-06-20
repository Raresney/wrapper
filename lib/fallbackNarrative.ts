import type { AiTone, ArchetypeId } from "@/types/wrapped";

// ── Profile-driven, per-run-diverse fallback narrative ──────────────────────
// Produces the same four fields the LLM would, but assembled procedurally from
// the user's REAL stats. Every call re-rolls, so two runs of the same user with
// the same tone yield different text — and every line references actual numbers.

export type FallbackInput = {
  username: string;
  archetype: string;        // human label, e.g. "Foundry"
  archetypeId: ArchetypeId;
  primaryWeight: number;    // 0–100
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
    (t) => t.curStreak < t.streak
      ? `Your longest streak hit ${t.streak} days. Your current one is ${t.curStreak}. We won't ask what happened.`
      : `Your longest streak is ${t.streak} days — and it's still going. Whatever you're doing, don't stop.`,
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
    (t) => t.curStreak < t.streak
      ? `A ${t.streak}-day streak that's now down to ${t.curStreak}. Consistency was a phase, apparently.`
      : `A ${t.streak}-day streak, still active. The calendar is genuinely afraid of you.`,
    (t) => `${t.repos} repos, and ${t.repo} ate most of your year. Spreading thin or just stuck?`,
    (t) => `${t.prs} PRs merged. Impressive — until you realize how many ${t.peak} nights it cost you.`,
    (t) => `All that ${t.lang} and nothing to show but ${t.commits} commits. The numbers don't lie, and they're not kind.`,
    (t) => `You call it ${t.arch}. The data calls it a cry for a calendar.`,
    (t) => `${t.repo} became your whole personality and somehow still demanded overtime.`,
    (t) => t.curStreak < t.streak
      ? `${t.nightPct}% after dark, ${t.curStreak} right now, and ${t.streak} in the past. The plot wrote itself.`
      : `${t.nightPct}% after dark, ${t.curStreak} days and still counting. The plot has no ending yet.`,
    (t) => `${t.prs} merged PRs doesn't erase the fact that ${t.peak} became a lifestyle mistake.`,
    (t) => `${t.commits} commits over ${t.period}. Busy, yes. Balanced, absolutely not.`,
    (t) => `${t.repo} got fed, your schedule got wrecked, and ${t.commits} commits are all the evidence anyone needs.`,
    (t) => t.curStreak < t.streak
      ? `${t.streak} days once, ${t.curStreak} now. Even your momentum got tired of your habits.`
      : `${t.streak} days and still running. The streak has outlived most people's good intentions.`,
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
    (t) => t.curStreak < t.streak
      ? `A ${t.streak}-day streak that collapsed to ${t.curStreak}. ${t.nightPct}% of your output bleeds past midnight. ${t.commits} commits and you still treat sleep like an optional dependency.`
      : `A ${t.streak}-day streak, still running. ${t.nightPct}% of your output bleeds past midnight. ${t.commits} commits and you still treat sleep like an optional dependency.`,
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
    (t) => t.curStreak < t.streak
      ? `@${t.name} — ${t.commits} commits, a streak down to ${t.curStreak}. The grind is real, the sleep is not.`
      : `@${t.name} — ${t.commits} commits, ${t.curStreak}-day streak active. The grind is real, the sleep is not.`,
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

// ── Archetype-specific roast lines (3 per archetype, stat-interpolated) ─────
// Selected instead of the generic ROAST pool when archetypeId is known.
const ARCH_ROAST: Record<ArchetypeId, ((t: T) => string)[]> = {
  foundry: [
    (t) => `${t.commits} commits across ${t.repos} repos — that's not a sprint, that's a conveyor belt. ${t.lang} was the fuel; the pace was the point.`,
    (t) => `You didn't build one thing. You built ${t.repos} things, shipped ${t.commits} commits, and somehow kept it moving.`,
    (t) => `${t.repos} repos and ${t.commits} commits says scope is something that happens to other people.`,
  ],
  afterglow: [
    (t) => `${t.nightPct}% of your commits land after dark. The moon has seen more of your work than your coworkers have.`,
    (t) => `${t.peak} is your golden hour. ${t.commits} commits later, circadian rhythms are clearly optional.`,
    (t) => `${t.commits} commits, mostly shipped when the rest of the world was asleep. Classic ${t.arch} behavior.`,
  ],
  trail_mapper: [
    (t) => `${t.repos} repos, ${t.lang} on top — and still you kept looking for the next one.`,
    (t) => `Wide reach, variable depth. ${t.repos} repos and ${t.commits} commits is impressive until you count the directions it went.`,
    (t) => `You sampled ${t.lang}, started ${t.repos} repos, and called it a strategy. Somehow it worked.`,
  ],
  cartographer: [
    (t) => `${t.repo} got everything. The other ${t.repos} repos got whatever was left.`,
    (t) => `${t.commits} commits and most of them point back to ${t.repo}. Focused or stuck — only you know which.`,
    (t) => `You went deep on ${t.lang} and ${t.repo}, and the data couldn't be more obvious about it.`,
  ],
  silent_current: [
    (t) => `${t.commits} commits spread across a very quiet year. The gaps did most of the communicating.`,
    (t) => `${t.curStreak} days current streak. The silence has been doing most of the talking.`,
    (t) => `Sparse, considered, and occasionally explosive. ${t.commits} commits on your own schedule.`,
  ],
  signal_booster: [
    (t) => `${t.prs} PRs merged and people actually noticed. That's rarer than the number makes it sound.`,
    (t) => `${t.commits} commits with enough reach that the follower count kept moving. The signal traveled.`,
    (t) => `The work escaped your local machine. ${t.prs} PRs later, other people care about your repos.`,
  ],
  anvil: [
    (t) => `${t.streak} days in a row. That's not a streak — that's a documented personality trait.`,
    (t) => `${t.commits} commits, ${t.streak}-day best streak. Somewhere a productivity coach is taking notes.`,
    (t) => `You showed up ${t.streak} days in a row and the codebase didn't even leave a thank-you note.`,
  ],
  chaos_pilot: [
    (t) => `${t.repos} repos and at least some of them remember you fondly.`,
    (t) => `${t.commits} commits spread across ${t.repos} repos. Focus was optional. Coverage was not.`,
    (t) => `You started ${t.repos} things. The ones that mattered got finished. Probably.`,
  ],
  flashpoint: [
    (t) => `The momentum is new and it's real. ${t.commits} commits later, the trajectory is hard to argue with.`,
    (t) => `${t.streak}-day streak and still accelerating. Something clicked and the data is very loud about it.`,
    () => `You went from background noise to trajectory faster than the git log expected.`,
  ],
  constellation_weaver: [
    (t) => `${t.prs} PRs merged. You didn't just contribute — you kept coming back until it landed.`,
    (t) => `${t.commits} commits and ${t.prs} PRs. You build things with people, not despite them.`,
    (t) => `${t.prs} merged PRs and a collaboration footprint that doesn't stay contained to your own repos.`,
  ],
  caretaker: [
    (t) => `${t.repo} didn't get new features. It got better. That's a different kind of discipline.`,
    (t) => `${t.commits} commits and most of them cleaned something up that needed it. Rare.`,
    (t) => `You refactored what needed it and fixed what nobody else would touch. ${t.repo} owes you.`,
  ],
  deep_diver: [
    (t) => `${t.lang} got everything. The other languages got polite consideration and nothing else.`,
    (t) => `${t.commits} commits and ${t.lang} runs through most of them. That's not preference — that's identity.`,
    (t) => `You went deep on ${t.lang} and the distribution is not subtle about it.`,
  ],
  archive_keeper: [
    (t) => `${t.repos} repos, a ${t.streak}-day best streak, and an account old enough to have strong opinions.`,
    (t) => `The account depth shows. ${t.commits} commits across a timeline that newer accounts haven't had time to build.`,
    (t) => `${t.streak} days at your best, ${t.repos} repos in the catalog. That's a body of work with actual mass.`,
  ],
  lone_orbit: [
    (t) => `${t.prs} PRs merged. Apparently you prefer building alone and ${t.commits} commits of data agrees.`,
    (t) => `${t.commits} commits, ${t.repos} repos, ${t.prs} PRs. The team size is one, by design.`,
    (t) => `You shipped ${t.commits} commits without much need for review. That's one way to stay unblocked.`,
  ],
};

// ── Archetype-specific description pools ─────────────────────────────────────
// hi  → weight ≥ 55%  |  mid → 38–54%  |  lo → < 38%
// Each tier has 2 stat-interpolated options for randomness across runs.
type DescPool = { hi: ((t: T) => string)[]; mid: ((t: T) => string)[]; lo: ((t: T) => string)[] };

const ARCH_DESC: Record<ArchetypeId, DescPool> = {
  foundry: {
    hi: [
      (t) => `You didn't build one thing — you built ${t.repos} of them. ${t.commits} commits and the forge never cooled down. ${t.lang} was the fuel; the pace was the point.`,
      (t) => `${t.commits} commits across ${t.repos} repos isn't output — it's infrastructure. The foundry doesn't stop for anyone, and yours didn't either.`,
    ],
    mid: [
      (t) => `High output, wide spread: ${t.commits} commits across ${t.repos} repos shows a builder who doesn't stop to ask permission.`,
      (t) => `${t.repos} repos and ${t.commits} commits is a body of work that outgrew a single direction. The production line ran long.`,
    ],
    lo: [
      (t) => `A foundry tendency shows in the numbers — ${t.commits} commits and ${t.repos} repos, more spread than the average run.`,
      () => `The output volume and repo count hint at a builder mindset, even if it doesn't dominate the whole picture yet.`,
    ],
  },
  afterglow: {
    hi: [
      (t) => `${t.nightPct}% of your commits land after dark. The peak at ${t.peak} isn't a coincidence — it's the rhythm. The world sleeps; you build.`,
      (t) => `Late-night is your default. ${t.nightPct}% nocturnal, ${t.commits} commits, and a ${t.peak} peak that's become a signature.`,
    ],
    mid: [
      (t) => `The late hours show up clearly — ${t.nightPct}% of commits happening after dark, with ${t.peak} as the regular slot.`,
      (t) => `Night skews the numbers. ${t.nightPct}% of ${t.commits} commits happened when most people were already offline.`,
    ],
    lo: [
      (t) => `A nocturnal lean shows in the data — ${t.nightPct}% commits after dark, ${t.peak} as a recurring timestamp.`,
      (t) => `The late-night pull is real, if not the dominant story — ${t.nightPct}% of output lands in the quiet hours.`,
    ],
  },
  trail_mapper: {
    hi: [
      (t) => `${t.repos} repos, ${t.lang} on top but never the whole story. You don't stay in one place long enough for the map to feel finished.`,
      (t) => `Wide coverage is the signature: ${t.lang}, ${t.repos} repos, and a restlessness that shows in every direction the work went.`,
    ],
    mid: [
      (t) => `The breadth is real — ${t.repos} repos and ${t.lang} at the front of a spread that kept expanding.`,
      (t) => `Explorer patterns in the data: ${t.repos} repos, ${t.lang} leading, ${t.commits} commits spread across a moving target.`,
    ],
    lo: [
      (t) => `Some crosswind tendencies in the numbers — ${t.repos} repos and ${t.lang} leading a spread that's wider than most.`,
      (t) => `A bit more range than average: ${t.repos} repos, ${t.lang} on top, and a pattern that kept wandering.`,
    ],
  },
  cartographer: {
    hi: [
      (t) => `${t.repo} got the full weight of it. ${t.commits} commits, ${t.lang} all the way through, and a focus that the data makes impossible to miss.`,
      (t) => `You mapped ${t.repo} in depth. ${t.commits} commits, ${t.lang} as the tool, and a clarity of direction that shows in every line of the log.`,
    ],
    mid: [
      (t) => `The center of gravity is clear: ${t.repo}, ${t.lang}, ${t.commits} commits going mostly the same direction.`,
      (t) => `Deliberate and focused — ${t.repo} pulled the most attention and ${t.lang} carried most of the load.`,
    ],
    lo: [
      (t) => `A focus tendency shows — ${t.repo} stands out, ${t.lang} dominates, even if the pattern isn't total.`,
      (t) => `Some bedrock traits in the data: ${t.repo} getting more attention than average, ${t.lang} at the front.`,
    ],
  },
  silent_current: {
    hi: [
      (t) => `${t.commits} commits across a run where the gaps did as much work as the sprints. Quiet isn't absence — it's a different kind of output.`,
      (t) => `The activity log reads in waves: ${t.commits} commits, ${t.curStreak} days current, stretches of silence between that are just as deliberate.`,
    ],
    mid: [
      (t) => `The pattern is irregular but intentional — ${t.commits} commits arriving in clusters, with space between that the data doesn't fully explain.`,
      (t) => `Sporadic and real: ${t.commits} commits spread unevenly, a ${t.curStreak}-day current streak, and a cadence nobody scheduled.`,
    ],
    lo: [
      (t) => `Some quiet stretches in the log, with ${t.commits} commits arriving in uneven bursts rather than steady rhythm.`,
      (t) => `The activity pattern has gaps — ${t.commits} commits across a period that didn't commit to any particular pace.`,
    ],
  },
  signal_booster: {
    hi: [
      (t) => `${t.prs} PRs merged and the reach goes past the local machine. Your work attracted attention because it deserved to — ${t.commits} commits that left a real signal.`,
      (t) => `The feedback loop is real: ${t.commits} commits, ${t.prs} PRs, and a presence that reached past your own repos and stuck.`,
    ],
    mid: [
      (t) => `More external traction than most — ${t.prs} PRs merged, and ${t.commits} commits that didn't stay contained.`,
      (t) => `The signal traveled: ${t.prs} merged PRs and a body of work that picked up momentum outside its source.`,
    ],
    lo: [
      (t) => `Some catalyst markers in the data — ${t.prs} PRs and ${t.commits} commits with more reach than average.`,
      (t) => `A few data points suggest the work landed beyond the immediate repo — ${t.prs} PRs, some traction worth watching.`,
    ],
  },
  anvil: {
    hi: [
      (t) => `${t.streak} days in a row is the headline, but the real story is what that took. ${t.commits} commits built one decision at a time, and none of them optional.`,
      (t) => `Consistent doesn't mean slow. ${t.streak} days, ${t.commits} commits, and an activity pattern that doesn't have a skip day.`,
    ],
    mid: [
      (t) => `The streak and the commit count tell the same story: ${t.streak} days at the longest, ${t.commits} total, with a rhythm that held.`,
      (t) => `Steady above all else — ${t.commits} commits across a run where ${t.streak} days in a row left a visible mark.`,
    ],
    lo: [
      (t) => `Steadier than average: ${t.streak}-day best streak, ${t.commits} commits with a consistency that shows through the noise.`,
      (t) => `The anvil tendency is there in the data — ${t.streak} days at best, ${t.commits} commits, a pattern that tried to hold and mostly did.`,
    ],
  },
  chaos_pilot: {
    hi: [
      (t) => `${t.repos} repos, ${t.commits} commits, and not all of it going the same direction. That's not a failure — that's what maximum coverage looks like in practice.`,
      (t) => `${t.commits} commits across ${t.repos} repos, ${t.lang} technically on top, but the real story is how many directions this went simultaneously.`,
    ],
    mid: [
      (t) => `The breadth is real and so is the scatter — ${t.repos} repos, ${t.commits} commits, and a spread that doesn't resolve into one clear thing.`,
      (t) => `A restless pattern: ${t.repos} repos, ${t.lang} at the front, and ${t.commits} commits distributed across a moving target.`,
    ],
    lo: [
      (t) => `Some pilot energy in the data — ${t.repos} repos, ${t.lang} leading, but the spread is wider than the focus.`,
      (t) => `A bit of chaos in the spread: ${t.repos} repos, ${t.commits} commits across directions that didn't all converge.`,
    ],
  },
  flashpoint: {
    hi: [
      (t) => `The momentum is recent and it's real. ${t.commits} commits with a ${t.streak}-day streak that suggests something shifted — and it's still moving.`,
      (t) => `You went from quiet to trajectory. The recent output has a velocity the earlier numbers didn't have, and the ${t.streak}-day mark proves it locked in.`,
    ],
    mid: [
      (t) => `Growth is visible in the data: ${t.commits} commits with a recent acceleration and a ${t.streak}-day streak that showed up late and hit hard.`,
      (t) => `The trend is up — ${t.commits} commits, more recent than the average, and a momentum pattern that didn't exist at the start of the period.`,
    ],
    lo: [
      (t) => `An uptick shows in the data — ${t.commits} commits trending more recent, ${t.streak} days at the best, something building.`,
      (t) => `Some flashpoint signals: recent output running hotter, ${t.streak}-day streak as evidence, ${t.commits} commits with a forward lean.`,
    ],
  },
  constellation_weaver: {
    hi: [
      (t) => `${t.prs} PRs merged is the number that defines this run. You built things collaboratively, and ${t.commits} commits later, the network is clearly visible.`,
      (t) => `The collaboration signature is unmistakable: ${t.prs} PRs, ${t.commits} commits, and a presence that other people actually engaged with and kept coming back to.`,
    ],
    mid: [
      (t) => `${t.prs} PRs merged puts you above most in collaboration — ${t.commits} commits, and a pattern that didn't stay self-contained.`,
      (t) => `More collaborative than the median: ${t.prs} PRs and ${t.commits} commits that kept reaching outward.`,
    ],
    lo: [
      (t) => `Some weaver traits in the data — ${t.prs} PRs and ${t.commits} commits with more collaborative pull than average.`,
      (t) => `A few collaboration markers: ${t.prs} PRs merged, ${t.commits} commits, and a pattern that occasionally needed other people.`,
    ],
  },
  caretaker: {
    hi: [
      (t) => `${t.repo} didn't just grow — it got better. ${t.commits} commits weighted toward fixes and cleanup say more about craft than volume ever could.`,
      (t) => `The commit history reads like maintenance done with intent: ${t.repo}, ${t.commits} commits, ${t.lang}, and a bias toward making things right over making them new.`,
    ],
    mid: [
      (t) => `More cleanup than creation: ${t.commits} commits across ${t.repo}, with a pattern that favors precision over velocity.`,
      (t) => `The maintainer instinct shows — ${t.commits} commits and a log that leans toward fixes, refactors, and the work nobody else wanted to do.`,
    ],
    lo: [
      (t) => `Some ironsmith traits in the data — ${t.commits} commits with a higher-than-average lean toward fixes and polished work on ${t.repo}.`,
      (t) => `A few caretaker signals: ${t.repo} getting careful treatment, ${t.commits} commits with more craft than sprint energy.`,
    ],
  },
  deep_diver: {
    hi: [
      (t) => `${t.lang} ran the whole show. ${t.commits} commits deep, one stack, one direction — you didn't need a map because you knew exactly where you were going.`,
      (t) => `${t.commits} commits in ${t.lang} and the language distribution makes everything else look like a guest appearance. That's depth, not limitation.`,
    ],
    mid: [
      (t) => `${t.lang} dominates the distribution by a margin that isn't subtle. ${t.commits} commits and the stack stayed consistent.`,
      (t) => `A clear bias toward ${t.lang}: ${t.commits} commits and a spread that didn't leave much room for alternatives.`,
    ],
    lo: [
      (t) => `${t.lang} shows up disproportionately in ${t.commits} commits — not a monolith yet, but the lean is real and consistent.`,
      (t) => `One language pulling ahead: ${t.lang} in most of the ${t.commits} commits, with the others trailing noticeably.`,
    ],
  },
  archive_keeper: {
    hi: [
      (t) => `This isn't a snapshot — it's a record. ${t.repos} repos, a ${t.streak}-day best streak, and an account depth that newer ones simply haven't had time to build.`,
      (t) => `Years of work leave a different kind of weight. ${t.commits} commits, ${t.repos} repos, and a ${t.streak}-day streak that didn't happen this year alone.`,
    ],
    mid: [
      (t) => `The longer arc shows in the numbers — ${t.repos} repos, ${t.streak} days at best, ${t.commits} commits across a run with real history behind it.`,
      (t) => `Account depth is visible: ${t.repos} repos, ${t.commits} commits, and a streak record that took time to build.`,
    ],
    lo: [
      (t) => `Some veteran markers: ${t.repos} repos, ${t.streak}-day record, ${t.commits} commits across a timeline longer than most.`,
      (t) => `The history is there in the data — ${t.repos} repos, ${t.streak} days at the longest, a body of work that's been accumulating.`,
    ],
  },
  lone_orbit: {
    hi: [
      (t) => `${t.prs} PRs merged is intentionally low. ${t.commits} commits, ${t.repos} repos, and almost none of it needed another person to review. That's not isolation — that's self-sufficiency.`,
      (t) => `Solo by design: ${t.commits} commits, ${t.prs} PRs, and a log that reads like one person decided exactly what to build and built it without waiting for consensus.`,
    ],
    mid: [
      (t) => `Mostly self-directed: ${t.commits} commits, ${t.prs} PRs, and a pattern that preferred ownership over collaboration.`,
      (t) => `Low PRs, high focus: ${t.commits} commits across ${t.repos} repos with ${t.prs} merged PRs says the work stayed in-house by choice.`,
    ],
    lo: [
      (t) => `A lone-orbit lean in the data — ${t.prs} PRs and ${t.commits} commits with less collaborative engagement than average.`,
      (t) => `Some solo signals: ${t.prs} PRs merged, ${t.commits} commits, and a tendency to keep the work self-contained.`,
    ],
  },
};

function archetypeDescTier(weight: number): keyof DescPool {
  if (weight >= 55) return "hi";
  if (weight >= 38) return "mid";
  return "lo";
}

// ── Archetype-specific intro vibe lines ──────────────────────────────────────
const ARCH_INTRO: Record<ArchetypeId, ((t: T) => string)[]> = {
  foundry: [
    (t) => `${t.repos} repos, ${t.commits} commits, and a pace that didn't ask anyone's permission.`,
    (t) => `The forge ran hot all of ${t.period}: ${t.commits} commits built, ${t.repos} repos shipped.`,
    (t) => `${t.period}: ${t.lang}, ${t.repos} repos, ${t.commits} commits. The Foundry never cooled down.`,
  ],
  afterglow: [
    (t) => `${t.nightPct}% of the work happened after dark. The rest was just warm-up.`,
    (t) => `Welcome to the Afterglow era — ${t.commits} commits, peak at ${t.peak}, sleep schedule: pending.`,
    (t) => `${t.period} ran on late nights and ${t.lang}. The timestamps don't lie.`,
  ],
  trail_mapper: [
    (t) => `${t.repos} repos, ${t.commits} commits, and not one direction that lasted the whole year.`,
    (t) => `Welcome to the trail: ${t.repos} repos charted, ${t.commits} commits dropped, ${t.lang} leading.`,
    (t) => `${t.period} looked like exploration. It was. ${t.repos} repos prove it.`,
  ],
  cartographer: [
    (t) => `${t.repo} got everything. ${t.commits} commits. One map, one focus, no detours.`,
    (t) => `Welcome to the deep end of ${t.repo} — ${t.commits} commits, ${t.lang}, full attention.`,
    (t) => `${t.period}: mostly ${t.repo}, mostly ${t.lang}. The focus was the whole point.`,
  ],
  silent_current: [
    (t) => `${t.commits} commits across ${t.period}, arriving exactly when they needed to.`,
    (t) => `Welcome to the current — quiet for a reason, ${t.commits} commits deep.`,
    (t) => `${t.period} ran on its own schedule. The log caught up eventually.`,
  ],
  signal_booster: [
    (t) => `${t.commits} commits, ${t.prs} PRs merged. The signal left your machine and kept going.`,
    (t) => `Welcome to the amplified run — ${t.commits} commits, ${t.prs} PRs, reach beyond the source.`,
    (t) => `${t.period}: the work traveled. ${t.prs} merged PRs is the receipt.`,
  ],
  anvil: [
    (t) => `${t.streak} days in a row. ${t.commits} commits. This era didn't believe in rest days.`,
    (t) => `Welcome to the streak — ${t.streak} days at the longest, ${t.commits} commits as proof.`,
    (t) => `${t.period}: one unbroken run. ${t.streak} days, ${t.commits} commits, no exceptions.`,
  ],
  chaos_pilot: [
    (t) => `${t.repos} repos, ${t.commits} commits, and a flight plan nobody else would recognize.`,
    (t) => `Welcome to the cockpit: ${t.repos} repos spinning, ${t.commits} commits launched, ${t.lang} technically winning.`,
    (t) => `${t.period} went everywhere at once. ${t.repos} repos is the evidence.`,
  ],
  flashpoint: [
    (t) => `Something clicked in ${t.period}. ${t.streak} days and ${t.commits} commits later, it's still going.`,
    (t) => `Welcome to the acceleration — ${t.commits} commits trending up and a ${t.streak}-day streak that hit hard.`,
    (t) => `${t.period} started quiet and ended loud. The trajectory is right there in the data.`,
  ],
  constellation_weaver: [
    (t) => `${t.commits} commits, ${t.prs} PRs merged. The work didn't stay local — it connected.`,
    (t) => `Welcome to the woven run — ${t.commits} commits, ${t.prs} PRs, and a network that kept growing.`,
    (t) => `${t.period}: ${t.prs} PRs merged. You built with people, not just for them.`,
  ],
  caretaker: [
    (t) => `${t.repo} got better. ${t.commits} commits as proof. That's the whole story.`,
    (t) => `Welcome to the maintenance era — ${t.repo}, ${t.commits} commits, and a log full of things made right.`,
    (t) => `${t.period}: the kind of work that makes ${t.repo} proud. ${t.commits} commits, carefully placed.`,
  ],
  deep_diver: [
    (t) => `${t.lang}, ${t.commits} commits, one direction. The dive was the destination.`,
    (t) => `Welcome to the deep end of ${t.lang} — ${t.commits} commits and a distribution that barely noticed anything else.`,
    (t) => `${t.period}: ${t.lang} ran everything. ${t.commits} commits say you had no reason to look elsewhere.`,
  ],
  archive_keeper: [
    (t) => `${t.repos} repos, ${t.commits} commits, and an account that's been building longer than most.`,
    (t) => `Welcome to the archive — ${t.commits} commits, ${t.repos} repos, and a timeline with real depth behind it.`,
    (t) => `${t.period} built on everything before it. ${t.repos} repos, ${t.streak} days at the best streak.`,
  ],
  lone_orbit: [
    (t) => `${t.commits} commits, ${t.repos} repos, ${t.prs} PRs. The work stayed close and the results speak anyway.`,
    (t) => `Welcome to the orbit — ${t.commits} commits, mostly your own repos, mostly on your own terms.`,
    (t) => `${t.period}: self-directed and complete. ${t.commits} commits, ${t.prs} PRs merged, by choice.`,
  ],
};

// ── Archetype-specific share captions ────────────────────────────────────────
const ARCH_CAPTION: Record<ArchetypeId, ((t: T) => string)[]> = {
  foundry: [
    (t) => `@${t.name}: ${t.repos} repos, ${t.commits} commits. The Foundry never closed. #GitHubWrapped`,
    (t) => `${t.lang} + ${t.repos} repos + ${t.commits} commits = The Foundry. That's the whole equation.`,
    (t) => `${t.commits} commits. ${t.repos} repos. No days off. #GitHubWrapped`,
  ],
  afterglow: [
    (t) => `@${t.name}: ${t.nightPct}% nocturnal, ${t.commits} commits, peak at ${t.peak}. The Afterglow doesn't sleep. #GitHubWrapped`,
    (t) => `${t.commits} commits and a ${t.peak} bedtime. The Afterglow is real.`,
    (t) => `Peak at ${t.peak}, ${t.nightPct}% after dark, ${t.commits} commits shipped. Classic Afterglow. #GitHubWrapped`,
  ],
  trail_mapper: [
    (t) => `@${t.name}: ${t.repos} repos, ${t.commits} commits, ${t.lang}. The trail goes further than the map. #GitHubWrapped`,
    (t) => `${t.lang} leads, ${t.repos} repos follow, ${t.commits} commits scatter. Trail Mapper behavior.`,
    (t) => `${t.commits} commits, ${t.repos} repos, and a different horizon every month. #GitHubWrapped`,
  ],
  cartographer: [
    (t) => `@${t.name}: ${t.commits} commits, mostly ${t.repo}, mostly ${t.lang}. One map. One direction. #GitHubWrapped`,
    (t) => `${t.repo} got the focus. ${t.commits} commits confirm it. #GitHubWrapped`,
    (t) => `${t.lang} + ${t.repo} + ${t.commits} commits. The Cartographer doesn't wander. #GitHubWrapped`,
  ],
  silent_current: [
    (t) => `@${t.name}: ${t.commits} commits, ${t.curStreak} days current streak. Quiet isn't absence. #GitHubWrapped`,
    (t) => `${t.commits} commits on a schedule nobody else set. Silent Current energy.`,
    (t) => `${t.period}: ${t.commits} commits, arriving exactly when they needed to. #GitHubWrapped`,
  ],
  signal_booster: [
    (t) => `@${t.name}: ${t.commits} commits, ${t.prs} PRs merged. The signal traveled. #GitHubWrapped`,
    (t) => `${t.prs} PRs merged and the reach kept going. Signal Booster behavior. #GitHubWrapped`,
    (t) => `${t.commits} commits, ${t.prs} PRs, and a presence that escaped my own repos. #GitHubWrapped`,
  ],
  anvil: [
    (t) => `@${t.name}: ${t.streak} days in a row. ${t.commits} commits. The Anvil doesn't take days off. #GitHubWrapped`,
    (t) => `${t.streak}-day streak, ${t.commits} commits. Consistency was the whole strategy. #GitHubWrapped`,
    (t) => `${t.commits} commits, ${t.streak} unbroken days. That's not a habit, that's an identity. #GitHubWrapped`,
  ],
  chaos_pilot: [
    (t) => `@${t.name}: ${t.repos} repos, ${t.commits} commits, and a flight plan nobody else would recognize. #GitHubWrapped`,
    (t) => `${t.repos} repos, ${t.lang} technically winning, ${t.commits} commits everywhere. Chaos Pilot behavior.`,
    (t) => `${t.commits} commits, ${t.repos} repos, no particular altitude. #GitHubWrapped`,
  ],
  flashpoint: [
    (t) => `@${t.name}: ${t.commits} commits and a ${t.streak}-day streak that appeared out of nowhere and stuck. #GitHubWrapped`,
    (t) => `Something clicked. ${t.streak} days, ${t.commits} commits, still accelerating. Flashpoint. #GitHubWrapped`,
    (t) => `${t.period}: quiet start, loud finish. ${t.commits} commits and a trajectory that's hard to argue with. #GitHubWrapped`,
  ],
  constellation_weaver: [
    (t) => `@${t.name}: ${t.commits} commits, ${t.prs} PRs merged. Built with people, not just for them. #GitHubWrapped`,
    (t) => `${t.prs} PRs merged and the network kept growing. Constellation Weaver behavior. #GitHubWrapped`,
    (t) => `${t.commits} commits, ${t.prs} PRs, and a collaboration footprint that didn't stay contained. #GitHubWrapped`,
  ],
  caretaker: [
    (t) => `@${t.name}: ${t.commits} commits on ${t.repo}. Not new features. Better code. #GitHubWrapped`,
    (t) => `${t.commits} commits and most of them made ${t.repo} better than they found it. Caretaker behavior.`,
    (t) => `${t.repo} is in good hands. ${t.commits} commits of evidence. #GitHubWrapped`,
  ],
  deep_diver: [
    (t) => `@${t.name}: ${t.commits} commits, almost all of them in ${t.lang}. The Deep Diver goes one direction. #GitHubWrapped`,
    (t) => `${t.lang}. ${t.commits} commits. One stack. No detours. #GitHubWrapped`,
    (t) => `${t.commits} commits deep in ${t.lang} and the distribution didn't even notice anything else. #GitHubWrapped`,
  ],
  archive_keeper: [
    (t) => `@${t.name}: ${t.repos} repos, ${t.commits} commits, and an account that's been building longer than most. #GitHubWrapped`,
    (t) => `${t.commits} commits across a timeline that newer accounts haven't had time to build. Archive Keeper energy.`,
    (t) => `${t.streak}-day best streak, ${t.repos} repos, ${t.commits} commits. The Archive Keeper keeps receipts. #GitHubWrapped`,
  ],
  lone_orbit: [
    (t) => `@${t.name}: ${t.commits} commits, ${t.prs} PRs. The Lone Orbit ships solo. #GitHubWrapped`,
    (t) => `${t.commits} commits, ${t.repos} repos, ${t.prs} PRs merged. Self-sufficient by design. #GitHubWrapped`,
    (t) => `${t.commits} commits on my own terms. ${t.prs} PRs says it all. #GitHubWrapped`,
  ],
};

export function buildFallbackNarrative(input: FallbackInput, tone: AiTone): FallbackNarrative {
  const safeTone: AiTone = (["funny", "brutal", "motivational"] as AiTone[]).includes(tone) ? tone : "funny";
  const t = tokens(input);
  const archRoast = ARCH_ROAST[input.archetypeId];
  const archDesc  = ARCH_DESC[input.archetypeId];
  const archIntro = ARCH_INTRO[input.archetypeId];
  const archCaption = ARCH_CAPTION[input.archetypeId];
  const tier      = archetypeDescTier(input.primaryWeight);
  return {
    roastLine:            archRoast   ? rand(archRoast)(t)        : rand(ROAST[safeTone])(t),
    archetypeDescription: archDesc    ? rand(archDesc[tier])(t)   : rand(DESC[safeTone])(t),
    introVibeLine:        archIntro   ? rand(archIntro)(t)        : rand(INTRO[safeTone])(t),
    shareCaption:         archCaption ? rand(archCaption)(t)      : rand(CAPTION[safeTone])(t),
  };
}
