import { evidenceItems, insights, themes } from "./evidence";
import { sources } from "./sources";
import type { ContentGraph } from "./types";

const requiredEvidenceFields = ["population", "ageRange", "geography", "period", "methodology", "limitations"] as const;
const requiredSourceFields = ["population", "ageRange", "geography", "fieldworkPeriod", "methodology", "limitations"] as const;
const placeholderScope = /^(?:not fully disclosed|not stated|unknown|n\/?a|tbd)$/i;
const locatorPattern = /\b(?:sections?|tables?|figures?|pages?|paragraphs?|chapters?|abstract|methods|methodology|headline|opening|overview|description|guidance|key findings|executive summary)\b/i;
const claimKinds = new Set(["metric", "finding", "observed claim", "editorial inference"]);
const sourceMetadataClaimPattern = /^(?:(?:the|this|a|an)\s+)?(?:study|report|survey|review|census|article|release|research|panel|book|announcement)\s+(?:covers?|examines?|includes?|uses?|combines?|synthesizes?|follows?|measures?|surveys?|surveyed|evaluates?|focuses?|records?|is based on)\b/i;

const defaultGraph: ContentGraph = { sources, themes, insights, evidenceItems };

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
const isClaimLevelEvidence = (item: ContentGraph["evidenceItems"][number]): boolean =>
  claimKinds.has(item.claimKind) && Boolean(item.supportRationale?.trim()) && !sourceMetadataClaimPattern.test(item.claim.trim());

export const validateContentGraph = (graph: ContentGraph = defaultGraph): string[] => {
  const issues = [
    ...duplicateIds(graph.themes, "theme"),
    ...duplicateIds(graph.insights, "insight"),
    ...duplicateIds(graph.sources, "source"),
    ...duplicateIds(graph.evidenceItems, "evidence"),
    ...duplicateGraphIds(graph),
  ];
  const themeIds = new Set(graph.themes.map((theme) => theme.id));
  const insightIds = new Set(graph.insights.map((insight) => insight.id));
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

  return issues;
};
