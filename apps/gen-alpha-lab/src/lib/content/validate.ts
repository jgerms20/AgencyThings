import { comparisonDimensions } from "./comparisons";
import { cultureShaperRubric, cultureShapers } from "./culture-shapers";
import { evidenceItems } from "./evidence";
import { insights, themes } from "./insights";
import { sources } from "./sources";
import { spaces } from "./spaces";
import { strategyPlays } from "./strategy";
import type { ComparisonCohort, ContentGraph } from "./types";

const requiredEvidenceFields = ["population", "ageRange", "geography", "period", "methodology", "limitations"] as const;
const requiredSourceFields = ["publishedAt", "population", "ageRange", "geography", "fieldworkPeriod", "methodology", "limitations"] as const;
const placeholderScope = /^(?:not fully disclosed|not stated|unknown|n\/?a|tbd)$/i;
const locatorPattern = /\b(?:sections?|tables?|figures?|pages?|paragraphs?|chapters?|abstract|methods|methodology|headline|opening|overview|description|guidance|key findings|executive summary)\b/i;
const claimKinds = new Set(["metric", "finding", "observed claim", "editorial inference"]);
const sourceMetadataClaimPattern = /^(?:(?:the|this|a|an)\s+)?(?:study|report|survey|review|census|article|release|research|panel|book|announcement)\s+(?:covers?|examines?|includes?|uses?|combines?|synthesizes?|follows?|measures?|surveys?|surveyed|evaluates?|focuses?|records?|is based on)\b/i;
const canonicalThemeIds = ["play-belonging", "media-influence", "time-routines", "learning-becoming"] as const;
const indicatorKeys = ["reach", "participation", "commercialPull", "audienceCenter"] as const;
const expectedInsightsPerTheme = 10;
const expectedSpaces = 54;
const expectedComparisons = 4;
const comparisonClasses = new Set(["age-matched observed evidence", "current cohort snapshot", "directional interpretation"]);
const comparisonEvidenceStatuses = new Set(["direct cohort evidence", "near-age proxy", "adult age-band proxy", "evidence gap"]);
const comparisonCohorts = [
  ["genZ", "Gen Z"],
  ["genX", "Gen X"],
  ["boomers", "Boomers"],
] as const;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

const defaultGraph: ContentGraph = {
  sources,
  themes,
  insights,
  evidenceItems,
  comparisons: comparisonDimensions,
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
    ["strategy", graph.strategyPlays],
    ["space", graph.spaces],
    ["culture shaper", graph.cultureShapers],
    ["comparison", graph.comparisons ?? []],
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

const validateReferences = (
  ownerLabel: string,
  ownerId: string,
  fieldLabel: string,
  references: unknown,
  validIds: Set<string>,
  issues: string[],
): string[] => {
  const ids = referenceIds(references);
  for (const id of ids) {
    if (!validIds.has(id)) issues.push(`${ownerLabel} references missing ${fieldLabel}: ${ownerId} -> ${id}`);
  }
  return ids;
};

const isIndicatorTier = (value: unknown): value is 1 | 2 | 3 | 4 => value === 1 || value === 2 || value === 3 || value === 4;

const validateComparisonCohort = (
  comparisonId: string,
  cohortLabel: string,
  cohort: ComparisonCohort,
  sourceIds: Set<string>,
  evidenceById: Map<string, ContentGraph["evidenceItems"][number]>,
  issues: string[],
): void => {
  for (const field of ["mentality", "ageRange", "geography", "sourceYear"] as const) {
    if (!hasText(cohort[field])) issues.push(`Comparison is missing ${field}: ${comparisonId} -> ${cohortLabel}`);
  }
  if (!comparisonEvidenceStatuses.has(cohort.evidenceStatus)) {
    issues.push(`Comparison has invalid evidenceStatus: ${comparisonId} -> ${cohortLabel}`);
  }

  const cohortSourceIds = referenceIds(cohort.sourceIds);
  const cohortEvidenceIds = referenceIds(cohort.evidenceIds);
  if (cohort.evidenceStatus === "evidence gap") {
    if (cohortSourceIds.length > 0 || cohortEvidenceIds.length > 0) {
      issues.push(`Comparison evidence gap must not cite evidence: ${comparisonId} -> ${cohortLabel}`);
    }
  } else {
    if (!hasTextList(cohort.sourceIds)) issues.push(`Comparison is missing sourceIds: ${comparisonId} -> ${cohortLabel}`);
    if (!hasTextList(cohort.evidenceIds)) issues.push(`Comparison is missing evidenceIds: ${comparisonId} -> ${cohortLabel}`);
  }

  for (const sourceId of cohortSourceIds) {
    if (!sourceIds.has(sourceId)) issues.push(`Comparison references missing source: ${comparisonId} -> ${cohortLabel} -> ${sourceId}`);
  }
  for (const evidenceId of cohortEvidenceIds) {
    const evidence = evidenceById.get(evidenceId);
    if (!evidence) {
      issues.push(`Comparison references missing evidence: ${comparisonId} -> ${cohortLabel} -> ${evidenceId}`);
      continue;
    }
    if (!cohortSourceIds.includes(evidence.sourceId)) {
      issues.push(`Comparison evidence uses undeclared source: ${comparisonId} -> ${cohortLabel} -> ${evidenceId} -> ${evidence.sourceId}`);
    }
    if (!hasText(cohort.evidenceSupport?.[evidenceId])) {
      issues.push(`Comparison evidence is missing support: ${comparisonId} -> ${evidenceId}`);
    }
  }
  for (const supportId of Object.keys(cohort.evidenceSupport ?? {})) {
    if (!cohortEvidenceIds.includes(supportId)) {
      issues.push(`Comparison has orphan evidence support: ${comparisonId} -> ${supportId}`);
    }
  }
};

export const validateContentGraph = (graph: ContentGraph = defaultGraph): string[] => {
  const comparisons = graph.comparisons ?? [];
  const issues = [
    ...duplicateIds(graph.themes, "theme"),
    ...duplicateIds(graph.insights, "insight"),
    ...duplicateIds(graph.sources, "source"),
    ...duplicateIds(graph.evidenceItems, "evidence"),
    ...duplicateIds(graph.strategyPlays, "strategy"),
    ...duplicateIds(graph.spaces, "space"),
    ...duplicateIds(graph.cultureShapers, "culture shaper"),
    ...duplicateIds(comparisons, "comparison"),
    ...duplicateGraphIds(graph),
  ];
  const themeIds = new Set(graph.themes.map((theme) => theme.id));
  const insightIds = new Set(graph.insights.map((insight) => insight.id));
  const sourceIds = new Set(graph.sources.map((source) => source.id));
  const spaceIds = new Set(graph.spaces.map((space) => space.id));
  const cultureShaperIds = new Set(graph.cultureShapers.map((shaper) => shaper.id));
  const cultureShaperReferenceIds = new Set([
    ...cultureShaperIds,
    ...graph.cultureShapers.map((shaper) => shaper.id.replace(/-franchise$/, "")),
  ]);
  const sourceById = new Map(graph.sources.map((source) => [source.id, source]));
  const insightById = new Map(graph.insights.map((insight) => [insight.id, insight]));
  const evidenceById = new Map(graph.evidenceItems.map((item) => [item.id, item]));
  const rationaleOwners = new Map<string, string>();

  if (graph.themes.length !== canonicalThemeIds.length) {
    issues.push(`Expected exactly ${canonicalThemeIds.length} themes, received ${graph.themes.length}`);
  }

  const cultureShaperCounts = {
    artist: graph.cultureShapers.filter((shaper) => shaper.type === "artist").length,
    athlete: graph.cultureShapers.filter((shaper) => shaper.type === "athlete").length,
    ip: graph.cultureShapers.filter((shaper) => shaper.type === "screen-ip" || shaper.type === "franchise").length,
  };
  if (cultureShaperCounts.artist < 30) {
    issues.push(`Expected at least 30 artist culture shapers, received ${cultureShaperCounts.artist}`);
  }
  if (cultureShaperCounts.athlete < 12) {
    issues.push(`Expected at least 12 athlete culture shapers, received ${cultureShaperCounts.athlete}`);
  }
  if (cultureShaperCounts.ip < 12) {
    issues.push(`Expected at least 12 IP culture shapers, received ${cultureShaperCounts.ip}`);
  }
  if (graph.insights.length !== canonicalThemeIds.length * expectedInsightsPerTheme) {
    issues.push(`Expected exactly ${canonicalThemeIds.length * expectedInsightsPerTheme} insights, received ${graph.insights.length}`);
  }
  if (graph.spaces.length !== expectedSpaces) {
    issues.push(`Expected exactly ${expectedSpaces} spaces, received ${graph.spaces.length}`);
  }
  if (comparisons.length !== expectedComparisons) {
    issues.push(`Expected exactly ${expectedComparisons} comparison topics, received ${comparisons.length}`);
  }
  for (const themeId of canonicalThemeIds) {
    if (!themeIds.has(themeId)) issues.push(`Missing canonical theme: ${themeId}`);
    const themeInsights = graph.insights.filter((insight) => insight.themeId === themeId);
    if (themeInsights.length !== expectedInsightsPerTheme) {
      issues.push(`Theme must have exactly ${expectedInsightsPerTheme} insights: ${themeId} (${themeInsights.length})`);
    }
    const sequences = themeInsights.map((insight) => insight.sequence).sort((left, right) => left - right);
    const expectedSequences = Array.from({ length: expectedInsightsPerTheme }, (_, index) => index + 1);
    if (sequences.join(",") !== expectedSequences.join(",")) {
      issues.push(`Theme has incomplete insight sequence: ${themeId}`);
    }
  }

  for (const source of graph.sources) {
    if (!hasDirectEditorialUrl(source.url)) issues.push(`Source has no direct editorial URL: ${source.id}`);
    for (const field of requiredSourceFields) {
      if (!hasMeaningfulScope(source[field])) issues.push(`Source has placeholder ${field}: ${source.id}`);
    }
    if (!isoDatePattern.test(source.publishedAt)) issues.push(`Source has invalid publishedAt: ${source.id}`);
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
    if (item.supportRationale.trim().length < 48) issues.push(`Evidence support rationale is too thin: ${item.id}`);
    const rationaleOwner = rationaleOwners.get(item.supportRationale.trim());
    if (rationaleOwner) issues.push(`Evidence repeats support rationale: ${item.id} -> ${rationaleOwner}`);
    rationaleOwners.set(item.supportRationale.trim(), item.id);
    if (sourceMetadataClaimPattern.test(item.claim.trim())) {
      issues.push(`Evidence claim describes source metadata rather than a finding: ${item.id}`);
    }
    for (const insightId of item.insightIds) {
      const insight = insightById.get(insightId);
      if (!insight) {
        issues.push(`Evidence references missing insight: ${item.id}`);
      } else if (!insight.evidenceIds.includes(item.id)) {
        issues.push(`Evidence is not linked back from insight: ${item.id} -> ${insightId}`);
      }
    }
  }

  for (const insight of graph.insights) {
    if (!themeIds.has(insight.themeId)) issues.push(`Insight references missing theme: ${insight.id}`);
    const renderedFields = [
      ["interpretation", "interpretation"],
      ["genZComparison", "Gen Z comparison"],
      ["agencyImplication", "agency implication"],
      ["confidenceReason", "confidence reason"],
      ["nuance", "nuance"],
    ] as const;
    for (const [field, label] of renderedFields) {
      if (!hasText(insight[field])) issues.push(`Insight is missing ${label}: ${insight.id}`);
    }
    if (!hasTextList(insight.relatedCreatorIds)) issues.push(`Insight is missing relatedCreatorIds: ${insight.id}`);
    if (!hasTextList(insight.relatedSpaceIds)) issues.push(`Insight is missing relatedSpaceIds: ${insight.id}`);
    validateReferences("Insight", insight.id, "culture shaper", insight.relatedCreatorIds, cultureShaperReferenceIds, issues);
    validateReferences("Insight", insight.id, "space", insight.relatedSpaceIds, spaceIds, issues);
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

  for (const space of graph.spaces) {
    validateReferences("Space", space.id, "insight", space.relatedInsightIds, insightIds, issues);
    validateReferences("Space", space.id, "culture shaper", space.relatedCultureShaperIds, cultureShaperIds, issues);
    const spaceSourceIds = validateReferences("Space", space.id, "source", space.sourceIds, sourceIds, issues);
    const spaceEvidenceIds = validateReferences("Space", space.id, "evidence", space.evidenceIds, new Set(evidenceById.keys()), issues);
    for (const evidenceId of spaceEvidenceIds) {
      const evidence = evidenceById.get(evidenceId);
      if (evidence && !spaceSourceIds.includes(evidence.sourceId)) {
        issues.push(`Space evidence uses undeclared source: ${space.id} -> ${evidenceId} -> ${evidence.sourceId}`);
      }
    }
  }

  for (const shaper of graph.cultureShapers) {
    validateReferences("Culture shaper", shaper.id, "insight", shaper.insightIds, insightIds, issues);
    validateReferences("Culture shaper", shaper.id, "space", shaper.relatedSpaceIds, spaceIds, issues);
    validateReferences("Culture shaper", shaper.id, "source", shaper.sourceIds, sourceIds, issues);
    for (const sourceNote of shaper.sourceNotes ?? []) {
      if (!sourceIds.has(sourceNote.sourceId)) {
        issues.push(`Culture shaper source note references missing source: ${shaper.id} -> ${sourceNote.sourceId}`);
      }
      if (!hasText(sourceNote.note)) issues.push(`Culture shaper source note is missing note: ${shaper.id} -> ${sourceNote.sourceId}`);
    }
    for (const entity of shaper.relatedEntities ?? []) {
      const idsByKind = entity.kind === "insight" ? insightIds : entity.kind === "space" ? spaceIds : cultureShaperIds;
      if (!idsByKind.has(entity.id)) {
        issues.push(`Culture shaper references missing ${entity.kind}: ${shaper.id} -> ${entity.id}`);
      }
    }

    const indicators = shaper.indicators ?? {};
    for (const indicatorKey of indicatorKeys) {
      const indicator = indicators[indicatorKey];
      if (!indicator) {
        issues.push(`Culture shaper is missing indicator: ${shaper.id} -> ${indicatorKey}`);
        continue;
      }
      if (indicator.indicator !== indicatorKey) issues.push(`Culture shaper indicator has wrong key: ${shaper.id} -> ${indicatorKey}`);
      if (!hasText(indicator.label)) issues.push(`Culture shaper indicator is missing label: ${shaper.id} -> ${indicatorKey}`);
      if (!hasText(indicator.definition)) issues.push(`Culture shaper indicator is missing definition: ${shaper.id} -> ${indicatorKey}`);
      if (isIndicatorTier(indicator.tier) && indicator.definition !== cultureShaperRubric[indicatorKey].tiers[indicator.tier]) {
        issues.push(`Culture shaper indicator has wrong rubric definition: ${shaper.id} -> ${indicatorKey}`);
      }
      if (!hasText(indicator.rationale)) issues.push(`Culture shaper indicator is missing rationale: ${shaper.id} -> ${indicatorKey}`);
      if (!isIndicatorTier(indicator.tier)) issues.push(`Culture shaper indicator has invalid tier: ${shaper.id} -> ${indicatorKey}`);
      if (!hasTextList(indicator.sourceIds)) issues.push(`Culture shaper indicator is missing sourceIds: ${shaper.id} -> ${indicatorKey}`);
      validateReferences("Culture shaper indicator", `${shaper.id} -> ${indicatorKey}`, "source", indicator.sourceIds, sourceIds, issues);
    }
  }

  for (const comparison of comparisons) {
    if (!hasText(comparison.title)) issues.push(`Comparison is missing title: ${comparison.id}`);
    validateComparisonCohort(comparison.id, "Gen Alpha", comparison.genAlpha, sourceIds, evidenceById, issues);
    for (const [cohortKey, cohortLabel] of comparisonCohorts) {
      const option = comparison.comparisons?.[cohortKey];
      if (!option) {
        issues.push(`Comparison is missing cohort option: ${comparison.id} -> ${cohortLabel}`);
        continue;
      }
      if (!hasText(option.realDifference)) issues.push(`Comparison is missing realDifference: ${comparison.id} -> ${cohortLabel}`);
      if (!hasText(option.caveat)) issues.push(`Comparison is missing caveat: ${comparison.id} -> ${cohortLabel}`);
      if (!comparisonClasses.has(option.comparisonClass)) {
        issues.push(`Comparison has invalid comparisonClass: ${comparison.id} -> ${cohortLabel}`);
      }
      validateComparisonCohort(comparison.id, cohortLabel, option.cohort, sourceIds, evidenceById, issues);
      if ((cohortKey === "genX" || cohortKey === "boomers")
        && option.cohort.evidenceStatus !== "adult age-band proxy"
        && option.cohort.evidenceStatus !== "evidence gap") {
        issues.push(`Comparison adult cohort must use an age-band proxy or evidence gap: ${comparison.id} -> ${cohortLabel}`);
      }
    }
  }

  for (const play of graph.strategyPlays) {
    if (!hasText(play.whenAppropriate)) issues.push(`Strategy is missing whenAppropriate: ${play.id}`);
    if (!hasText(play.ageContext)) issues.push(`Strategy is missing ageContext: ${play.id}`);
    if (!hasText(play.directChildValue)) issues.push(`Strategy is missing directChildValue: ${play.id}`);
    if (!hasText(play.adultDecisionContext)) issues.push(`Strategy is missing adultDecisionContext: ${play.id}`);
    if (!hasText(play.evidenceRationale)) issues.push(`Strategy is missing evidenceRationale: ${play.id}`);
    if (!hasTextList(play.formats)) issues.push(`Strategy is missing formats: ${play.id}`);
    if (!hasTextList(play.failureModes)) issues.push(`Strategy is missing failureModes: ${play.id}`);
    if (!hasTextList(play.ethicalConstraints)) issues.push(`Strategy is missing ethicalConstraints: ${play.id}`);
    if (!hasTextList(play.evidenceIds)) issues.push(`Strategy is missing evidenceIds: ${play.id}`);
    if (!hasTextList(play.insightIds)) issues.push(`Strategy is missing insightIds: ${play.id}`);
    if (!hasTextList(play.sourceIds)) issues.push(`Strategy is missing sourceIds: ${play.id}`);
    if (!hasTextList(play.relatedSpaceIds)) issues.push(`Strategy is missing relatedSpaceIds: ${play.id}`);
    if (!hasTextList(play.relatedCultureShaperIds)) issues.push(`Strategy is missing relatedCultureShaperIds: ${play.id}`);

    const playEvidenceIds = referenceIds(play.evidenceIds);
    const playInsightIds = referenceIds(play.insightIds);
    const playSourceIds = referenceIds(play.sourceIds);
    const playSpaceIds = referenceIds(play.relatedSpaceIds);
    const playCultureShaperIds = referenceIds(play.relatedCultureShaperIds);

    for (const evidenceId of playEvidenceIds) {
      if (!evidenceById.has(evidenceId)) issues.push(`Strategy references missing evidence: ${play.id} -> ${evidenceId}`);
    }
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

    const validEvidence = playEvidenceIds
      .map((id) => evidenceById.get(id))
      .filter((item): item is ContentGraph["evidenceItems"][number] => Boolean(item));
    const validInsightIds = new Set(playInsightIds.filter((id) => insightIds.has(id)));
    const validSourceIds = new Set(playSourceIds.filter((id) => sourceIds.has(id)));

    for (const item of validEvidence) {
      if (!validSourceIds.has(item.sourceId)) {
        issues.push(`Strategy evidence uses undeclared source: ${play.id} -> ${item.id} -> ${item.sourceId}`);
      }
      if (!item.insightIds.some((id) => validInsightIds.has(id))) {
        issues.push(`Strategy evidence does not support a declared insight: ${play.id} -> ${item.id}`);
      }
    }
    for (const sourceId of validSourceIds) {
      if (!validEvidence.some((item) => item.sourceId === sourceId)) {
        issues.push(`Strategy source has no selected evidence: ${play.id} -> ${sourceId}`);
      }
    }
    for (const insightId of validInsightIds) {
      if (!validEvidence.some((item) => item.insightIds.includes(insightId))) {
        issues.push(`Strategy insight has no selected evidence: ${play.id} -> ${insightId}`);
      }
    }
  }

  return issues;
};
