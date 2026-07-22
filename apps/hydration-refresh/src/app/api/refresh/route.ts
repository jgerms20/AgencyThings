import { NextResponse } from "next/server";
import { refreshSources } from "@/lib/source-refresh";

export async function POST() {
  return NextResponse.json(await refreshSources(), { headers: { "cache-control": "no-store" } });
}
