import { describe, expect, it } from "vitest";
import { spaces } from "../src/lib/spaces";

describe("Gen Alpha spaces model", () => {
  it("defines twelve distinct places with evidence and behavioral implications", () => {
    expect(spaces).toHaveLength(12);
    expect(spaces.slice(0, 3).map((space) => space.name)).toEqual(["Roblox", "YouTube", "Discord"]);
    expect(new Set(spaces.map((space) => space.id))).toHaveProperty("size", 12);

    for (const space of spaces) {
      expect(space.whatItIs.length).toBeGreaterThan(20);
      expect(space.howTheyUseIt.length).toBeGreaterThan(30);
      expect(space.implication.length).toBeGreaterThan(30);
      expect(space.sources.length).toBeGreaterThanOrEqual(1);
      expect(space.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
    }
  });
});
