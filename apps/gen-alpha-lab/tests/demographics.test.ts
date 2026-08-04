import { describe, expect, it } from "vitest";
import {
  demographicHeadlineFacts,
  demographicSources,
  globalCoverageNote,
  globalRegions,
  olderTeenIdentity,
  usEthnicityContext,
  usRaceAlone,
  usRegions,
  usSexSplit,
} from "../src/lib/demographics";

describe("Gen Alpha demographic model", () => {
  it("keeps the four opening facts aligned to the U.S.-first overview", () => {
    expect(demographicHeadlineFacts.map((fact) => fact.value)).toEqual([
      "2010–2024",
      "About 1–16",
      "59.7M",
      "2.01B",
    ]);
  });

  it("keeps exhaustive U.S. categories internally coherent", () => {
    expect(usSexSplit).toEqual([
      { label: "Male", value: 51.1 },
      { label: "Female", value: 48.9 },
    ]);
    const raceTotal = usRaceAlone.reduce((sum, item) => sum + item.value, 0);
    const regionTotal = usRegions.reduce((sum, item) => sum + item.value, 0);
    expect(raceTotal).toBeGreaterThanOrEqual(99.9);
    expect(raceTotal).toBeLessThanOrEqual(100.1);
    expect(regionTotal).toBeGreaterThanOrEqual(99.9);
    expect(regionTotal).toBeLessThanOrEqual(100.11);
  });

  it("preserves ethnicity, geography, and global figures as separate universes", () => {
    expect(usEthnicityContext).toContainEqual({ label: "Hispanic or Latino, any race", value: 27 });
    expect(usRegions).toContainEqual({ label: "South", value: 40.2 });
    expect(globalRegions).toContainEqual({ label: "Sub-Saharan Africa", value: 26.1 });
  });

  it("labels older-teen identity data and global identity limits honestly", () => {
    expect(olderTeenIdentity.scope).toMatch(/U.S. high-school students/i);
    expect(globalCoverageNote).toMatch(/no combined global race, ethnicity, sexual-orientation, or gender-identity rollup/i);
  });

  it("links every demographic source to a public HTTPS destination", () => {
    expect(demographicSources.length).toBeGreaterThanOrEqual(5);
    for (const source of demographicSources) {
      expect(source.url).toMatch(/^https:\/\//);
    }
  });
});
