import { NextResponse } from "next/server";
import { runWeeklyRefresh } from "../../../lib/weekly-refresh";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await runWeeklyRefresh());
}

export async function POST() {
  return NextResponse.json(await runWeeklyRefresh());
}
