import { describe, expect, it } from "vitest";
import { connectorSeeds, seedStories } from "@/lib/seed-data";

describe("Hydration Refresh content contract", () => {
  it("ships a broad, source-attributed editorial feed", () => {
    expect(seedStories.length).toBeGreaterThanOrEqual(10);
    expect(new Set(seedStories.map((story) => story.id)).size).toBe(seedStories.length);
    expect(new Set(seedStories.map((story) => story.domain)).size).toBeGreaterThanOrEqual(5);
    expect(new Set(seedStories.map((story) => story.sourceKind))).toEqual(
      expect.objectContaining(new Set(["publication", "community", "study", "podcast", "event"]))
    );
    seedStories.forEach((story) => {
      expect(() => new URL(story.sourceUrl)).not.toThrow();
      expect(story.whatHappened.length).toBeGreaterThan(20);
      expect(story.whyItMatters.length).toBeGreaterThan(20);
    });
  });

  it("represents every source connector honestly", () => {
    expect(connectorSeeds.map((connector) => connector.id)).toEqual([
      "news", "reddit", "podcasts", "studies", "events", "x"
    ]);
    expect(connectorSeeds.find(({ id }) => id === "reddit")?.status).toBe("needs-credentials");
    expect(connectorSeeds.find(({ id }) => id === "x")?.status).toBe("needs-credentials");
  });
});
