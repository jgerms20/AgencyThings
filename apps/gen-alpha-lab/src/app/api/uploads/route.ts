import { NextResponse } from "next/server";
import { buildRecordFromUpload } from "@/lib/research-records";
import {
  createSupabaseServerClient,
  getSupabaseConfig,
  toSupabaseRow,
  fromSupabaseRow
} from "@/lib/supabase-server";
import type { ResearchKind } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const title = String(formData.get("title") ?? "");
  const source = String(formData.get("source") ?? "Field upload");
  const kind = String(formData.get("kind") ?? "field-note") as ResearchKind;
  const tags = String(formData.get("tags") ?? "");
  const url = String(formData.get("url") ?? "");
  const transcript = String(formData.get("transcript") ?? "");

  if (!title.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  let fileName: string | undefined;
  let fileText = transcript;
  let storagePath: string | undefined;

  if (file instanceof File && file.size > 0) {
    fileName = file.name;

    if (file.type.startsWith("text/") || /\.(txt|md|csv|json)$/i.test(file.name)) {
      fileText = await file.text();
    }
  }

  const supabase = createSupabaseServerClient();
  const config = getSupabaseConfig();
  const record = buildRecordFromUpload({
    title,
    kind,
    source,
    tags,
    url,
    fileName,
    transcript: fileText
  });

  if (supabase && file instanceof File && file.size > 0) {
    const path = `${record.id}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from(config.bucket)
      .upload(path, file, { upsert: true });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    storagePath = path;
  }

  const recordWithStorage = {
    ...record,
    storagePath
  };

  if (!supabase) {
    return NextResponse.json({
      mode: "demo",
      record: recordWithStorage,
      message: "Supabase is not configured. This record should be stored in the browser demo library."
    });
  }

  const { data, error } = await supabase
    .from("gen_alpha_lab_records")
    .upsert(toSupabaseRow(recordWithStorage))
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
