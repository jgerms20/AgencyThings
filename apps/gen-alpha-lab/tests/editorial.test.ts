import { describe, expect, it } from "vitest";
import { creators, editorialInsights, libraryTakeaways } from "../src/lib/editorial";

describe("Gen Alpha editorial model", () => {
  it("consolidates the field guide into four concise truths", () => {
    expect(editorialInsights.map((insight) => insight.id)).toEqual([
      "ai",
      "play",
      "video",
      "influence"
    ]);

    for (const insight of editorialInsights) {
      expect(insight.title.length).toBeLessThan(54);
      expect(insight.interpretation.length).toBeLessThan(180);
      expect(insight.href).toMatch(/^\/(findings|topics)\//);
    }
  });

  it("defines a balanced creator roster with portraits and official destinations", () => {
    expect(creators.map((creator) => creator.name)).toEqual([
      "MrBeast",
      "IShowSpeed",
      "Kai Cenat",
      "Aphmau",
      "Salish Matter",
      "Ms. Rachel"
    ]);
    expect(creators.filter((creator) => creator.pronouns === "she")).toHaveLength(3);

    for (const creator of creators) {
      expect(creator.portrait).toMatch(/^\/creators\/.+\.jpg$/);
      expect(creator.profileUrl).toMatch(/^https:\/\//);
      expect(creator.sourceUrl).toMatch(/^https:\/\//);
      expect(creator.role.length).toBeLessThan(38);
      expect(creator.insight.length).toBeLessThan(190);
    }
  });

  it("keeps library takeaways short and conclusion-led", () => {
    expect(libraryTakeaways).toHaveLength(3);
    expect(libraryTakeaways.every((takeaway) => takeaway.length < 90)).toBe(true);
  });
});
