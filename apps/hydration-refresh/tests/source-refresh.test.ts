import { describe, expect, it } from "vitest";
import { dedupeStories, normalizeLiveStory, refreshSources } from "@/lib/source-refresh";

describe("source refresh", () => {
  it("deduplicates canonical source URLs", () => {
    const story = { id: "a", headline: "One", sourceUrl: "https://example.com/story?utm_source=x" };
    expect(dedupeStories([story, { ...story, id: "b", sourceUrl: "https://example.com/story" }])).toHaveLength(1);
  });

  it("deduplicates normalized headlines across different source URLs", () => {
    const story = { id: "a", headline: "Culture moves faster now!", sourceUrl: "https://example.com/a" };
    expect(dedupeStories([story, { ...story, id: "b", headline: "Culture Moves Faster Now", sourceUrl: "https://example.org/b" }])).toHaveLength(1);
  });

  it("creates stable live IDs independent of connector ordering", () => {
    const first = normalizeLiveStory("A fresh signal", "https://example.com/story?utm_source=feed", "Example", "publication", "2026-07-20", 0);
    const reordered = normalizeLiveStory("A revised headline", "https://example.com/story", "Example", "publication", "2026-07-20", 7);
    expect(first.id).toBe(reordered.id);
  });

  it("returns partial success when one connector fails", async () => {
    const result = await refreshSources({ connectors: [
      { id: "good", label: "Good", sourceKind: "publication", fetch: async () => [] },
      { id: "bad", label: "Bad", sourceKind: "study", fetch: async () => { throw new Error("offline"); } }
    ] });
    expect(result.run.statuses.find(({ id }) => id === "good")?.status).toBe("updated");
    expect(result.run.statuses.find(({ id }) => id === "bad")?.status).toBe("stale");
  });
});
