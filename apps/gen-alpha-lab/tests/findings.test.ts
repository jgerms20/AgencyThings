import { describe, expect, it } from "vitest";
import {
  findingTopics,
  findings,
  getLibrarySections,
  getFindingById,
  getTopicById,
  getSupportingRecords,
  validateFindings
} from "../src/lib/findings";
import { seedRecords } from "../src/lib/seed-data";

describe("Gen Alpha field-guide findings", () => {
  it("covers the seven required cultural lenses", () => {
    expect(findingTopics.map((topic) => [topic.id, topic.label, topic.href])).toEqual([
      ["connect", "How they connect", "/topics/connect"],
      ["media", "How they consume media", "/topics/media"],
      ["influence", "How they are influenced", "/topics/influence"],
      ["time", "How they spend time", "/topics/time"],
      ["learn", "How they learn", "/topics/learn"],
      ["play-create", "How they play and create", "/topics/play-create"],
      ["ai", "How they use AI", "/topics/ai"]
    ]);
  });

  it("gives each lens enough topic-page material to stand alone", () => {
    for (const topic of findingTopics) {
      expect(getTopicById(topic.id)).toMatchObject({
        id: topic.id,
        href: `/topics/${topic.id}`
      });
      expect(topic.pageTitle).toMatch(/^How they /);
      expect(topic.visualAnatomy.length).toBeGreaterThanOrEqual(3);
      expect(topic.findingIds.length).toBeGreaterThanOrEqual(1);
      expect(topic.genZContrast).toMatch(/Gen Z/);
    }

    expect(getTopicById("missing-topic")).toBeUndefined();
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

  it("features Joshua's Spotify episode as synthesized owned media", () => {
    expect(seedRecords).toContainEqual(
      expect.objectContaining({
        kind: "podcast",
        sourceClass: "owned",
        title: "#093 Gen Alpha: AI, Gaming, and the First Fully Digital Childhood",
        url: "https://open.spotify.com/episode/7l1peATWasIYA07RvqKgwn?si=XGKqiaAJRAKCs2F4X3wn_g",
        synthesisStatus: "Featured synthesis",
        tags: expect.arrayContaining(["owned", "ai", "gaming", "digital-childhood"])
      })
    );
  });

  it("organizes the library into articles, podcasts, books, and youtube", () => {
    const sections = getLibrarySections(seedRecords);

    expect(sections.map((section) => section.title)).toEqual([
      "Articles",
      "Podcasts",
      "Books",
      "YouTube"
    ]);
    expect(sections.every((section) => section.records.length > 0)).toBe(true);
    expect(sections.flatMap((section) => section.records).every((record) => record.url)).toBe(true);
  });
});
