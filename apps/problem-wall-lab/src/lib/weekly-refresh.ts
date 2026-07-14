import { generateWeeklyWall } from "./problem-wall";
import { persistWeeklyRun } from "./persistence";
import { refreshSourceSignals } from "./source-refresh";
import type { SourceRefreshOptions, WeeklyRefreshResult } from "./types";

export async function runWeeklyRefresh(options: SourceRefreshOptions & { weekOf?: string } = {}): Promise<WeeklyRefreshResult> {
  const now = new Date(options.now ?? Date.now());
  const weekOf = options.weekOf ?? mondayOf(now);
  const refresh = await refreshSourceSignals(options);
  const excluded = new Set(options.excludeIds ?? []);
  const candidates = generateWeeklyWall({ weekOf, signals: refresh.signals, now: now.toISOString(), limit: 48 })
    .filter((candidate) => !excluded.has(candidate.id))
    .slice(0, 18);
  const persistence = await persistWeeklyRun({ weekOf, refreshedAt: refresh.refreshedAt, refresh, candidates });
  return {
    weekOf,
    refreshedAt: refresh.refreshedAt,
    mode: persistence.mode,
    persistenceErrors: persistence.errors,
    refresh,
    candidates
  };
}

export function mondayOf(date: Date): string {
  const result = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = result.getUTCDay();
  result.setUTCDate(result.getUTCDate() - ((day + 6) % 7));
  return result.toISOString().slice(0, 10);
}
