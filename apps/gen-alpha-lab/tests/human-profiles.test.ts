import { describe, expect, it } from "vitest";
import { cultureShapers } from "../src/lib/content/culture-shapers";
import { getHumanProfile } from "../src/lib/content/profiles";

describe("human culture-shaper profiles", () => {
  it("covers every culture shaper with origin, audience, and a wikipedia or official fallback path", () => {
    const missing = cultureShapers.filter((shaper) => !getHumanProfile(shaper.id));
    expect(missing.map((shaper) => shaper.id)).toEqual([]);

    for (const shaper of cultureShapers) {
      const profile = getHumanProfile(shaper.id)!;
      expect(profile.origin.length).toBeGreaterThan(3);
      expect(profile.whoTheyAre.length).toBeGreaterThan(40);
      expect(profile.whoTheyReach.length).toBeGreaterThan(12);
      expect(profile.whatTheyMake.length).toBeGreaterThan(12);
      expect(profile.knownFor.length).toBeGreaterThanOrEqual(2);
      expect(profile.sphere.length).toBeGreaterThan(12);
      expect(profile.whereYouSeeThem.length).toBeGreaterThan(12);
      if (profile.wikipediaUrl) expect(profile.wikipediaUrl).toMatch(/^https:\/\/en\.wikipedia\.org\//);
    }
  });
});
