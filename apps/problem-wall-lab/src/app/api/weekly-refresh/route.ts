import { NextResponse } from "next/server";
import { runWeeklyRefresh } from "../../../lib/weekly-refresh";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await runWeeklyRefresh());
}

export async function POST(request?: Request) {
  const body = request ? await request.json().catch(() => ({})) : {} as { brandLens?: string; excludeIds?: string[]; edge?: number };
  return NextResponse.json(await runWeeklyRefresh({
    brandLens: body.brandLens?.slice(0, 80),
    excludeIds: Array.isArray(body.excludeIds) ? body.excludeIds.slice(0, 300) : [],
    edge: Number.isFinite(body.edge) ? body.edge : 55
  }));
}
