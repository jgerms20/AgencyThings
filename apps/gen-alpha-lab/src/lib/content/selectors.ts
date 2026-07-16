import { evidenceItems, insights } from "./evidence";
import { sources } from "./sources";
import type { EvidenceItem, Source } from "./types";

export const getSource = (id: string): Source | undefined => sources.find((source) => source.id === id);

export const getEvidenceForInsight = (id: string): EvidenceItem[] =>
  evidenceItems.filter((item) => item.insightIds.includes(id));

export const getInsight = (id: string) => insights.find((insight) => insight.id === id);
