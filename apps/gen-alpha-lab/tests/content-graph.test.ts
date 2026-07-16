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
      expect(["metric", "finding", "observed claim", "editorial inference"]).toContain(item.claimKind);
      expect(item.supportRationale).toBeTruthy();
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

  it.each([
    "https://publisher.example/?s=gen-alpha",
    "https://publisher.example/search-results?term=gen-alpha",
    "https://publisher.example/searchresults?keyword=gen-alpha",
    "https://publisher.example/content/search/?query=gen-alpha",
    "https://publisher.example/find?search_query=gen-alpha",
  ])("rejects publisher search URL %s", (url) => {
    const issueList = validateContentGraph({
      sources: [{ ...sources[0], id: "publisher-search", url }],
      themes: [],
      insights: [],
      evidenceItems: [],
    });

    expect(issueList).toContain("Source has no direct editorial URL: publisher-search");
  });

  it("allows ordinary article URLs with unrelated query parameters", () => {
    const issueList = validateContentGraph({
      sources: [{
        ...sources[0],
        id: "ordinary-article",
        url: "https://publisher.example/articles/gen-alpha?utm_source=search&language=en",
      }],
      themes: [],
      insights: [],
      evidenceItems: [],
    });

    expect(issueList).not.toContain("Source has no direct editorial URL: ordinary-article");
  });

  it("rejects source metadata dressed up as evidence", () => {
    const metadataEvidence = {
      ...evidenceItems[0],
      id: "metadata-evidence",
      claim: "The study surveyed children ages 7 to 14 about technology and household shopping.",
      claimKind: "finding" as const,
      supportRationale: "This only restates the study scope.",
      insightIds: [],
    };
    const issueList = validateContentGraph({
      sources: [sources.find((source) => source.id === metadataEvidence.sourceId)!],
      themes: [],
      insights: [],
      evidenceItems: [metadataEvidence],
    });

    expect(issueList).toContain("Evidence claim describes source metadata rather than a finding: metadata-evidence");
  });

  it("does not count source metadata toward an insight's evidence requirement", () => {
    const insight = {
      id: "metadata-insight",
      themeId: "play-belonging" as const,
      sequence: 1,
      title: "Metadata is not support",
      thesis: "A source description cannot substantiate this claim.",
      interpretation: "Test",
      evidenceIds: ["metadata-one", "metadata-two"],
      ageRange: "7-14",
      geography: "United States",
      confidence: "low" as const,
      confidenceReason: "Test",
      nuance: "Test",
      agencyImplication: "Test",
      relatedCreatorIds: [],
      relatedSpaceIds: [],
      tags: [],
    };
    const metadataEvidence = (["metadata-one", "metadata-two"] as const).map((id, index) => ({
      ...evidenceItems[index],
      id,
      sourceId: sources[index].id,
      claim: index === 0
        ? "The report examines video, devices, and household context."
        : "The study uses interviews and media diaries with children.",
      claimKind: "finding" as const,
      supportRationale: "This only restates source coverage or method.",
      insightIds: [insight.id],
    }));
    const issueList = validateContentGraph({
      sources: sources.slice(0, 2),
      themes: [{ id: "play-belonging", title: "Play", description: "Test theme" }],
      insights: [insight],
      evidenceItems: metadataEvidence,
    });

    expect(issueList).toContain("Insight lacks two claim-level evidence items: metadata-insight");
  });

  it("supports the YouTube daily-rhythm insight with YouTube routine findings", () => {
    const youtubeEvidence = evidenceItems.filter((item) => item.insightIds.includes("time-youtube-rhythm"));

    expect(youtubeEvidence).toHaveLength(2);
    for (const item of youtubeEvidence) {
      expect(item.claim).toMatch(/youtube/i);
      expect(item.claim).toMatch(/daily|every day|routine|regular/i);
      expect(["metric", "finding", "observed claim"]).toContain(item.claimKind);
    }
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
