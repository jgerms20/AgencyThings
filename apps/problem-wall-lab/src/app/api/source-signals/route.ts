import { NextResponse } from "next/server";
import { refreshSourceSignals } from "../../../lib/source-refresh";

export async function GET() {
  const signals = await refreshSourceSignals();
  return NextResponse.json({
    refreshedAt: new Date().toISOString(),
    signals
  });
}
