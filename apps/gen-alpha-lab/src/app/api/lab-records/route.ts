import { NextResponse } from "next/server";
import { buildRecordFromUpload } from "@/lib/research-records";
import { seedRecords } from "@/lib/seed-data";
import {
  createSupabaseServerClient,
  fromSupabaseRow,
  getSupabaseConfig,
  toSupabaseRow
} from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({
      mode: "demo",
      records: seedRecords,
      message: "Supabase is not configured. The browser will keep added records locally."
    });
  }

  const { data, error } = await supabase
    .from("gen_alpha_lab_records")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    mode: "supabase",
    records: (data ?? []).map(fromSupabaseRow)
  });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const record = buildRecordFromUpload({
    title: payload.title,
    kind: payload.kind,
    source: payload.source,
    tags: payload.tags,
    transcript: payload.transcript,
    url: payload.url,
    fileName: payload.fileName
  });
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({
      mode: "demo",
      record,
      config: getSupabaseConfig()
    });
  }

  const { data, error } = await supabase
    .from("gen_alpha_lab_records")
    .upsert(toSupabaseRow(record))
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    mode: "supabase",
    record: fromSupabaseRow(data)
  });
}
