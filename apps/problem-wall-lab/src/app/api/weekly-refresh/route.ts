import { NextResponse } from "next/server";
import { clientBriefs } from "../../../lib/seed-data";
import { generateWeeklyWall } from "../../../lib/problem-wall";
import { refreshSourceSignals } from "../../../lib/source-refresh";
import { buildWeeklyWorkflow } from "../../../lib/workflow";

export async function GET() {
  const weekOf = nextMonday();
  const signals = await refreshSourceSignals();
  const candidates = generateWeeklyWall({
    weekOf,
    clients: clientBriefs,
    signals,
    limit: 12
  });

  return NextResponse.json({
    weekOf,
    refreshedAt: new Date().toISOString(),
    workflow: buildWeeklyWorkflow(weekOf),
    candidates,
    signals
  });
}

function nextMonday() {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = (8 - day) % 7 || 7;
  const next = new Date(now);
  next.setUTCDate(now.getUTCDate() + diff);
  return next.toISOString().slice(0, 10);
}
