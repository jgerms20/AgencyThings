import { describe, expect, it } from "vitest";
import { evidenceItems } from "@/lib/content/evidence";
import { sources } from "@/lib/content/sources";
import { validateContentGraph } from "@/lib/content/validate";

describe("canonical content graph", () => {
  it("stores extracted evidence with explicit scope, fieldwork, and limitations", () => {
    expect(sources.length).toBeGreaterThanOrEqual(25);
    expect(evidenceItems.length).toBeGreaterThanOrEqual(80);

    for (const item of evidenceItems) {
      expect(item.population).toBeTruthy();
      expect(item.ageRange).toBeTruthy();
      expect(item.geography).toBeTruthy();
      expect(item.period).toBeTruthy();
      expect(item.methodology).toBeTruthy();
      expect(item.limitations).toBeTruthy();
      expect(item.locator).not.toBe("Public report summary or methodology description.");

      const source = sources.find((candidate) => candidate.id === item.sourceId);
      expect(source).toBeDefined();
      expect(item.claim).not.toBe(source?.summary);
      expect(item.period).not.toBe(source?.publishedAt);
    }

    for (const source of sources) {
      expect(source.population).not.toMatch(/not fully disclosed/i);
      expect(source.ageRange).not.toMatch(/not fully disclosed/i);
      expect(source.geography).not.toMatch(/not fully disclosed/i);
      expect(source.fieldworkPeriod).toBeTruthy();
      expect(source.fieldworkPeriod).not.toBe(source.publishedAt);
    }
  });

  it("has no graph validation issues", () => {
    expect(validateContentGraph()).toEqual([]);
  });

  it("rejects search endpoints and placeholder scope fields", () => {
    const issueList = validateContentGraph({
      sources: [
        {
          ...sources[0],
          id: "search-source",
          url: "https://www.google.com/search?q=gen+alpha",
        },
      ],
      themes: [],
      insights: [],
      evidenceItems: [],
    });

    expect(issueList).toContain("Source has no direct editorial URL: search-source");

    const placeholderIssueList = validateContentGraph({
      sources: sources.map((source, index) => index === 0 ? {
        ...source,
        ageRange: "Not fully disclosed",
        fieldworkPeriod: "Not stated",
      } : source),
      themes: [],
      insights: [],
      evidenceItems: [],
    });

    expect(placeholderIssueList).toContain("Source has placeholder ageRange: pwc-alpha-2026");
    expect(placeholderIssueList).toContain("Source has placeholder fieldworkPeriod: pwc-alpha-2026");
  });

  it("rejects IDs reused across graph types", () => {
    const issueList = validateContentGraph({
      sources,
      themes: [{ id: "pwc-alpha-2026", title: "Duplicate ID", description: "Test theme" }],
      insights: [],
      evidenceItems: [],
    });

    expect(issueList).toContain("Duplicate graph ID across source and theme: pwc-alpha-2026");
  });

  it("rejects unsupported insight claims and evidence links", () => {
    const issueList = validateContentGraph({
      sources: [sources[0]],
      themes: [{ id: "play-belonging", title: "Play", description: "Test theme" }],
      insights: [{
        id: "unsupported-insight",
        themeId: "play-belonging",
        sequence: 1,
        title: "Unsupported insight",
        thesis: "This has no evidence.",
        interpretation: "Test",
        evidenceIds: ["missing-evidence"],
        ageRange: "7-14",
        geography: "United States",
        confidence: "low",
        confidenceReason: "Test",
        nuance: "Test",
        agencyImplication: "Test",
        relatedCreatorIds: [],
        relatedSpaceIds: [],
        tags: [],
      }],
      evidenceItems: [{
        ...evidenceItems[0],
        id: "orphaned-evidence",
        sourceId: "missing-source",
        insightIds: ["missing-insight"],
      }],
    });

    expect(issueList).toContain("Evidence references missing source: orphaned-evidence");
    expect(issueList).toContain("Evidence references missing insight: orphaned-evidence");
    expect(issueList).toContain("Insight references missing evidence: unsupported-insight");
    expect(issueList).toContain("Insight lacks two evidence items: unsupported-insight");
  });
});
