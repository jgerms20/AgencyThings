import { describe, expect, it } from "vitest";
import {
  findingTopics,
  findings,
  getFindingById,
  getSupportingRecords,
  validateFindings
} from "../src/lib/findings";
import { seedRecords } from "../src/lib/seed-data";

describe("Gen Alpha field-guide findings", () => {
  it("covers the seven required cultural lenses", () => {
    expect(findingTopics.map((topic) => topic.id)).toEqual([
      "connect",
      "media",
      "influence",
      "time",
      "learn",
      "play-create",
      "ai"
    ]);
  });

  it("looks up a finding for a navigable editorial detail page", () => {
    expect(getFindingById("learning-is-assembled")).toMatchObject({
      id: "learning-is-assembled",
      title: "They learn by doing, with help on demand."
    });
    expect(getFindingById("missing-finding")).toBeUndefined();
  });

  it("gives every published finding two valid records including non-community evidence", () => {
    expect(validateFindings(findings, seedRecords)).toEqual([]);

    for (const finding of findings) {
      const support = getSupportingRecords(finding, seedRecords);
      expect(support.length).toBeGreaterThanOrEqual(2);
      expect(
        support.some(
          (record) =>
            record.sourceClass !== "community" &&
            (record.confidence === "medium" || record.confidence === "high")
        )
      ).toBe(true);
    }
  });

  it("rejects duplicate support IDs and support without direct, qualifying evidence", () => {
    const finding = {
      ...findings[0],
      id: "invalid-support",
      supportIds: ["pwc-alpha-2026", "pwc-alpha-2026", "field-cousin-placeholder"]
    };
    const invalidRecords = seedRecords.map((record) => {
      if (record.id === "pwc-alpha-2026") {
        return { ...record, url: "not-a-url", confidence: "low" as const };
      }
      if (record.id === "field-cousin-placeholder") {
        return { ...record, sourceClass: undefined };
      }
      return record;
    });

    expect(validateFindings([finding], invalidRecords)).toEqual(
      expect.arrayContaining([
        "invalid-support has duplicate supporting record IDs.",
        "invalid-support support pwc-alpha-2026 requires a valid direct URL.",
        "invalid-support support pwc-alpha-2026 requires medium or high confidence.",
        "invalid-support support field-cousin-placeholder must be a report, article, or podcast.",
        "invalid-support support field-cousin-placeholder requires an explicit non-community source class."
      ])
    );
  });

  it("keeps the owned Spotify episode as material to synthesize", () => {
    expect(seedRecords).toContainEqual(
      expect.objectContaining({
        kind: "podcast",
        sourceClass: "owned",
        title: "#093 Gen Alpha: AI, Gaming, and the First Fully Digital Childhood",
        url: "https://open.spotify.com/episode/7l1peATWasIYA07RvqKgwn?si=XGKqiaAJRAKCs2F4X3wn_g",
        synthesisStatus: "To listen / synthesize",
        tags: expect.arrayContaining(["owned", "ai", "gaming", "digital-childhood"])
      })
    );
  });

  it("classifies a balanced research sourcebook", () => {
    const count = (sourceClass: string) =>
      seedRecords.filter((record) => record.sourceClass === sourceClass).length;

    expect(count("primary research")).toBeGreaterThanOrEqual(3);
    expect(count("peer reviewed")).toBeGreaterThanOrEqual(3);
    expect(count("journalism")).toBeGreaterThanOrEqual(1);
    expect(count("video")).toBeGreaterThanOrEqual(1);
    expect(count("community")).toBeGreaterThanOrEqual(1);
    expect(count("owned")).toBeGreaterThanOrEqual(1);
  });
});
