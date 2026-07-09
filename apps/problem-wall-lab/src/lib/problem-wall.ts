import type { BurstDimension, BurstScore, ClientBrief, ProblemCandidate, SourceSignal, WeeklyWallInput } from "./types";

const STAT_PATTERN = /(\d+%|\d+\s?in\s?\d+|\d+\.\d+|million|billion|trillion|x\b|double|half|majority)/i;
const WEAK_WORDS = /\b(people|things|stuff|better|more|help|important|everyone|issue|problem)\b/gi;

export function scoreProblemCandidate(candidate: ProblemCandidate): BurstScore {
  const combined = `${candidate.problem} ${candidate.opportunity} ${candidate.details}`;
  const sources = candidate.sources ?? [];
  const hasStat = STAT_PATTERN.test(combined) || sources.some((source) => Boolean(source.stat && STAT_PATTERN.test(source.stat)));
  const hasUrgency = sources.some((source) => Boolean(source.urgency)) || /\b(now|new|surge|rising|increasing|today|heat|policy|weekly)\b/i.test(combined);
  const hasWhy = sources.some((source) => Boolean(source.whyItMatters)) || /\b(because|cost|risk|death|safety|care|career|money|health|trust)\b/i.test(combined);
  const hasFreshAngle = /\b(unnoticed|hidden|quietly|unexpected|instead of|versus|not just|while|until|but)\b/i.test(combined);
  const hasSpecificAudience = candidate.audience.split(/\s+/).length > 1 && !/^people$/i.test(candidate.audience);
  const hasCause = /\bbecause\b/i.test(candidate.problem) || /\bkeeps?|prevents?|stops?|miss|avoid|fear|struggle|default\b/i.test(combined);
  const weakWordCount = (candidate.problem.match(WEAK_WORDS) ?? []).length;

  const breakdown: Record<BurstDimension, number> = {
    biggerReason: clampScore((hasWhy ? 3 : 1) + (candidate.details.length > 120 ? 1 : 0) + (sources.length > 0 ? 1 : 0)),
    unexpectedness: clampScore((hasFreshAngle ? 3 : 1) + (hasCause ? 1 : 0) + (weakWordCount <= 1 ? 1 : 0)),
    relevancy: clampScore((hasUrgency ? 3 : 1) + (recentSourceCount(sources) > 0 ? 1 : 0) + (sources.length > 0 ? 1 : 0)),
    specificity: clampScore((hasStat ? 3 : 1) + (hasSpecificAudience ? 1 : 0) + (candidate.problem.length > 70 ? 1 : 0)),
    targetedCause: clampScore((hasCause ? 3 : 1) + (candidate.opportunity.length > 35 ? 1 : 0) + (hasSpecificAudience ? 1 : 0))
  };

  const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  const notes = buildScoreNotes(breakdown);

  return {
    breakdown,
    total,
    grade: total >= 21 ? "wall ready" : total >= 16 ? "promising" : "needs work",
    notes
  };
}

export function buildProblemFromSignal(signal: SourceSignal, client: ClientBrief, weekOf: string): ProblemCandidate {
  const behavior = trimSentence(signal.behavior);
  const tension = trimSentence(signal.tension);
  const audience = sentenceCase(signal.audience);
  const consequence = inferConsequence(signal, client);
  const problem = `${audience} are ${consequence} because they ${behavior}.`.toUpperCase();
  const verb = client.opportunityVerbs[0] ?? "help";
  const opportunity = `HOW COULD ${client.name.toUpperCase()} ${verb.toUpperCase()} ${audience.toUpperCase()} ${opportunityTail(signal, client)}?`;
  const details = [signal.stat, signal.urgency, signal.whyItMatters, tension ? `The root tension: ${tension}.` : ""]
    .filter(Boolean)
    .join(" ");

  const candidate: ProblemCandidate = {
    id: `${weekOf}-${client.id}-${signal.id}`,
    weekOf,
    clientId: client.id,
    clientName: client.name,
    strategist: client.strategist,
    email: client.email,
    problem,
    opportunity,
    details,
    audience: signal.audience,
    sources: [signal],
    status: "draft",
    imagePrompt: buildImagePrompt(signal, client)
  };

  return {
    ...candidate,
    score: scoreProblemCandidate(candidate)
  };
}

export function generateWeeklyWall(input: WeeklyWallInput): ProblemCandidate[] {
  const limit = input.limit ?? 12;
  const candidates = input.signals.flatMap((signal) =>
    input.clients
      .filter((client) => clientFit(client, signal) > 0)
      .map((client) => {
        const candidate = buildProblemFromSignal(signal, client, input.weekOf);
        return {
          ...candidate,
          score: {
            ...candidate.score!,
            total: candidate.score!.total + clientFit(client, signal)
          }
        };
      })
  );

  return uniqueBy(candidates, (candidate) => candidate.id)
    .sort((a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0))
    .slice(0, limit);
}

export function formatProblemSlideText(candidate: ProblemCandidate): string {
  return [
    "DETAILS",
    candidate.details,
    "",
    "STRATEGIST TO REACH OUT TO",
    `${candidate.strategist}`,
    `${candidate.email}`,
    "",
    "PROBLEM",
    candidate.problem,
    "",
    "OPPORTUNITY",
    candidate.opportunity
  ].join("\n");
}

function clientFit(client: ClientBrief, signal: SourceSignal): number {
  const haystack = `${signal.title} ${signal.audience} ${signal.behavior} ${signal.tension} ${signal.tags.join(" ")}`.toLowerCase();
  const terms = [...client.audiences, ...client.problemTerritories].flatMap((term) => term.toLowerCase().split(/[^a-z0-9]+/)).filter((term) => term.length > 3);
  const hits = new Set(terms.filter((term) => haystack.includes(term)));
  return Math.min(4, hits.size);
}

function inferConsequence(signal: SourceSignal, client: ClientBrief): string {
  const text = `${signal.title} ${signal.behavior} ${signal.tension} ${signal.tags.join(" ")}`.toLowerCase();
  if (text.includes("hydrat") || client.id === "gatorade") return "getting dehydrated";
  if (text.includes("stream") || text.includes("tv")) return "losing the plot after great TV ends";
  if (text.includes("chocolate")) return "being tricked by chocolate that is only chocolatey";
  if (text.includes("ai") && text.includes("small")) return "stuck using AI they are afraid customers will judge";
  if (text.includes("developer") || text.includes("chip")) return "defaulting to closed AI stacks before open options get a fair shot";
  if (text.includes("simulation")) return "missing the invisible technology behind the breakthroughs they celebrate";
  return `facing ${signal.tension}`;
}

function opportunityTail(signal: SourceSignal, client: ClientBrief): string {
  const text = `${signal.title} ${signal.tension} ${signal.tags.join(" ")}`.toLowerCase();
  if (text.includes("hydrat")) return "SCAN FOR HYDRATION BEFORE THEIR BODY SENDS THE BILL";
  if (text.includes("heat")) return "MAKE WATER, REST, AND SHADE FEEL LIKE BUSINESS INFRASTRUCTURE";
  if (text.includes("stream") || text.includes("tv")) return "PICK UP THE SPIRITS OF DIRECTIONLESS STREAMERS";
  if (text.includes("chocolate")) return "BECOME THE OFFICIAL AUTHENTICATOR OF REAL CHOCOLATE";
  if (text.includes("ai") && client.id === "constant-contact") return "MAKE AI FEEL LIKE BACKUP, NOT A BRAND LIABILITY";
  if (text.includes("developer") || text.includes("chip")) return "MAKE OPEN AI INFRASTRUCTURE THE EASY FIRST CHOICE";
  if (text.includes("simulation")) return "SHOW THE WORLD WHAT SIMULATION MAKES POSSIBLE";
  return `SOLVE THIS IN A WAY ONLY ${client.name.toUpperCase()} CAN`;
}

function buildImagePrompt(signal: SourceSignal, client: ClientBrief): string {
  return `Dark documentary photograph for a Problem Wall card: ${signal.audience} experiencing ${signal.tension}. Brand fit: ${client.name}. No logos, no text, cinematic but realistic.`;
}

function recentSourceCount(sources: SourceSignal[]): number {
  const now = Date.parse("2026-07-09T12:00:00.000Z");
  return sources.filter((source) => {
    const age = now - Date.parse(source.publishedAt);
    return Number.isFinite(age) && age <= 1000 * 60 * 60 * 24 * 14;
  }).length;
}

function buildScoreNotes(breakdown: Record<BurstDimension, number>): string[] {
  return Object.entries(breakdown).map(([key, score]) => `${labelDimension(key as BurstDimension)}: ${score}/5`);
}

function labelDimension(dimension: BurstDimension): string {
  return {
    biggerReason: "Bigger reason to care",
    unexpectedness: "Unexpectedness",
    relevancy: "Relevancy/urgency",
    specificity: "Specificity",
    targetedCause: "Targeted, solvable cause"
  }[dimension];
}

function clampScore(value: number): number {
  return Math.max(1, Math.min(5, value));
}

function sentenceCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function trimSentence(value: string): string {
  return value.trim().replace(/[.?!]$/, "");
}

function uniqueBy<T>(items: T[], getKey: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
