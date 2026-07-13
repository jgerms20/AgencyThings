import { describe, expect, it } from "vitest";
import {
  buildRecordFromUpload,
  filterRecords,
  normalizeTags,
  summarizeLibrary
} from "../src/lib/research-records";
import type { ResearchRecord } from "../src/lib/types";

const records: ResearchRecord[] = [
  {
    id: "signal-youtube",
    kind: "article",
    title: "YouTube as default television",
    source: "Common Sense Media",
    summary: "Kids increasingly treat short-form video and YouTube as ambient culture.",
    tags: ["media", "youtube", "daily-life"],
    status: "reviewed",
    confidence: "high",
    createdAt: "2026-07-01T12:00:00.000Z"
  },
  {
    id: "interview-maya",
    kind: "interview",
    title: "Maya cousin interview",
    source: "Field interview",
    summary: "Talks about Roblox, AI homework help, and family co-viewing.",
    tags: ["interview", "roblox", "ai"],
    status: "new",
    confidence: "medium",
    createdAt: "2026-07-04T12:00:00.000Z"
  },
  {
    id: "podcast-creators",
    kind: "podcast",
    title: "Creator commerce episode",
    source: "Podcast queue",
    summary: "A discussion about shopping influence moving through creators.",
    tags: ["commerce", "creators"],
    status: "queued",
    confidence: "medium",
    createdAt: "2026-07-05T12:00:00.000Z"
  }
];

describe("normalizeTags", () => {
  it("lowercases, trims, hyphenates, and deduplicates tags", () => {
    expect(normalizeTags([" AI Native ", "ai native", "YouTube", ""])).toEqual([
      "ai-native",
      "youtube"
    ]);
  });
});

describe("filterRecords", () => {
  it("filters by query, kind, tag, and status without mutating the source list", () => {
    const result = filterRecords(records, {
      query: "roblox",
      kind: "interview",
      tag: "ai",
      status: "new"
    });

    expect(result.map((record) => record.id)).toEqual(["interview-maya"]);
    expect(records).toHaveLength(3);
  });

  it("returns records newest first when no filters are active", () => {
    expect(filterRecords(records, {}).map((record) => record.id)).toEqual([
      "podcast-creators",
      "interview-maya",
      "signal-youtube"
    ]);
  });
});

describe("buildRecordFromUpload", () => {
  it("creates a reviewed interview record from upload metadata and transcript text", () => {
    const record = buildRecordFromUpload({
      title: "Cousin interview: screen habits",
      kind: "interview",
      source: "Joshua interview",
      tags: "AI, Roblox, Family influence",
      transcript: "We mostly use Roblox to hang out after school.",
      fileName: "cousin-interview.txt",
      now: "2026-07-09T15:00:00.000Z"
    });

    expect(record).toMatchObject({
      kind: "interview",
      title: "Cousin interview: screen habits",
      source: "Joshua interview",
      tags: ["ai", "roblox", "family-influence"],
      status: "reviewed",
      confidence: "medium",
      fileName: "cousin-interview.txt",
      createdAt: "2026-07-09T15:00:00.000Z"
    });
    expect(record.summary).toContain("Roblox");
    expect(record.id).toMatch(/^interview-/);
  });

  it("uses collision-resistant IDs for same-title records created at the same instant", () => {
    const input = {
      title: "Cousin interview: screen habits",
      kind: "interview" as const,
      source: "Joshua interview",
      tags: "AI, Roblox",
      now: "2026-07-09T15:00:00.000Z"
    };

    expect(buildRecordFromUpload(input).id).not.toBe(buildRecordFromUpload(input).id);
  });

  it("retains a supplied record identity for client-to-server persistence", () => {
    expect(
      buildRecordFromUpload({
        title: "Cousin interview: screen habits",
        kind: "interview",
        source: "Joshua interview",
        tags: "AI, Roblox",
        id: "interview-stable-client-id",
        now: "2026-07-09T15:00:00.000Z"
      }).id
    ).toBe("interview-stable-client-id");
  });
});

describe("summarizeLibrary", () => {
  it("counts lab records by kind and review state", () => {
    expect(summarizeLibrary(records)).toEqual({
      total: 3,
      reviewed: 1,
      interviews: 1,
      sources: 2,
      queued: 1
    });
  });
});
