import { createClient } from "@supabase/supabase-js";
import type { ProblemCandidate, RefreshResult } from "./types";

export async function persistWeeklyRun(input: {
  weekOf: string;
  refreshedAt: string;
  refresh: RefreshResult;
  candidates: ProblemCandidate[];
}): Promise<{ mode: "supabase" | "demo"; errors: string[] }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { mode: "demo", errors: [] };

  const client = createClient(url, key, { auth: { persistSession: false } });
  const errors: string[] = [];
  const run = await client.from("problem_wall_weekly_runs").upsert({
    week_of: input.weekOf,
    refreshed_at: input.refreshedAt,
    sources_attempted: input.refresh.sourcesAttempted,
    sources_succeeded: input.refresh.sourcesSucceeded,
    failures: input.refresh.failures
  }, { onConflict: "week_of" });
  if (run.error) errors.push(run.error.message);

  if (input.refresh.signals.length) {
    const signalWrite = await client.from("problem_wall_source_signals").upsert(input.refresh.signals.map((signal) => ({
      id: signal.id, title: signal.title, source: signal.source, source_type: signal.sourceType,
      source_class: signal.sourceClass, url: signal.url, published_at: signal.publishedAt,
      audience: signal.audience, behavior: signal.behavior, tension: signal.tension,
      stat: signal.stat ?? null, urgency: signal.urgency ?? null, why_it_matters: signal.whyItMatters ?? null,
      tags: signal.tags
    })), { onConflict: "id" });
    if (signalWrite.error) errors.push(signalWrite.error.message);
  }

  if (input.candidates.length) {
    const candidateWrite = await client.from("problem_wall_candidates").upsert(input.candidates.map((candidate) => ({
      id: candidate.id, week_of: candidate.weekOf, problem: candidate.problem, bigger_reason: candidate.biggerReason,
      root_cause: candidate.rootCause, details: candidate.details, audience: candidate.audience,
      status: candidate.status, notes: candidate.notes, burst_total: candidate.score.total,
      burst_breakdown: candidate.score.breakdown, burst_reasons: candidate.score.reasons,
      source_ids: candidate.sources.map((source) => source.id)
    })), { onConflict: "id" });
    if (candidateWrite.error) errors.push(candidateWrite.error.message);
  }

  return { mode: "supabase", errors };
}
