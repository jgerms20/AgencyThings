import { describe, expect, it } from "vitest";
import { fromSupabaseRow, toSupabaseRow } from "../src/lib/supabase-server";
import type { ResearchRecord } from "../src/lib/types";

const record: ResearchRecord = {
  id: "shared-interview",
  kind: "interview",
  sourceClass: "owned",
  title: "Shared interview",
  source: "Supabase",
  summary: "A persistent interview.",
  tags: ["fieldwork"],
  status: "reviewed",
  confidence: "high",
  createdAt: "2026-07-12T12:00:00.000Z"
};

describe("Supabase research record mapping", () => {
  it("preserves sourceClass through storage serialization", () => {
    expect(fromSupabaseRow(toSupabaseRow(record))).toMatchObject({
      id: "shared-interview",
      sourceClass: "owned"
    });
  });
});
