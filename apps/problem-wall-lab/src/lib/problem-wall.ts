import type { BurstDimension, BurstScore, ProblemCandidate, SourceSignal, WeeklyWallInput } from "./types";

const STAT_PATTERN = /(\$?[\d,.]+%?|\d+\s?in\s?\d+|million|billion|hours?|days?|weeks?|double|half|majority)/i;
const DIMENSIONS: BurstDimension[] = ["biggerReason", "unexpectedness", "relevancy", "specificity", "targetedCause"];

export function scoreProblemCandidate(candidate: ProblemCandidate, now = new Date()): BurstScore {
  const sources = candidate.sources ?? [];
  const combined = `${candidate.problem} ${candidate.biggerReason} ${candidate.rootCause} ${candidate.details}`;
  const validEvidence = sources.filter((source) => /^https?:\/\//.test(source.url) && Number.isFinite(Date.parse(source.publishedAt)));
  const freshEvidence = validEvidence.filter((source) => now.getTime() - Date.parse(source.publishedAt) <= 21 * 86_400_000);
  const hasStat = STAT_PATTERN.test(combined) || validEvidence.some((source) => STAT_PATTERN.test(source.stat ?? ""));
  const hasSpecificAudience = candidate.audience.trim().split(/\s+/).length > 1 && !/people closest/i.test(candidate.audience);
  const hasConsequence = candidate.biggerReason.length >= 36;
  const hasCause = candidate.rootCause.length >= 30 && !/unknown|unclear/i.test(candidate.rootCause);
  const surprising = /but|while|despite|instead|hidden|quiet|unexpected|even though/i.test(combined) || Boolean(hasStat);

  const breakdown: Record<BurstDimension, number> = {
    biggerReason: clamp(1 + (hasConsequence ? 2 : 0) + (validEvidence.length ? 1 : 0) + (/health|money|trust|safety|time|work|learning/i.test(candidate.biggerReason) ? 1 : 0)),
    unexpectedness: clamp(1 + (surprising ? 2 : 0) + (hasCause ? 1 : 0) + (validEvidence.length > 1 ? 1 : 0)),
    relevancy: clamp(1 + (freshEvidence.length ? 3 : 0) + (candidate.sources.some((source) => Boolean(source.urgency)) ? 1 : 0)),
    specificity: clamp(1 + (hasStat ? 2 : 0) + (hasSpecificAudience ? 1 : 0) + (validEvidence.length ? 1 : 0)),
    targetedCause: clamp(1 + (hasCause ? 3 : 0) + (hasSpecificAudience ? 1 : 0))
  };

  const reasons: Record<BurstDimension, string> = {
    biggerReason: hasConsequence ? "Names a consequence beyond the immediate annoyance." : "The downstream consequence needs sharper proof.",
    unexpectedness: surprising ? "The evidence reveals a tension or non-obvious scale." : "The framing is familiar and needs a fresher angle.",
    relevancy: freshEvidence.length ? `${freshEvidence.length} source${freshEvidence.length === 1 ? "" : "s"} fall inside the 21-day window.` : "No source falls inside the current discovery window.",
    specificity: hasStat && hasSpecificAudience ? "Uses a defined audience and measurable detail." : "Needs a more specific audience or measurable detail.",
    targetedCause: hasCause ? "Identifies a bounded system or behavior causing the friction." : "The root cause is not yet concrete enough to attack."
  };

  let total = DIMENSIONS.reduce((sum, dimension) => sum + breakdown[dimension], 0);
  const evidenceCapped = validEvidence.length === 0;
  if (evidenceCapped) total = Math.min(total, 15);
  const rawGrade = total >= 21 ? "wall ready" : total >= 16 ? "promising" : "needs work";
  const grade = evidenceCapped && rawGrade === "wall ready" ? "promising" : rawGrade;

  return { breakdown, reasons, total, grade, evidenceCapped, notes: DIMENSIONS.map((dimension) => reasons[dimension]) };
}

export function buildProblemFromSignal(signal: SourceSignal, weekOf: string, now = new Date()): ProblemCandidate {
  const problem = plainLanguageProblem(signal);
  const biggerReason = sentenceCase(signal.whyItMatters || `The burden compounds across time, access, trust, or money for ${signal.audience}.`);
  const rootCause = sentenceCase(signal.tension);
  const details = [signal.stat, signal.urgency, `Reported by ${signal.source} on ${signal.publishedAt}.`].filter(Boolean).join(" ");
  const base: ProblemCandidate = {
    id: `${weekOf}-${signal.id}`,
    weekOf,
    problem,
    biggerReason,
    rootCause,
    details,
    audience: signal.audience,
    sources: [signal],
    status: "new",
    notes: "",
    score: {} as BurstScore
  };
  return { ...base, score: scoreProblemCandidate(base, now) };
}

export function generateWeeklyWall(input: WeeklyWallInput): ProblemCandidate[] {
  const now = new Date(input.now ?? Date.now());
  const candidates = input.signals.map((signal) => buildProblemFromSignal(signal, input.weekOf, now));
  return uniqueBy(candidates, (candidate) => candidate.problem.toLowerCase())
    .sort((a, b) => b.score.total - a.score.total)
    .slice(0, input.limit ?? 16);
}

export function buildWeeklySummary(candidates: ProblemCandidate[]): string {
  const shortlist = candidates.filter((candidate) => candidate.status === "shortlisted");
  if (!shortlist.length) return "No problems were shortlisted this week.";
  const lines = shortlist
    .map((candidate, index) => `${index + 1}. ${candidate.problem}\nWhy it matters: ${candidate.biggerReason}${candidate.notes ? `\nNotes: ${candidate.notes}` : ""}`);
  return `${shortlist.length} problem${shortlist.length === 1 ? "" : "s"} shortlisted this week.\n\n${lines.join("\n\n")}`;
}

function clamp(value: number): number { return Math.max(1, Math.min(5, value)); }
function plainLanguageProblem(signal: SourceSignal): string {
  const text = signal.title.toLowerCase();
  const audience = capitalize(signal.audience);
  if (/work[- ]family conflict|caregiver burden/.test(text)) return "Working families are being squeezed by work and caregiving demands that do not fit together.";
  if (/cloud computing|cloud technology/.test(text)) return "Regional government teams cannot adopt cloud tools as quickly as their communities need them.";
  if (/synthetic relationships|ai relationships/.test(text) && /loneliness|lonely/.test(text)) return "People are turning to AI relationships for loneliness before the risks and rules are understood.";
  if (/famil(?:y|ies)/.test(text) && /technology|digital|remote work/.test(text)) return "Families are absorbing the risks of new technology faster than support systems can keep up.";
  if (/school|teacher|student|education|learning/.test(text)) return `${audience} are losing time because school communication is split across disconnected tools.`;
  if (/cost|debt|money|financial|price|afford/.test(text)) return `${audience} are losing money to systems that are harder to understand than they should be.`;
  if (/health|patient|care|safety/.test(text)) return `${audience} are struggling to get timely help from health and care systems.`;
  const clean = signal.title
    .replace(/^(?:a\s+)?systematic review of\s+/i, "")
    .replace(/^(?:new\s+)?(?:study|research|report)\s+(?:finds|shows|reveals)\s+/i, "")
    .replace(/[.?!]$/, "")
    .trim();
  return `${audience} are dealing with ${clean ? clean.charAt(0).toLowerCase() + clean.slice(1) : "a problem their current systems do not solve"}.`;
}
function sentenceCase(value: string): string { const clean = value.trim(); return clean ? clean[0]!.toUpperCase() + clean.slice(1).replace(/[.?!]?$/, ".") : ""; }
function capitalize(value: string): string { const clean = value.trim().replace(/[.?!]$/, ""); return clean ? clean[0]!.toUpperCase() + clean.slice(1) : ""; }
function uniqueBy<T>(items: T[], key: (item: T) => string): T[] { const seen = new Set<string>(); return items.filter((item) => { const value = key(item); if (seen.has(value)) return false; seen.add(value); return true; }); }
