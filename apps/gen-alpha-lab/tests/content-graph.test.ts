import { describe, expect, it } from "vitest";
import { cultureShapers } from "@/lib/content/culture-shapers";
import { evidenceItems, insights, themes } from "@/lib/content/evidence";
import { sources } from "@/lib/content/sources";
import { spaces } from "@/lib/content/spaces";
import { strategyPlays } from "@/lib/content/strategy";
import type { ContentGraph, StrategyPlay } from "@/lib/content/types";
import { validateContentGraph } from "@/lib/content/validate";

const canonicalGraph = {
  sources,
  themes,
  insights,
  evidenceItems,
  strategyPlays,
  spaces,
  cultureShapers,
} satisfies ContentGraph;

const emptyStrategyContext: Pick<ContentGraph, "strategyPlays" | "spaces" | "cultureShapers"> = {
  strategyPlays: [],
  spaces: [],
  cultureShapers: [],
};

const invalidStrategy = (field: keyof StrategyPlay, value: unknown): StrategyPlay => ({
  ...strategyPlays[0],
  [field]: value,
}) as StrategyPlay;

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

  it("rejects duplicate strategy IDs", () => {
    const issueList = validateContentGraph({
      ...canonicalGraph,
      strategyPlays: [strategyPlays[0], { ...strategyPlays[1], id: strategyPlays[0].id }],
    });

    expect(issueList).toContain(`Duplicate strategy ID: ${strategyPlays[0].id}`);
  });

  it.each([
    ["ageContext", undefined, "ageContext"],
    ["ageContext", "   ", "ageContext"],
    ["evidenceRationale", undefined, "evidenceRationale"],
    ["evidenceRationale", "   ", "evidenceRationale"],
    ["formats", undefined, "formats"],
    ["formats", [], "formats"],
    ["failureModes", undefined, "failureModes"],
    ["failureModes", [], "failureModes"],
    ["ethicalConstraints", undefined, "ethicalConstraints"],
    ["ethicalConstraints", [], "ethicalConstraints"],
  ] as Array<[keyof StrategyPlay, unknown, string]>)
  ("rejects a strategy with missing or empty %s", (field, value, issueField) => {
    const issueList = validateContentGraph({
      ...canonicalGraph,
      strategyPlays: [invalidStrategy(field, value)],
    });

    expect(issueList).toContain(`Strategy is missing ${issueField}: ${strategyPlays[0].id}`);
  });

  it.each([
    ["insightIds", "missing-insight", "insight"],
    ["sourceIds", "missing-source", "source"],
    ["relatedSpaceIds", "missing-space", "space"],
    ["relatedCultureShaperIds", "missing-culture-shaper", "culture shaper"],
  ] as Array<[keyof StrategyPlay, string, string]>)
  ("rejects a strategy with an orphan %s reference", (field, missingId, entityLabel) => {
    const issueList = validateContentGraph({
      ...canonicalGraph,
      strategyPlays: [invalidStrategy(field, [missingId])],
    });

    expect(issueList).toContain(
      `Strategy references missing ${entityLabel}: ${strategyPlays[0].id} -> ${missingId}`,
    );
  });

  it("rejects a declared strategy source that does not support any referenced insight", () => {
    const unrelatedSourceId = "bedtime-screen-early-adolescents-2024";
    const issueList = validateContentGraph({
      ...canonicalGraph,
      strategyPlays: [{ ...strategyPlays[0], sourceIds: [unrelatedSourceId] }],
    });

    expect(issueList).toContain(
      `Strategy source is not aligned to referenced insight evidence: ${strategyPlays[0].id} -> ${unrelatedSourceId}`,
    );
  });

  it("rejects a strategy insight with no evidence from its declared sources", () => {
    const unrelatedInsightId = "time-nighttime-use";
    const issueList = validateContentGraph({
      ...canonicalGraph,
      strategyPlays: [{
        ...strategyPlays[0],
        insightIds: [...strategyPlays[0].insightIds, unrelatedInsightId],
        sourceIds: ["walton-creation-gaming-2024"],
      }],
    });

    expect(issueList).toContain(
      `Strategy insight has no evidence from declared sources: ${strategyPlays[0].id} -> ${unrelatedInsightId}`,
    );
  });

  it("rejects search endpoints and placeholder scope fields", () => {
    const issueList = validateContentGraph({
      ...emptyStrategyContext,
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
      ...emptyStrategyContext,
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
    "https://publisher.example/?searchQuery=gen-alpha",
    "https://publisher.example/?SearchQuery=gen-alpha",
    "https://publisher.example/?searchquery=gen-alpha",
    "https://publisher.example/?search-query=gen-alpha",
    "https://publisher.example/?search_query=gen-alpha",
    "https://publisher.example/?searchTerm=gen-alpha",
    "https://publisher.example/search-results?term=gen-alpha",
    "https://publisher.example/searchresults?keyword=gen-alpha",
    "https://publisher.example/content/search/?query=gen-alpha",
    "https://publisher.example/find?search_query=gen-alpha",
  ])("rejects publisher search URL %s", (url) => {
    const issueList = validateContentGraph({
      ...emptyStrategyContext,
      sources: [{ ...sources[0], id: "publisher-search", url }],
      themes: [],
      insights: [],
      evidenceItems: [],
    });

    expect(issueList).toContain("Source has no direct editorial URL: publisher-search");
  });

  it("allows ordinary article URLs with unrelated query parameters", () => {
    const issueList = validateContentGraph({
      ...emptyStrategyContext,
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
      ...emptyStrategyContext,
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
      ...emptyStrategyContext,
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

  it("supports nighttime use with direct bedtime or overnight findings", () => {
    const nighttimeEvidence = evidenceItems.filter((item) => item.insightIds.includes("time-nighttime-use"));

    expect(nighttimeEvidence).toHaveLength(2);
    for (const item of nighttimeEvidence) {
      expect(item.claim).toMatch(/bedtime|before bed|overnight|in bed/i);
      expect(item.locator).toMatch(/abstract|results|table|section|paragraph/i);
      expect(["metric", "finding", "observed claim"]).toContain(item.claimKind);
    }
  });

  it("frames offline play rebound as a limited directional inference", () => {
    const insight = insights.find((item) => item.id === "play-offline-rebound");
    const reboundEvidence = evidenceItems.filter((item) => item.insightIds.includes("play-offline-rebound"));

    expect(insight?.title).toBe("Offline play is rebounding rather than disappearing.");
    expect(insight?.confidence).toBe("low");
    expect(insight?.confidenceReason).toMatch(/directional|partial|narrow/i);
    expect(insight?.nuance).toMatch(/sport|outdoor|not all offline play/i);
    expect(reboundEvidence).toHaveLength(2);
    for (const item of reboundEvidence) {
      expect(item.claim).toMatch(/increase|increased|grew|growth|rose|rebound|up from|uptick/i);
      expect(item.claim).toMatch(/202[0-9]/);
      expect(item.claimKind).toBe("editorial inference");
      expect(item.limitations).toMatch(/partial|narrow|not all|frequency|organized sport|outdoor recreation/i);
    }
  });

  it("rejects IDs reused across graph types", () => {
    const issueList = validateContentGraph({
      ...emptyStrategyContext,
      sources,
      themes: [{ id: "pwc-alpha-2026", title: "Duplicate ID", description: "Test theme" }],
      insights: [],
      evidenceItems: [],
    });

    expect(issueList).toContain("Duplicate graph ID across source and theme: pwc-alpha-2026");
  });

  it("rejects unsupported insight claims and evidence links", () => {
    const issueList = validateContentGraph({
      ...emptyStrategyContext,
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
