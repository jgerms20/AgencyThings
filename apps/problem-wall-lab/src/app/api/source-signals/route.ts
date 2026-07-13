import { NextResponse } from "next/server";
import { refreshSourceSignals } from "../../../lib/source-refresh";

export async function GET() {
  return NextResponse.json(await refreshSourceSignals());
}
