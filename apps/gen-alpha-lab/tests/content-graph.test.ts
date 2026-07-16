import { describe, expect, it } from "vitest";
import { cultureShapers } from "@/lib/content/culture-shapers";
import { comparisonDimensions } from "@/lib/content/comparisons";
import { evidenceItems } from "@/lib/content/evidence";
import { insights, themes } from "@/lib/content/insights";
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
  comparisons: comparisonDimensions,
  strategyPlays,
  spaces,
  cultureShapers,
} satisfies ContentGraph;

const emptyStrategyContext: Pick<ContentGraph, "strategyPlays" | "spaces" | "cultureShapers"> = {
  strategyPlays: [],
  spaces: [],
  cultureShapers: [],
};

const emptyGraph: ContentGraph = {
  sources: [],
  themes: [],
  insights: [],
  evidenceItems: [],
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
      expect(item.supportRationale).not.toMatch(/directly substantiates/i);
    }

    for (const source of sources) {
      expect(source.population).not.toMatch(/not fully disclosed/i);
      expect(source.ageRange).not.toMatch(/not fully disclosed/i);
      expect(source.geography).not.toMatch(/not fully disclosed/i);
      expect(source.fieldworkPeriod).toBeTruthy();
      expect(source.fieldworkPeriod).not.toBe(source.publishedAt);
      expect(source.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }

    expect(new Set(evidenceItems.map((item) => item.supportRationale))).toHaveProperty("size", evidenceItems.length);

    expect(sources.find((source) => source.id === "arxiv-young-user-safety-2025")?.sourceClass)
      .toBe("primary research");
  });

  it("has no graph validation issues", () => {
    expect(validateContentGraph()).toEqual([]);
  });

  it("rejects an enriched insight with a missing rendered implication", () => {
    const insight = insights[0];
    const issueList = validateContentGraph({
      ...canonicalGraph,
      insights: insights.map((candidate) => candidate.id === insight.id
        ? { ...candidate, agencyImplication: "" }
        : candidate),
    });

    expect(issueList).toContain(`Insight is missing agency implication: ${insight.id}`);
  });

  it.each([
    ["themes", { themes: themes.slice(0, 3) }, "Expected exactly 4 themes, received 3"],
    ["insights in a theme", { insights: insights.filter((insight) => insight.themeId !== "play-belonging" || insight.sequence !== 10) }, "Theme must have exactly 10 insights: play-belonging (9)"],
    ["spaces", { spaces: spaces.slice(0, 53) }, "Expected exactly 54 spaces, received 53"],
    ["comparisons", { comparisons: comparisonDimensions.slice(0, 3) }, "Expected exactly 4 comparison topics, received 3"],
  ] as const)("rejects a non-canonical %s count", (_label, changes, expectedIssue) => {
    const issueList = validateContentGraph({ ...canonicalGraph, ...changes } as ContentGraph);

    expect(issueList).toContain(expectedIssue);
  });

  it.each([
    ["artists", cultureShapers.filter((shaper) => shaper.type !== "artist"), "Expected at least 30 artist culture shapers, received 0"],
    ["athletes", cultureShapers.filter((shaper) => shaper.type !== "athlete"), "Expected at least 12 athlete culture shapers, received 0"],
    ["IP records", cultureShapers.filter((shaper) => shaper.type !== "screen-ip" && shaper.type !== "franchise"), "Expected at least 12 IP culture shapers, received 0"],
  ] as const)("rejects a graph below the %s coverage floor", (_label, cultureShapers, expectedIssue) => {
    const issueList = validateContentGraph({ ...canonicalGraph, cultureShapers });

    expect(issueList).toContain(expectedIssue);
  });

  it("rejects orphaned insight, space, and culture-shaper references", () => {
    const insight = insights[0];
    const space = spaces[0];
    const shaper = cultureShapers[0];
    const issueList = validateContentGraph({
      ...canonicalGraph,
      insights: insights.map((candidate) => candidate.id === insight.id
        ? { ...candidate, relatedCreatorIds: ["missing-culture-shaper"], relatedSpaceIds: ["missing-space"] }
        : candidate),
      spaces: spaces.map((candidate) => candidate.id === space.id
        ? { ...candidate, relatedInsightIds: ["missing-insight"], relatedCultureShaperIds: ["missing-culture-shaper"] }
        : candidate),
      cultureShapers: cultureShapers.map((candidate) => candidate.id === shaper.id
        ? { ...candidate, insightIds: ["missing-insight"], relatedSpaceIds: ["missing-space"] }
        : candidate),
    });

    expect(issueList).toContain(`Insight references missing culture shaper: ${insight.id} -> missing-culture-shaper`);
    expect(issueList).toContain(`Insight references missing space: ${insight.id} -> missing-space`);
    expect(issueList).toContain(`Space references missing insight: ${space.id} -> missing-insight`);
    expect(issueList).toContain(`Culture shaper references missing insight: ${shaper.id} -> missing-insight`);
  });

  it("rejects incomplete culture-shaper indicators", () => {
    const shaper = cultureShapers[0];
    const indicators = { ...shaper.indicators } as Record<string, unknown>;
    delete indicators.reach;
    const issueList = validateContentGraph({
      ...canonicalGraph,
      cultureShapers: cultureShapers.map((candidate) => candidate.id === shaper.id
        ? { ...candidate, indicators }
        : candidate),
    });

    expect(issueList).toContain(`Culture shaper is missing indicator: ${shaper.id} -> reach`);
  });

  it("rejects a culture-shaper indicator with the wrong tier definition", () => {
    const shaper = cultureShapers[0];
    const issueList = validateContentGraph({
      ...canonicalGraph,
      cultureShapers: cultureShapers.map((candidate) => candidate.id === shaper.id
        ? {
          ...candidate,
          indicators: {
            ...candidate.indicators,
            reach: { ...candidate.indicators.reach, definition: "A mismatched rubric definition." },
          },
        }
        : candidate),
    });

    expect(issueList).toContain(`Culture shaper indicator has wrong rubric definition: ${shaper.id} -> reach`);
  });

  it("rejects an incomplete comparison evidence record", () => {
    const comparison = comparisonDimensions[0];
    const evidenceId = comparison.genAlpha.evidenceIds[0];
    const issueList = validateContentGraph({
      ...canonicalGraph,
      comparisons: comparisonDimensions.map((candidate) => candidate.id === comparison.id
        ? {
          ...candidate,
          genAlpha: {
            ...candidate.genAlpha,
            evidenceSupport: { ...candidate.genAlpha.evidenceSupport, [evidenceId]: "" },
          },
        }
        : candidate),
    } as ContentGraph);

    expect(issueList).toContain(`Comparison evidence is missing support: ${comparison.id} -> ${evidenceId}`);
  });

  it("rejects an invalid comparison class", () => {
    const comparison = comparisonDimensions[0];
    const comparisonOptions = (comparison as unknown as {
      comparisons?: Record<string, { comparisonClass: string }>;
    }).comparisons;
    expect(comparisonOptions, "comparison topic must define cohort options").toBeDefined();
    if (!comparisonOptions) return;

    const issueList = validateContentGraph({
      ...canonicalGraph,
      comparisons: comparisonDimensions.map((candidate) => candidate.id === comparison.id
        ? {
          ...candidate,
          comparisons: {
            ...comparisonOptions,
            genZ: { ...comparisonOptions.genZ, comparisonClass: "unsupported ranking" },
          },
        }
        : candidate),
    } as unknown as ContentGraph);

    expect(issueList).toContain(`Comparison has invalid comparisonClass: ${comparison.id} -> Gen Z`);
  });

  it("rejects a comparison combination without exact strategic difference copy", () => {
    const comparison = comparisonDimensions[0];
    const comparisonOptions = (comparison as unknown as {
      comparisons?: Record<string, { realDifference: string }>;
    }).comparisons;
    expect(comparisonOptions, "comparison topic must define cohort options").toBeDefined();
    if (!comparisonOptions) return;

    const issueList = validateContentGraph({
      ...canonicalGraph,
      comparisons: comparisonDimensions.map((candidate) => candidate.id === comparison.id
        ? {
          ...candidate,
          comparisons: {
            ...comparisonOptions,
            genX: { ...comparisonOptions.genX, realDifference: "" },
          },
        }
        : candidate),
    } as unknown as ContentGraph);

    expect(issueList).toContain(`Comparison is missing realDifference: ${comparison.id} -> Gen X`);
  });

  it("requires Gen X and Boomer claims to use an adult proxy or an explicit evidence gap", () => {
    const comparison = comparisonDimensions[0];
    const comparisonOptions = (comparison as unknown as {
      comparisons?: Record<string, { cohort: { evidenceStatus: string } }>;
    }).comparisons;
    expect(comparisonOptions, "comparison topic must define cohort options").toBeDefined();
    if (!comparisonOptions) return;

    const issueList = validateContentGraph({
      ...canonicalGraph,
      comparisons: comparisonDimensions.map((candidate) => candidate.id === comparison.id
        ? {
          ...candidate,
          comparisons: {
            ...comparisonOptions,
            boomers: {
              ...comparisonOptions.boomers,
              cohort: { ...comparisonOptions.boomers.cohort, evidenceStatus: "direct cohort evidence" },
            },
          },
        }
        : candidate),
    } as unknown as ContentGraph);

    expect(issueList).toContain(`Comparison adult cohort must use an age-band proxy or evidence gap: ${comparison.id} -> Boomers`);
  });

  it("includes canonical Deloitte and Pew comparison evidence with honest scope", () => {
    const deloitte = sources.find((source) => source.id === "deloitte-digital-media-trends-2025");
    const pew = sources.find((source) => source.id === "pew-adult-social-media-2025");
    const deloitteEvidence = evidenceItems.find((item) => item.id === "evidence-compare-deloitte-genz-media-1");
    const pewEvidence = evidenceItems.find((item) => item.id === "evidence-compare-pew-adult-platforms-1");

    expect(deloitte?.sampleSize).toBe("3,595 U.S. consumers");
    expect(deloitte?.fieldworkPeriod).toBe("October 2024");
    expect(pew?.sampleSize).toBe("5,022 U.S. adults");
    expect(pew?.fieldworkPeriod).toBe("February 5-June 18, 2025");
    expect(deloitteEvidence?.claim).toMatch(/54% more time.*26% less time/i);
    expect(pewEvidence?.claim).toMatch(/95%.*18-29.*64%.*65\+.*TikTok.*63%.*12%/i);
  });

  it("rejects duplicate strategy IDs", () => {
    const issueList = validateContentGraph({
      ...canonicalGraph,
      strategyPlays: [strategyPlays[0], { ...strategyPlays[1], id: strategyPlays[0].id }],
    });

    expect(issueList).toContain(`Duplicate strategy ID: ${strategyPlays[0].id}`);
  });

  it("rejects duplicate IDs within spaces and culture shapers", () => {
    const duplicateSpaceIssues = validateContentGraph({
      ...emptyGraph,
      spaces: [{ id: "duplicate-space" }, { id: "duplicate-space" }],
    });
    const duplicateShaperIssues = validateContentGraph({
      ...emptyGraph,
      cultureShapers: [{ id: "duplicate-shaper", type: "creator" }, { id: "duplicate-shaper", type: "creator" }],
    });

    expect(duplicateSpaceIssues).toContain("Duplicate space ID: duplicate-space");
    expect(duplicateShaperIssues).toContain("Duplicate culture shaper ID: duplicate-shaper");
  });

  it("rejects IDs reused across space and culture-shaper graph types", () => {
    const issueList = validateContentGraph({
      ...emptyGraph,
      spaces: [{ id: "shared-environment" }],
      cultureShapers: [{ id: "shared-environment", type: "creator" }],
    });

    expect(issueList).toContain(
      "Duplicate graph ID across space and culture shaper: shared-environment",
    );
  });

  it.each([
    ["whenAppropriate", undefined, "whenAppropriate"],
    ["whenAppropriate", "   ", "whenAppropriate"],
    ["ageContext", undefined, "ageContext"],
    ["ageContext", "   ", "ageContext"],
    ["directChildValue", undefined, "directChildValue"],
    ["directChildValue", "   ", "directChildValue"],
    ["adultDecisionContext", undefined, "adultDecisionContext"],
    ["adultDecisionContext", "   ", "adultDecisionContext"],
    ["evidenceRationale", undefined, "evidenceRationale"],
    ["evidenceRationale", "   ", "evidenceRationale"],
    ["formats", undefined, "formats"],
    ["formats", [], "formats"],
    ["failureModes", undefined, "failureModes"],
    ["failureModes", [], "failureModes"],
    ["ethicalConstraints", undefined, "ethicalConstraints"],
    ["ethicalConstraints", [], "ethicalConstraints"],
    ["evidenceIds", undefined, "evidenceIds"],
    ["evidenceIds", [], "evidenceIds"],
    ["insightIds", undefined, "insightIds"],
    ["insightIds", [], "insightIds"],
    ["sourceIds", undefined, "sourceIds"],
    ["sourceIds", [], "sourceIds"],
    ["relatedSpaceIds", undefined, "relatedSpaceIds"],
    ["relatedSpaceIds", [], "relatedSpaceIds"],
    ["relatedCultureShaperIds", undefined, "relatedCultureShaperIds"],
    ["relatedCultureShaperIds", [], "relatedCultureShaperIds"],
  ] as Array<[keyof StrategyPlay, unknown, string]>)
  ("rejects a strategy with missing or empty %s", (field, value, issueField) => {
    const issueList = validateContentGraph({
      ...canonicalGraph,
      strategyPlays: [invalidStrategy(field, value)],
    });

    expect(issueList).toContain(`Strategy is missing ${issueField}: ${strategyPlays[0].id}`);
  });

  it.each([
    ["evidenceIds", "missing-evidence", "evidence"],
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

  it("rejects selected strategy evidence whose source is not declared", () => {
    const evidenceId = "evidence-play-making-interface-2";
    const issueList = validateContentGraph({
      ...canonicalGraph,
      strategyPlays: [{ ...strategyPlays[0], evidenceIds: [evidenceId] }],
    });

    expect(issueList).toContain(
      `Strategy evidence uses undeclared source: ${strategyPlays[0].id} -> ${evidenceId} -> roblox-search-style-trends-2025`,
    );
  });

  it("rejects a declared strategy source with no selected evidence", () => {
    const sourceId = "roblox-search-style-trends-2025";
    const issueList = validateContentGraph({
      ...canonicalGraph,
      strategyPlays: [{
        ...strategyPlays[0],
        evidenceIds: ["evidence-play-making-interface-1", "evidence-learning-creation-skills-1"],
        sourceIds: [...strategyPlays[0].sourceIds, sourceId],
      }],
    });

    expect(issueList).toContain(
      `Strategy source has no selected evidence: ${strategyPlays[0].id} -> ${sourceId}`,
    );
  });

  it("rejects selected strategy evidence that supports no declared insight", () => {
    const evidenceId = "evidence-time-nighttime-use-1";
    const issueList = validateContentGraph({
      ...canonicalGraph,
      strategyPlays: [{
        ...strategyPlays[0],
        evidenceIds: [evidenceId],
        sourceIds: ["bedtime-screen-early-adolescents-2024"],
      }],
    });

    expect(issueList).toContain(
      `Strategy evidence does not support a declared insight: ${strategyPlays[0].id} -> ${evidenceId}`,
    );
  });

  it("rejects a declared strategy insight with no selected evidence", () => {
    const insightId = "learning-creation-skills";
    const issueList = validateContentGraph({
      ...canonicalGraph,
      strategyPlays: [{
        ...strategyPlays[0],
        evidenceIds: ["evidence-play-making-interface-1"],
      }],
    });

    expect(issueList).toContain(
      `Strategy insight has no selected evidence: ${strategyPlays[0].id} -> ${insightId}`,
    );
  });

  it("rejects evidence-to-insight links that are not reciprocated by the insight", () => {
    const evidence = evidenceItems[0];
    const insightId = evidence.insightIds[0];
    const issueList = validateContentGraph({
      ...canonicalGraph,
      insights: insights.map((insight) => insight.id === insightId ? {
        ...insight,
        evidenceIds: insight.evidenceIds.filter((id) => id !== evidence.id),
      } : insight),
    });

    expect(issueList).toContain(
      `Evidence is not linked back from insight: ${evidence.id} -> ${insightId}`,
    );
  });

  it("rejects insight-to-evidence links that are not reciprocated by the evidence", () => {
    const evidence = evidenceItems[0];
    const insightId = evidence.insightIds[0];
    const issueList = validateContentGraph({
      ...canonicalGraph,
      evidenceItems: evidenceItems.map((item) => item.id === evidence.id ? {
        ...item,
        insightIds: item.insightIds.filter((id) => id !== insightId),
      } : item),
    });

    expect(issueList).toContain(`Insight is not linked back from evidence: ${insightId}`);
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
