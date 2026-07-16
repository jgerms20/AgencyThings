import { cultureShapers } from "./culture-shapers";
import { evidenceItems, insights, themes } from "./evidence";
import { sources } from "./sources";
import { spaces } from "./spaces";
import { strategyPlays } from "./strategy";
import type { ContentGraph } from "./types";

const requiredEvidenceFields = ["population", "ageRange", "geography", "period", "methodology", "limitations"] as const;
const requiredSourceFields = ["population", "ageRange", "geography", "fieldworkPeriod", "methodology", "limitations"] as const;
const placeholderScope = /^(?:not fully disclosed|not stated|unknown|n\/?a|tbd)$/i;
const locatorPattern = /\b(?:sections?|tables?|figures?|pages?|paragraphs?|chapters?|abstract|methods|methodology|headline|opening|overview|description|guidance|key findings|executive summary)\b/i;
const claimKinds = new Set(["metric", "finding", "observed claim", "editorial inference"]);
const sourceMetadataClaimPattern = /^(?:(?:the|this|a|an)\s+)?(?:study|report|survey|review|census|article|release|research|panel|book|announcement)\s+(?:covers?|examines?|includes?|uses?|combines?|synthesizes?|follows?|measures?|surveys?|surveyed|evaluates?|focuses?|records?|is based on)\b/i;

const defaultGraph: ContentGraph = {
  sources,
  themes,
  insights,
  evidenceItems,
  strategyPlays,
  spaces,
  cultureShapers,
};

const duplicateIds = (items: { id: string }[], label: string): string[] => {
  const seen = new Set<string>();
  const issues: string[] = [];

  for (const item of items) {
    if (seen.has(item.id)) issues.push(`Duplicate ${label} ID: ${item.id}`);
    seen.add(item.id);
  }

  return issues;
};

const duplicateGraphIds = (graph: ContentGraph): string[] => {
  const types = [
    ["source", graph.sources],
    ["theme", graph.themes],
    ["insight", graph.insights],
    ["evidence", graph.evidenceItems],
  ] as const;
  const ownerById = new Map<string, string>();
  const issues: string[] = [];

  for (const [type, items] of types) {
    for (const item of items) {
      const owner = ownerById.get(item.id);
      if (owner && owner !== type) issues.push(`Duplicate graph ID across ${owner} and ${type}: ${item.id}`);
      ownerById.set(item.id, type);
    }
  }

  return issues;
};

const hasDirectEditorialUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    const searchHost = /(?:^|\.)(?:google|bing|duckduckgo|yahoo)\./.test(hostname) || /(?:^|\.)search\./.test(hostname);
    const searchPath = url.pathname
      .split("/")
      .filter(Boolean)
      .map((segment) => segment.toLowerCase().replace(/[-_]/g, ""))
      .some((segment) => /^(?:search|sitesearch|searchresults|results|find)(?:\.(?:aspx?|html?))?$/.test(segment));
    const searchQueryKeys = new Set(["q", "query", "search", "s", "term", "keyword", "keywords", "searchquery", "searchterm", "searchword"]);
    const searchQuery = [...url.searchParams.keys()].some((key) => {
      const normalizedKey = key.toLowerCase().replace(/[-_]/g, "");
      return searchQueryKeys.has(normalizedKey);
    });

    return url.protocol === "https:" && Boolean(hostname) && !searchHost && !searchPath && !searchQuery;
  } catch {
    return false;
  }
};

const hasMeaningfulScope = (value: string): boolean => Boolean(value.trim()) && !placeholderScope.test(value.trim());
const hasText = (value: unknown): value is string => typeof value === "string" && Boolean(value.trim());
const hasTextList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.length > 0 && value.every(hasText);
const referenceIds = (value: unknown): string[] => Array.isArray(value) ? value.filter(hasText) : [];
const isClaimLevelEvidence = (item: ContentGraph["evidenceItems"][number]): boolean =>
  claimKinds.has(item.claimKind) && Boolean(item.supportRationale?.trim()) && !sourceMetadataClaimPattern.test(item.claim.trim());

export const validateContentGraph = (graph: ContentGraph = defaultGraph): string[] => {
  const issues = [
    ...duplicateIds(graph.themes, "theme"),
    ...duplicateIds(graph.insights, "insight"),
    ...duplicateIds(graph.sources, "source"),
    ...duplicateIds(graph.evidenceItems, "evidence"),
    ...duplicateIds(graph.strategyPlays, "strategy"),
    ...duplicateGraphIds(graph),
  ];
  const themeIds = new Set(graph.themes.map((theme) => theme.id));
  const insightIds = new Set(graph.insights.map((insight) => insight.id));
  const sourceIds = new Set(graph.sources.map((source) => source.id));
  const spaceIds = new Set(graph.spaces.map((space) => space.id));
  const cultureShaperIds = new Set(graph.cultureShapers.map((shaper) => shaper.id));
  const sourceById = new Map(graph.sources.map((source) => [source.id, source]));
  const evidenceById = new Map(graph.evidenceItems.map((item) => [item.id, item]));

  for (const source of graph.sources) {
    if (!hasDirectEditorialUrl(source.url)) issues.push(`Source has no direct editorial URL: ${source.id}`);
    for (const field of requiredSourceFields) {
      if (!hasMeaningfulScope(source[field])) issues.push(`Source has placeholder ${field}: ${source.id}`);
    }
    if (source.publishedAt === source.fieldworkPeriod) issues.push(`Source substitutes publication date for fieldworkPeriod: ${source.id}`);
  }

  for (const item of graph.evidenceItems) {
    const source = sourceById.get(item.sourceId);
    if (!source) issues.push(`Evidence references missing source: ${item.id}`);
    for (const field of requiredEvidenceFields) {
      if (!hasMeaningfulScope(item[field])) issues.push(`Evidence is missing ${field}: ${item.id}`);
    }
    if (!locatorPattern.test(item.locator)) issues.push(`Evidence has no specific locator: ${item.id}`);
    if (source && item.claim.trim() === source.summary.trim()) issues.push(`Evidence repeats source summary instead of an extracted claim: ${item.id}`);
    if (source && item.period === source.publishedAt) issues.push(`Evidence substitutes publication date for measurement period: ${item.id}`);
    if (!claimKinds.has(item.claimKind)) issues.push(`Evidence has no claim-level kind: ${item.id}`);
    if (!item.supportRationale?.trim()) issues.push(`Evidence has no support rationale: ${item.id}`);
    if (sourceMetadataClaimPattern.test(item.claim.trim())) {
      issues.push(`Evidence claim describes source metadata rather than a finding: ${item.id}`);
    }
    for (const insightId of item.insightIds) {
      if (!insightIds.has(insightId)) issues.push(`Evidence references missing insight: ${item.id}`);
    }
  }

  for (const insight of graph.insights) {
    if (!themeIds.has(insight.themeId)) issues.push(`Insight references missing theme: ${insight.id}`);
    const evidence = insight.evidenceIds.map((id) => evidenceById.get(id)).filter(Boolean);
    const claimLevelEvidence = evidence.filter((item) => isClaimLevelEvidence(item!));
    if (evidence.length !== insight.evidenceIds.length) issues.push(`Insight references missing evidence: ${insight.id}`);
    if (evidence.length < 2) issues.push(`Insight lacks two evidence items: ${insight.id}`);
    if (claimLevelEvidence.length < 2) issues.push(`Insight lacks two claim-level evidence items: ${insight.id}`);

    const sourceIds = new Set(claimLevelEvidence.map((item) => item!.sourceId));
    if (sourceIds.size < 2) issues.push(`Insight lacks two distinct sources: ${insight.id}`);
    if (!claimLevelEvidence.some((item) => sourceById.get(item!.sourceId)?.sourceClass !== "community signal")) {
      issues.push(`Insight lacks non-community evidence: ${insight.id}`);
    }
    if (evidence.some((item) => !item!.insightIds.includes(insight.id))) {
      issues.push(`Insight is not linked back from evidence: ${insight.id}`);
    }
  }

  for (const play of graph.strategyPlays) {
    if (!hasText(play.ageContext)) issues.push(`Strategy is missing ageContext: ${play.id}`);
    if (!hasText(play.evidenceRationale)) issues.push(`Strategy is missing evidenceRationale: ${play.id}`);
    if (!hasTextList(play.formats)) issues.push(`Strategy is missing formats: ${play.id}`);
    if (!hasTextList(play.failureModes)) issues.push(`Strategy is missing failureModes: ${play.id}`);
    if (!hasTextList(play.ethicalConstraints)) issues.push(`Strategy is missing ethicalConstraints: ${play.id}`);

    const playInsightIds = referenceIds(play.insightIds);
    const playSourceIds = referenceIds(play.sourceIds);
    const playSpaceIds = referenceIds(play.relatedSpaceIds);
    const playCultureShaperIds = referenceIds(play.relatedCultureShaperIds);

    for (const insightId of playInsightIds) {
      if (!insightIds.has(insightId)) issues.push(`Strategy references missing insight: ${play.id} -> ${insightId}`);
    }
    for (const sourceId of playSourceIds) {
      if (!sourceIds.has(sourceId)) issues.push(`Strategy references missing source: ${play.id} -> ${sourceId}`);
    }
    for (const spaceId of playSpaceIds) {
      if (!spaceIds.has(spaceId)) issues.push(`Strategy references missing space: ${play.id} -> ${spaceId}`);
    }
    for (const cultureShaperId of playCultureShaperIds) {
      if (!cultureShaperIds.has(cultureShaperId)) {
        issues.push(`Strategy references missing culture shaper: ${play.id} -> ${cultureShaperId}`);
      }
    }

    const validInsightIds = playInsightIds.filter((id) => insightIds.has(id));
    const validSourceIds = playSourceIds.filter((id) => sourceIds.has(id));
    const hasAlignedEvidence = (insightId: string, sourceId: string): boolean => graph.evidenceItems.some((item) =>
      item.sourceId === sourceId && item.insightIds.includes(insightId) && isClaimLevelEvidence(item),
    );

    if (validInsightIds.length > 0) {
      for (const sourceId of validSourceIds) {
        if (!validInsightIds.some((insightId) => hasAlignedEvidence(insightId, sourceId))) {
          issues.push(`Strategy source is not aligned to referenced insight evidence: ${play.id} -> ${sourceId}`);
        }
      }
    }
    if (validSourceIds.length > 0) {
      for (const insightId of validInsightIds) {
        if (!validSourceIds.some((sourceId) => hasAlignedEvidence(insightId, sourceId))) {
          issues.push(`Strategy insight has no evidence from declared sources: ${play.id} -> ${insightId}`);
        }
      }
    }
  }

  return issues;
};
