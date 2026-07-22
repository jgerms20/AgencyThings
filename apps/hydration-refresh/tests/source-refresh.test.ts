import { describe, expect, it } from "vitest";
import { dedupeStories, refreshSources } from "@/lib/source-refresh";

describe("source refresh", () => {
  it("deduplicates canonical source URLs", () => {
    const story = { id: "a", headline: "One", sourceUrl: "https://example.com/story?utm_source=x" };
    expect(dedupeStories([story, { ...story, id: "b", sourceUrl: "https://example.com/story" }])).toHaveLength(1);
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
