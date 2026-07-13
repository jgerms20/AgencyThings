import { createClient } from "@supabase/supabase-js";
import type { ResearchRecord } from "./types";

type SupabaseRecordRow = {
  id: string;
  kind: ResearchRecord["kind"];
  title: string;
  source: string;
  summary: string;
  tags: string[];
  status: ResearchRecord["status"];
  confidence: ResearchRecord["confidence"];
  created_at: string;
  url: string | null;
  author: string | null;
  published_at: string | null;
  transcript: string | null;
  file_name: string | null;
  storage_path: string | null;
};

export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "gen-alpha-lab";

  return {
    configured: Boolean(url && serviceRoleKey),
    url,
    serviceRoleKey,
    bucket
  };
}

export function createSupabaseServerClient() {
  const config = getSupabaseConfig();

  if (!config.url || !config.serviceRoleKey) {
    return null;
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });
}

export function toSupabaseRow(record: ResearchRecord): SupabaseRecordRow {
  return {
    id: record.id,
    kind: record.kind,
    title: record.title,
    source: record.source,
    summary: record.summary,
    tags: record.tags,
    status: record.status,
    confidence: record.confidence,
    created_at: record.createdAt,
    url: record.url ?? null,
    author: record.author ?? null,
    published_at: record.publishedAt ?? null,
    transcript: record.transcript ?? null,
    file_name: record.fileName ?? null,
    storage_path: record.storagePath ?? null
  };
}

export function fromSupabaseRow(row: SupabaseRecordRow): ResearchRecord {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    source: row.source,
    summary: row.summary,
    tags: row.tags ?? [],
    status: row.status,
    confidence: row.confidence,
    createdAt: row.created_at,
    url: row.url ?? undefined,
    author: row.author ?? undefined,
    publishedAt: row.published_at ?? undefined,
    transcript: row.transcript ?? undefined,
    fileName: row.file_name ?? undefined,
    storagePath: row.storage_path ?? undefined
  };
}
