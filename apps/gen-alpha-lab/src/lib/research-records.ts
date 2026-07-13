import type {
  FilterState,
  LibrarySummary,
  ResearchRecord,
  UploadRecordInput
} from "./types";

export function normalizeTags(tags: string[] | string): string[] {
  const source = Array.isArray(tags) ? tags : tags.split(",");
  const normalized = source
    .map((tag) =>
      tag
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    )
    .filter(Boolean);

  return Array.from(new Set(normalized));
}

export function filterRecords(records: ResearchRecord[], filters: FilterState): ResearchRecord[] {
  const query = filters.query?.trim().toLowerCase();
  const tag = filters.tag && filters.tag !== "all" ? filters.tag : undefined;
  const kind = filters.kind && filters.kind !== "all" ? filters.kind : undefined;
  const status = filters.status && filters.status !== "all" ? filters.status : undefined;

  return [...records]
    .filter((record) => {
      const searchable = [
        record.title,
        record.source,
        record.summary,
        record.author,
        record.url,
        record.transcript,
        ...record.tags
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!query || searchable.includes(query)) &&
        (!kind || record.kind === kind) &&
        (!status || record.status === status) &&
        (!tag || record.tags.includes(tag))
      );
    })
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function buildRecordFromUpload(input: UploadRecordInput): ResearchRecord {
  const createdAt = input.now ?? new Date().toISOString();
  const tags = normalizeTags(input.tags);
  const title = input.title.trim();
  const source = input.source.trim() || "Field upload";
  const transcript = input.transcript?.trim();

  return {
    id: input.id ?? createRecordId(input.kind, title, createdAt),
    kind: input.kind,
    title,
    source,
    url: input.url?.trim() || undefined,
    tags,
    status: transcript || input.url ? "reviewed" : "new",
    confidence: input.kind === "interview" ? "medium" : "low",
    summary: summarizeTranscript(transcript, title),
    transcript,
    fileName: input.fileName,
    sourceClass: input.sourceClass,
    createdAt
  };
}

function createRecordId(kind: string, title: string, createdAt: string): string {
  const entropy = globalThis.crypto?.randomUUID?.().replace(/-/g, "").slice(0, 12) ??
    Math.random().toString(36).slice(2, 14);

  return `${kind}-${slugify(title)}-${createdAt.slice(0, 10)}-${entropy}`;
}

export function summarizeLibrary(records: ResearchRecord[]): LibrarySummary {
  return {
    total: records.length,
    reviewed: records.filter((record) => record.status === "reviewed").length,
    interviews: records.filter((record) => record.kind === "interview").length,
    sources: records.filter((record) => record.kind !== "interview").length,
    queued: records.filter((record) => record.status === "queued").length
  };
}

function summarizeTranscript(transcript: string | undefined, title: string): string {
  if (!transcript) {
    return `${title} is ready for review. Add notes, tags, and a confidence level after intake.`;
  }

  const compact = transcript.replace(/\s+/g, " ").trim();
  return compact.length > 180 ? `${compact.slice(0, 177)}...` : compact;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}
