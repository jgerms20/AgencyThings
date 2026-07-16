import { evidenceItems, insights, themes } from "./evidence";
import { sources } from "./sources";

const requiredEvidenceFields = ["population", "ageRange", "geography", "period", "methodology", "limitations"] as const;

const duplicateIds = (items: { id: string }[], label: string): string[] => {
  const seen = new Set<string>();
  const issues: string[] = [];

  for (const item of items) {
    if (seen.has(item.id)) issues.push(`Duplicate ${label} ID: ${item.id}`);
    seen.add(item.id);
  }

  return issues;
};

const hasDirectUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.hostname);
  } catch {
    return false;
  }
};

export const validateContentGraph = (): string[] => {
  const issues = [
    ...duplicateIds(themes, "theme"),
    ...duplicateIds(insights, "insight"),
    ...duplicateIds(sources, "source"),
    ...duplicateIds(evidenceItems, "evidence"),
  ];
  const themeIds = new Set(themes.map((theme) => theme.id));
  const insightIds = new Set(insights.map((insight) => insight.id));
  const sourceById = new Map(sources.map((source) => [source.id, source]));
  const evidenceById = new Map(evidenceItems.map((item) => [item.id, item]));

  for (const source of sources) {
    if (!hasDirectUrl(source.url)) issues.push(`Source has no direct HTTPS URL: ${source.id}`);
  }

  for (const item of evidenceItems) {
    if (!sourceById.has(item.sourceId)) issues.push(`Evidence references missing source: ${item.id}`);
    for (const field of requiredEvidenceFields) {
      if (!item[field].trim()) issues.push(`Evidence is missing ${field}: ${item.id}`);
    }
    for (const insightId of item.insightIds) {
      if (!insightIds.has(insightId)) issues.push(`Evidence references missing insight: ${item.id}`);
    }
  }

  for (const insight of insights) {
    if (!themeIds.has(insight.themeId)) issues.push(`Insight references missing theme: ${insight.id}`);
    const evidence = insight.evidenceIds.map((id) => evidenceById.get(id)).filter(Boolean);
    if (evidence.length !== insight.evidenceIds.length) issues.push(`Insight references missing evidence: ${insight.id}`);
    if (evidence.length < 2) issues.push(`Insight lacks two evidence items: ${insight.id}`);

    const sourceIds = new Set(evidence.map((item) => item!.sourceId));
    if (sourceIds.size < 2) issues.push(`Insight lacks two distinct sources: ${insight.id}`);
    if (!evidence.some((item) => sourceById.get(item!.sourceId)?.sourceClass !== "community signal")) {
      issues.push(`Insight lacks non-community evidence: ${insight.id}`);
    }
    if (evidence.some((item) => !item!.insightIds.includes(insight.id))) {
      issues.push(`Insight is not linked back from evidence: ${insight.id}`);
    }
  }

  return issues;
};
